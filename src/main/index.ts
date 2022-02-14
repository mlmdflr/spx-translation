import App from './modular/app';
import Window from './modular/window';
import Global from './modular/general/global';
import Tray from './modular/additional/tray';
import { logOn } from './modular/general/log';
import { pathOn } from './modular/general/path';
import { fileOn } from './modular/general/file';
import Shortcut from "./modular/enhance/shortcut";
import { xpsOn } from './xps/toRenderer';
import { shortcutRegister, windowRegister } from './xps/toMain';
await App.start();
// 主要模块
Global.on();//全局模块
Window.on();//窗口模块
Shortcut.on();//快捷键模块
Tray.on();//托盘模块
logOn();//日志模块

// 可选模块
fileOn();//文件模块
pathOn();//路径模块

await App.use([
  import('./modular/general/session'),
  import('./modular/additional/dialog'),
  import('./modular/additional/menu'),
]);

await windowRegister()

shortcutRegister()

xpsOn()

// 托盘
Tray.create();
