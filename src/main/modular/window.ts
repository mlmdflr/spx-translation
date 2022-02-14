import { join } from 'path';
import type { BrowserWindowConstructorOptions, LoadFileOptions, LoadURLOptions } from 'electron';
import { app, screen, ipcMain, BrowserWindow } from 'electron';
import { Snowflake } from "@/util/snowflake";
import windowCfg from '@/cfg/window.json'
import { workerId, dataCenterId } from '@/cfg/snowflake.json'

/**
 * 窗口配置
 * @param args
 */
export function browserWindowInit(
  customize: Customize,
  args: BrowserWindowConstructorOptions = {}
): BrowserWindow {
  if (!customize) throw new Error('not customize');
  //重置主窗体
  if (customize.isMainWin && customize.parentId !== undefined && customize.parentId !== null) customize.isMainWin = false;
  const main = Window.getInstance().getMain();
  if (main
    && main.customize.isMainWin
    && customize.isMainWin
    && (customize.parentId === undefined || customize.parentId === null)
  ) main.customize.isMainWin = false;
  args.minWidth = args.minWidth || args.width || windowCfg.opt.width;
  args.minHeight = args.minHeight || args.height || windowCfg.opt.height;
  args.width = args.width || windowCfg.opt.width;
  args.height = args.height || windowCfg.opt.height;
  // darwin下modal会造成整个窗口关闭(?)
  if (process.platform === 'darwin') delete args.modal;
  const isLocal = 'route' in customize;
  let opt: BrowserWindowConstructorOptions = Object.assign(args, {
    autoHideMenuBar: true,
    titleBarStyle: isLocal ? 'hidden' : 'default',
    frame: args.frame ?? !isLocal,
    show: args.show ?? !isLocal,
    webPreferences: {
      preload: isLocal ? join(__dirname, './preload.js') : join(__dirname, './preload.url.js'),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: !app.isPackaged,
      webSecurity: false
    }
  });
  if (!opt.backgroundColor && windowCfg.opt.backgroundColor)
    opt.backgroundColor = windowCfg.opt.backgroundColor;
  const isParentId = customize.parentId !== undefined && customize.parentId !== null;
  let parenWin: BrowserWindow | null = null;
  if (isParentId && (typeof customize.parentId === 'number' || typeof customize.parentId === 'bigint')) parenWin = Window.getInstance().get(customize.parentId);
  if (isParentId && parenWin) {
    opt.parent = parenWin;
    const currentWH = opt.parent.getBounds();
    customize.currentWidth = currentWH.width;
    customize.currentHeight = currentWH.height;
    customize.currentMaximized = opt.parent.isMaximized();
    if (customize.currentMaximized) {
      const displayWorkAreaSize = screen.getPrimaryDisplay().workAreaSize;
      opt.x = ((displayWorkAreaSize.width - (opt.width || 0)) / 2) | 0;
      opt.y = ((displayWorkAreaSize.height - (opt.height || 0)) / 2) | 0;
    } else {
      const currentPosition = opt.parent.getPosition();
      opt.x = (currentPosition[0] + (currentWH.width - (opt.width || customize.currentWidth)) / 2) | 0;
      opt.y = (currentPosition[1] + (currentWH.height - (opt.height || customize.currentHeight)) / 2) | 0;
    }
  }

  /**
   * @description 设置id时如果已经有了则是默认雪花算法生成
   * @author 没礼貌的芬兰人
   * @date 2021-09-25 11:54:59
   */
  if ((customize.id !== undefined && customize.id !== null) && !Window.getInstance().checkId(customize.id as number | bigint)) customize.id = new Snowflake(BigInt(workerId), BigInt(dataCenterId)).nextId()

  const win = new BrowserWindow(opt);
  //子窗体关闭父窗体获焦 https://github.com/electron/electron/issues/10616
  if (isParentId && parenWin) {
    win.once('closed', () => {
      parenWin?.focus()
    })
  }
  win.customize = {
    id: new Snowflake(BigInt(workerId), BigInt(dataCenterId)).nextId(),
    ...customize
  };

  if (!win.customize.argv) win.customize.argv = process.argv;
  return win;
}

