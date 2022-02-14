import { app, ipcMain, shell } from 'electron';
import { resolve } from 'path';
import { logError } from '@/main/modular/general/log';
import Window from '@/main/modular/window';
import { isNull } from '@/util';

import { isDisableHardwareAcceleration, isSecondInstanceWin } from '@/cfg/app.json';
import { customize, opt } from '@/cfg/window.json';

export class App {
  private static instance: App;

  public modular: { [key: string]: any } = {};

  static getInstance() {
    if (!App.instance) App.instance = new App();
    return App.instance;
  }

  constructor() { }

  private uring(module: any) {
    this.modular[module.name] = new module();
    this.modular[module.name].on();
  }

  /**
   * 挂载模块
   * @param mod
   */
  async use(mod: any | any[] | Promise<any>[]) {
    if (!Array.isArray(mod)) {
      const module = mod.prototype ? mod : (await mod()).default;
      this.uring(module);
      return;
    }
    (await Promise.all(mod)).forEach((module) => this.uring(module.default || module));
  }

  /**
   * 启动主进程
   */
  async start() {
    this.beforeOn();
    // 协议调起
    let argv = [];
    if (!app.isPackaged) argv.push(resolve(process.argv[1]));
    argv.push('--');
    if (!app.isDefaultProtocolClient(app.name, process.execPath, argv))
      app.setAsDefaultProtocolClient(app.name, process.execPath, argv);
    await app.whenReady().catch(logError);
    this.afterOn();
  }



  /**
   * 监听
   */
  beforeOn() {
    //关闭硬件加速
    isDisableHardwareAcceleration && app.disableHardwareAcceleration();
    // 默认单例根据自己需要改
    if (!app.requestSingleInstanceLock()) app.quit();
    else {
      app.on('second-instance', (event, argv) => {
        // 当运行第二个实例时,将会聚焦到main窗口
        if (isSecondInstanceWin) {
          const main = Window.getMain();
          if (main) {
            if (main.isMinimized()) main.restore();
            main.show();
            main.focus();
          }
          return;
        }
        Window.create(
          {
            ...customize,
            argv
          },
          {
            ...opt
          }
        );
      });
    }
    // 渲染进程崩溃监听
    app.on('render-process-gone', (event, webContents, details) =>
      logError(
        '[render-process-gone]',
        webContents.getTitle(),
        webContents.getURL(),
        JSON.stringify(details)
      )
    );
    // 子进程崩溃监听
    app.on('child-process-gone', (event, details) =>
      logError('[child-process-gone]', JSON.stringify(details))
    );
    // 关闭所有窗口退出
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') app.quit();
    });
  }

  /**
  * 监听
  */
  afterOn() {
    // darwin
    app.on('activate', () => {
      if (Window.getAll().length === 0) Window.create(customize, opt);
    });
    // 获得焦点时发出
    app.on('browser-window-focus', () => {
      // 注册窗体重新加载,方便调试,不需要可将其关闭
      // Shortcut.register_id({
      //   id: 0,
      //   key: 'CommandOrControl+R',
      //   callback: () => {
      //   }
      // });
    });
    // 失去焦点时发出
    app.on('browser-window-blur', () => {
      // 注销窗体重新加载
      // Shortcut.unregister_id(0);
    });
    //app常用信息
    ipcMain.handle('app-info-get', (event, args) => {
      return {
        isPackaged: app.isPackaged,
        name: app.name,
        version: app.getVersion()
      };
    });
    //app常用获取路径
    ipcMain.handle('app-path-get', (event, args) => {
      return app.getPath(args.key);
    });
    //app打开外部url
    ipcMain.handle('app-open-url', (event, args) => {
      return shell.openExternal(args.url);
    });
    //app重启
    ipcMain.on('app-relaunch', (event, args) => {
      app.relaunch({ args: process.argv.slice(1) });
      if (args) app.exit(0);
    });
    //app开机自启
    ipcMain.on('app-launch', (event, args) => event.returnValue = this.autoLaunchSwitch(args));
  }


  /**
   * @description 开机自启开关 有参则设置或关闭开机自启并返回当前开机自启状态 | 无参即立刻返回当前开机自启状态
   * @author 没礼貌的芬兰人
   * @date 2021-09-24 11:56:18
   * @param openAtLogin 是否开启
   * @returns 开机自启状态
   */
  private autoLaunchSwitch(openAtLogin?: boolean): boolean {
    if (isNull(openAtLogin)) return app.getLoginItemSettings().openAtLogin
    switch (process.platform) {
      case 'win32':
        app.setLoginItemSettings({
          openAtLogin: openAtLogin
        })
        break;
      case 'darwin':
        app.setLoginItemSettings({
          openAtLogin: openAtLogin,
          openAsHidden: true
        })
        break;
      default:
        //其他不做处理
        break;
    }
    return app.getLoginItemSettings().openAtLogin
  }

}

export default App.getInstance();
