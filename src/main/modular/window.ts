import { join } from 'path';
import type { BrowserWindowConstructorOptions, LoadFileOptions, LoadURLOptions, HandlerDetails } from 'electron';
import { app, screen, ipcMain, BrowserWindow } from 'electron';
import { snowflake } from "@/lib/util/snowflake";
import { isNull } from '@/lib/util';

const windowCfg = require('@/cfg/window.json');
const { workerId, dataCenterId } = require('@/cfg/snowflake.json')

/**
 * Customize.id 类型限制为number | bigint 
 */

/**
 * 窗口配置
 * @param args
 */
export function browserWindowInit(args: BrowserWindowConstructorOptions): BrowserWindow {
  if (!args || !args.customize) throw new Error('not args');
  args.minWidth = args.minWidth || args.width || windowCfg.width;
  args.minHeight = args.minHeight || args.height || windowCfg.height;
  args.width = args.width || windowCfg.width;
  args.height = args.height || windowCfg.height;
  // darwin下modal会造成整个窗口关闭(?)
  if (process.platform === 'darwin') delete args.modal;
  const isLocal = !args.customize.route;
  let opt: BrowserWindowConstructorOptions = Object.assign(args, {
    autoHideMenuBar: true,
    titleBarStyle: args.customize.route ? 'hidden' : 'default',
    frame: isNull(args.frame) ? isLocal : args.frame,
    show: false,
    webPreferences: {
      preload: join(__dirname, './preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: !app.isPackaged,
      webSecurity: false
    }
  });
  if (!opt.backgroundColor && !windowCfg.backgroundColor)
    opt.backgroundColor = windowCfg.backgroundColor;
  if (!isNull(opt.customize.parentId)) {
    opt.parent = Window.getInstance().get(opt.customize.parentId);
    const currentWH = opt.parent.getBounds();
    opt.customize.currentWidth = currentWH.width;
    opt.customize.currentHeight = currentWH.height;
    opt.customize.currentMaximized = opt.parent.isMaximized();
    if (opt.customize.currentMaximized) {
      const displayWorkAreaSize = screen.getPrimaryDisplay().workAreaSize;
      opt.x = ((displayWorkAreaSize.width - (opt.width || 0)) / 2) | 0;
      opt.y = ((displayWorkAreaSize.height - (opt.height || 0)) / 2) | 0;
    } else {
      const currentPosition = opt.parent.getPosition();
      opt.x =
        (currentPosition[0] + (currentWH.width - (opt.width || opt.customize.currentWidth)) / 2) |
        0;
      opt.y =
        (currentPosition[1] +
          (currentWH.height - (opt.height || opt.customize.currentHeight)) / 2) |
        0;
    }
  } else {
    const main = Window.getInstance().getMain();
    if (main) {
      const mainPosition = main.getPosition();
      const mainBounds = main.getBounds();
      opt.x = (mainPosition[0] + (mainBounds.width - opt.width) / 2) | 0;
      opt.y = (mainPosition[1] + (mainBounds.height - opt.height) / 2) | 0;
    }
  }

  /**
   * @description 特别注意 此处是为了保证窗口id的唯一性 设置id时如果已经有了则是默认雪花算法生成
   * @author 没礼貌的芬兰人
   * @date 2021-09-25 11:54:59
   */
  if (!isNull(opt.customize.id) && !Window.getInstance().checkId(opt.customize.id)) opt.customize.id = new snowflake(BigInt(workerId), BigInt(dataCenterId)).nextId()

  const win = new BrowserWindow(opt);

  /**
   * 在url下 二级窗体可控创建(open打开窗体)
   * 默认仅二级控制
   * 建议:
   * ---- 正常情况二级控制够用了,特殊需求请自己实现多级控制 或者考虑重新创建一级窗口
   * @author 没礼貌的芬兰人
   * @date 2021-11-15 15:57:45
   */
  if (!win.customize?.route) {
    win.webContents.setWindowOpenHandler((): { action: "allow"; overrideBrowserWindowOptions?: BrowserWindowConstructorOptions; } => {
      return {
        action: 'allow', overrideBrowserWindowOptions: {
          minWidth: args.minWidth || args.width || windowCfg.width,
          minHeight: args.minHeight || args.height || windowCfg.height,
          width: args.width || windowCfg.width,
          height: args.height || windowCfg.height,
          autoHideMenuBar: true,
          titleBarStyle: args.customize.route ? 'hidden' : 'default',
          webPreferences: {
            preload: join(__dirname, './preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            devTools: !app.isPackaged,
            webSecurity: false
          }
        } as BrowserWindowConstructorOptions
      }
    })
    win.webContents.on('did-create-window', (window, details) => {
      window.customize = {
        id: new snowflake(BigInt(workerId), BigInt(dataCenterId)).nextId(),
        url: details.url
      }
    })
  }

  /**
   * 2021.9.6修改:
   * 废弃BrowserWindow.id
   * 使用customize.id来确定窗体id
   * 默认为雪花算法生成
   * 
   * 2021.9.25修改:
   * 包装customize.id唯一性
   * 主观设置的id值不一定有效,以实际获取为准
   * 
   */
  win.customize = {
    id: new snowflake(BigInt(workerId), BigInt(dataCenterId)).nextId(),
    ...opt.customize
  };
  if (!win.customize.argv) win.customize.argv = process.argv;
  return win;
}

/**
 * 窗口加载
 */
function load(win: BrowserWindow) {
  /**
  * @description 监听操作更加细腻,指定到每个窗口
  * @author 没礼貌的芬兰人
  * @date 2021-09-25 16:27:27
  */
  // 注入初始化代码
  win.webContents.on('did-finish-load', () => win.webContents.send(`window-load`, win.customize));
  // 窗口最大最小监听
  win.on('maximize', () => win.webContents.send(`window-maximize-${win.customize.id}`, 'maximize'));
  win.on('unmaximize', () => win.webContents.send(`window-maximize-${win.customize.id}`, 'unmaximize'));
  // 聚焦失焦监听 
  win.on('blur', () => win.webContents.send(`window-blur-focus-${win.customize.id}`, 'blur'));
  win.on('focus', () => win.webContents.send(`window-blur-focus-${win.customize.id}`, 'focus'));

  if (win.customize.url.startsWith('https://') || win.customize.url.startsWith('http://')) {
    win.loadURL(win.customize.url, win.customize.loadOptions as LoadURLOptions);
    return;
  }
  win.loadFile(win.customize.url, win.customize.loadOptions as LoadFileOptions);
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
    let win: BrowserWindow = null;
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
  create(args?: BrowserWindowConstructorOptions) {
    args = args || {
      customize: {
        route: windowCfg.initRoute
      }
    };
    if (!args.customize.isOpenMultiWindow && windowCfg.single) {
      for (const i of this.getAll()) {
        if (
          (args.customize?.route && args.customize.route === i.customize?.route) ||
          (args.customize?.url && args.customize.url === i.customize?.url)
        ) {
          i.focus();
          return;
        }
      }
    }
    const win = browserWindowInit(args);
    // 路由 > html文件 > 网页
    if (!app.isPackaged) {
      //调试模式
      try {
        import('fs').then(({ readFileSync }) => {
          const appPort = readFileSync(join('.port'), 'utf8');
          win.webContents.openDevTools({ mode: 'detach' });
          if (!win.customize.url) win.customize.url = `http://localhost:${appPort}`;
          load(win);
        });
      } catch (e) {
        throw 'not found .port';
      }
      return;
    }
    if (!win.customize.url) win.customize.url = join(__dirname, '../index.html');
    load(win);
  }

  /**
   * 窗口关闭、隐藏、显示等常用方法
   */
  func(type: windowFuncOpt, id?: number | bigint) {
    let win: BrowserWindow = null;
    if (!isNull(id)) {
      win = this.get(id);
      if (!win) {
        console.error(`not found win -> ${id}`);
        return;
      }
      win[type]()
      return;
    }
    for (const i of this.getAll()) i[type]();
  }

  /**
   * 窗口发送消息
   */
  send(key: string, value: any, id?: number | bigint) {
    if (!isNull(id)) {
      const win = this.get(id);
      if (win) win.webContents.send(key, value);
    } else for (const i of this.getAll()) i.webContents.send(key, value);
  }

  /**
   * 窗口状态
   */
  getStatus(type: windowStatusOpt, id: number | bigint) {
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
    this.get(args.id).setMinimumSize(args.size[0], args.size[1]);
  }

  /**
   * 设置窗口最大大小
   */
  setMaxSize(args: { id: number | bigint; size: number[] }) {
    this.get(args.id).setMaximumSize(args.size[0], args.size[1]);
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
    this.get(args.id).setBackgroundColor(args.color || windowCfg.backgroundColor);
  }

  /**
   * 设置窗口是否置顶
   */
  setAlwaysOnTop(args: { id: number | bigint; is: boolean; type?: windowAlwaysOnTopOpt }) {
    this.get(args.id).setAlwaysOnTop(args.is, args.type || 'normal');
  }

  /**
   * 开启监听
   */
  on() {
    //窗口数据更新
    ipcMain.on('window-update', (event, args) => {
      if (!isNull(args.id)) this.get(args.id).customize = args;
    });
    //最大化最小化窗口
    ipcMain.on('window-max-min-size', (event, id) => {
      if (!isNull(id)) {
        const win = this.get(id);
        if (win.isMaximized()) win.unmaximize();
        else win.maximize();
      }
    });
    //窗口消息
    ipcMain.on('window-func', (event, args) => this.func(args.type, args.id));
    //窗口状态
    ipcMain.handle('window-status', (event, args) => this.getStatus(args.type, args.id));
    //创建窗口
    ipcMain.on('window-new', (event, args) => this.create(args));
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
          if (this.get(i)) this.get(i).webContents.send(channel, args.value);
        }
      }
      if (args.isback) {
        this.get(args.id).webContents.send(channel, args.value);
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
        this.get(args.id).webContents.send(channel, args.value);
      }
    });

    /**
     * @description 通过路由获取窗口id (不传route查全部)
     * @author 没礼貌的芬兰人
     * @date 2021-11-15 16:27:02
     * 2021.9.6修改:
     * ------------ 废弃BrowserWindow.id,使用customize.id
     * 2021.11.15修改:
     * ------------ 过滤在二级窗体以后创建的不可控窗体 关于二级窗体的创建详细请看 browserWindowInit 方法 
     */
    ipcMain.handle('window-id-route', (event, args) => {
      return this.getAll()
        .filter((win) => (win.customize))
        .filter((win) => (args.route ? win.customize?.route === args.route : true))
        .map(win => win.customize?.id)
    });

    /**
     * @description 通过url获取窗口id indexOf 查找匹配 请在特定场景下使用
     * @author 没礼貌的芬兰人
     * @date 2021-11-15 16:48:32
     */
    ipcMain.handle('window-id-url', (event, args) => {
      return this.getAll()
        .filter(win => (!win.customize?.route))
        .filter((win) => (win.customize))
        .filter((win) => (args.url ? win.customize?.url.indexOf(args.url) !== -1 : true))
        .map(win => win.customize?.id)
    });
  }
}

export default Window.getInstance();