/**
 * 窗口加载
 */
async function load(win: BrowserWindow) {
  // 注入初始化代码
  win.webContents.on('did-finish-load', () => {
    if ('route' in win.customize) win.webContents.send(`window-load`, win.customize)
  });
  // 窗口最大最小监听
  win.on('maximize', () => win.webContents.send(`window-maximize-${win.customize.id}`, 'maximize'));
  win.on('unmaximize', () => win.webContents.send(`window-maximize-${win.customize.id}`, 'unmaximize'));
  // 聚焦失焦监听 
  win.on('blur', () => win.webContents.send(`window-blur-focus-${win.customize.id}`, 'blur'));
  win.on('focus', () => win.webContents.send(`window-blur-focus-${win.customize.id}`, 'focus'));
  //页面加载
  if ('route' in win.customize && win.customize.baseUrl) {
    if (win.customize.baseUrl.startsWith('https://') || win.customize.baseUrl.startsWith('http://')) {
      win.loadURL(win.customize.baseUrl, win.customize.loadOptions as LoadURLOptions);
      return;
    }
    win.loadFile(win.customize.baseUrl, win.customize.loadOptions as LoadFileOptions);
  } else if ('url' in win.customize && win.customize.url) {
    if (win.customize.url.startsWith('https://') || win.customize.url.startsWith('http://')) {
      win.loadURL(win.customize.url, win.customize.loadOptions as LoadURLOptions);
      return;
    }
    win.loadFile(win.customize.url, win.customize.loadOptions as LoadFileOptions);
  } else {
    throw new Error(`url error`)
  }
}

export class Window {
  private static instance: Window;

  static getInstance() {
    if (!Window.instance) Window.instance = new Window();
    return Window.instance;
  }

  constructor() { }

  /**
   * 获取窗口
   * @param id 窗口id
   * @constructor
   */
  get(id: number | bigint) {
    const all = this.getAll()
    for (let key in all) {
      if (all[key].customize?.id === id) {
        return all[key]
      }
    }
    return null
  }

  /**
   * 获取全部窗口
   */
  getAll() {
    return BrowserWindow.getAllWindows();
  }

  /**
  * 获取主窗口(无主窗口获取后存在窗口)
  */
  getMain() {
    const all = BrowserWindow.getAllWindows().reverse();
    let win: BrowserWindow | null = null;
    for (let index = 0; index < all.length; index++) {
      const item = all[index];
      if (index === 0) win = item;
      if (item.customize?.isMainWin) {
        win = item;
        break;
      }
    }
    return win;
  }


  /**
   * @description 检查id是否已经存在
   * @author 没礼貌的芬兰人
   * @date 2021-09-25 10:53:32  
   * @param id 
   */
  checkId(id: number | bigint): boolean {
    for (const wins of this.getAll()) {
      if (wins.customize?.id === id) {
        return false
      }
    }
    return true
  }


  /**
   * 创建窗口
   * */
  create(customize: Customize, opt: BrowserWindowConstructorOptions) {
    if ('route' in customize && !customize.isOpenMultiWindow) {
      for (const i of this.getAll()) {
        if ('route' in i.customize && customize.route && customize.route === i.customize.route) {
          i.focus();
          return;
        }
      }
    }
    const win = browserWindowInit(customize, opt);
    // 路由 > html文件 > 网页
    if (!app.isPackaged) {
      //调试模式
      try {
        import('fs').then(({ readFileSync }) => {
          const appPort = readFileSync(join('.port'), 'utf8');
          win.webContents.openDevTools({ mode: 'detach' });
          if ('route' in win.customize) win.customize.baseUrl = `http://localhost:${appPort}`;
          load(win);
        });
      } catch (e) {
        throw 'not found .port';
      }
      return;
    }
    if ('route' in win.customize) win.customize.baseUrl = join(__dirname, '../index.html');
    load(win);
  }

  /**
   * 窗口关闭、隐藏、显示等常用方法
   */
  func(type: WindowFuncOpt, id?: number | bigint, data?: any[]) {
    if (id !== null && id !== undefined) {
      const win = this.get(id as number);
      if (!win) {
        console.error(`not found win -> ${id}`);
        return;
      }
      // @ts-ignore
      data ? win[type](...data) : win[type]();
      return;
    }
    // @ts-ignore
    if (data) for (const i of this.getAll()) i[type](...data);
    else for (const i of this.getAll()) i[type]();
  }

  /**
   * 窗口发送消息
   */
  send(key: string, value: any, id?: number | bigint) {
    if (id !== undefined && id !== null) {
      const win = this.get(id as number | bigint);
      if (win) win.webContents.send(key, value);
    } else for (const i of this.getAll()) i.webContents.send(key, value);
  }

  /**
   * 窗口状态
   */
  getStatus(type: WindowStatusOpt, id: number | bigint) {
    const win = this.get(id);
    if (!win) {
      console.error('Invalid id, the id can not be a empty');
      return;
    }
    return win[type]();
  }

  /**
   * 设置窗口最小大小
   */
  setMinSize(args: { id: number | bigint; size: number[] }) {
    const win = this.get(args.id);
    if (!win) {
      console.error('Invalid id, the id can not be a empty');
      return;
    }
    const workAreaSize = args.size[0]
      ? { width: args.size[0], height: args.size[1] }
      : screen.getPrimaryDisplay().workAreaSize;
    win.setMaximumSize(workAreaSize.width, workAreaSize.height);
  }

  /**
   * 设置窗口最大大小
   */
  setMaxSize(args: { id: number | bigint; size: number[] }) {
    const win = this.get(args.id);
    if (!win) {
      console.error('Invalid id, the id can not be a empty');
      return;
    }
    win.setMaximumSize(args.size[0], args.size[1]);
  }

  /**
   * 设置窗口大小
   */
  setSize(args: { id: number | bigint; size: number[]; resizable: boolean; center: boolean }) {
    let Rectangle: { [key: string]: number } = {
      width: args.size[0] | 0,
      height: args.size[1] | 0
    };
    const win = this.get(args.id);
    if (!win) {
      console.error('Invalid id, the id can not be a empty');
      return;
    }
    const winBounds = win.getBounds();
    if (Rectangle.width === winBounds.width && Rectangle.height === winBounds.height) return;
    if (!args.center) {
      const winPosition = win.getPosition();
      Rectangle.x = (winPosition[0] + (winBounds.width - args.size[0]) / 2) | 0;
      Rectangle.y = (winPosition[1] + (winBounds.height - args.size[1]) / 2) | 0;
    }
    win.once('resize', () => {
      if (args.center) win.center();
    });
    win.setResizable(args.resizable);
    win.setMinimumSize(Rectangle.width, Rectangle.height);
    win.setBounds(Rectangle);
  }

  /**
   * 设置窗口背景色
   */
  setBackgroundColor(args: { id: number | bigint; color: string }) {
    const win = this.get(args.id);
    if (!win) {
      console.error('Invalid id, the id can not be a empty');
      return;
    }
    win.setBackgroundColor(args.color || windowCfg.opt.backgroundColor);
  }

  /**
   * 设置窗口是否置顶
   */
  setAlwaysOnTop(args: { id: number | bigint; is: boolean; type?: WindowAlwaysOnTopOpt }) {
    const win = this.get(args.id);
    if (!win) {
      console.error('Invalid id, the id can not be a empty');
      return;
    }
    win.setAlwaysOnTop(args.is, args.type || 'normal');
  }

  /**
   * 开启监听
   */
  on() {
    //窗口数据更新
    ipcMain.on('window-update', (event, args) => {
      if (args.id !== undefined && args.id !== null) {
        const win = this.get(args.id);
        if (!win) {
          console.error('Invalid id, the id can not be a empty');
          return;
        }
        win.customize = args;
      }
    });
    //最大化最小化窗口
    ipcMain.on('window-max-min-size', (event, id) => {
      if (id !== undefined && id !== null) {
        const win = this.get(id);
        if (!win) {
          console.error('Invalid id, the id can not be a empty');
          return;
        }
        if (win.isMaximized()) win.unmaximize();
        else win.maximize();
      }
    });
    //窗口消息
    ipcMain.on('window-func', (event, args) => this.func(args.type, args.id, args.data));
    //窗口消息-关闭(内置为主窗体关闭则全部退出)
    ipcMain.on('window-close', (event, args) => {
      let win: BrowserWindow | null = null;
      let main: BrowserWindow = this.getMain() as BrowserWindow;
      if (args !== undefined && args !== null) {
        win = this.get(args as number | bigint);
        if (!win) {
          console.error(`not found win -> ${args}`);
          return;
        }
        if (main.customize.isMainWin && main.customize.id === win.customize.id) {
          this.func('close')
        } else {
          win.close()
        }
      }
    });
    //窗口状态
    ipcMain.handle('window-status', (event, args) => this.getStatus(args.type, args.id));
    //创建窗口
    ipcMain.on('window-new', (event, args) => this.create(args.customize, args.opt));
    //设置窗口是否置顶
    ipcMain.on('window-always-top-set', (event, args) => this.setAlwaysOnTop(args));
    //设置窗口大小
    ipcMain.on('window-size-set', (event, args) => this.setSize(args));
    //设置窗口最小大小
    ipcMain.on('window-min-size-set', (event, args) => this.setMinSize(args));
    //设置窗口最大大小
    ipcMain.on('window-max-size-set', (event, args) => this.setMaxSize(args));
    //设置窗口背景颜色
    ipcMain.on('window-bg-color-set', (event, args) => this.setBackgroundColor(args));
    //窗口消息(指定发送)
    ipcMain.on('window-message-send', (event, args) => {
      let channel = `window-message-${args.channel}-back`;
      if (args.acceptIds && args.acceptIds.length > 0) {
        for (let i of args.acceptIds) {
          let win = this.get(i)
          if (win) {
            win.webContents.send(channel, args.value);
          }
        }
      }
      if (args.isback) {
        let win = this.get(args.id)
        if (win) {
          win.webContents.send(channel, args.value);
        }
      }
    });
    //窗口消息(全部发送)
    ipcMain.on('window-message-send-all', (event, args) => {
      let channel = `window-message-${args.channel}-back`;
      for (let i of this.getAll()) {
        if (i.customize.id !== args.id) {
          i.webContents.send(channel, args.value);
        }
      }
      if (args.isback) {
        let win = this.get(args.id)
        if (win) {
          win.webContents.send(channel, args.value);
        }
      }
    });

    /**
     * @description 通过路由获取窗口id (不传route查全部)
     * @author 没礼貌的芬兰人
     * @date 2021-11-15 16:27:02
     * 2021.9.6修改:
     * ------------ 废弃BrowserWindow.id,使用customize.id
     */
    ipcMain.handle('window-id-route', (event, args) => {
      return this.getAll()
        .filter((win) => (win.customize && ('route' in win.customize)))
        .filter((win) => (args ? (win.customize as Customize_Route).route === args : true))
        .map(win => win.customize?.id)
    });
    /**
     * 查询当前会话的窗体id
     */
    ipcMain.handle('window-id-sender', (event, args) => {
      return BrowserWindow.fromWebContents(event.sender)?.customize.id
    });
    /**
     * 查询所有窗体id(过滤掉route窗体)
     */
    ipcMain.handle('window-id-all', (event, args) => {
      return this.getAll()
        .filter((win) => (win.customize && ('url' in win.customize)))
        .map(win => win.customize?.id)
    });
  }
}

export default Window.getInstance();
