import App from './modular/app';
import Window from './modular/window';
import Global from './modular/general/global';
import Tray from './modular/additional/tray';
import { logOn } from './modular/general/log';
import { pathOn } from './modular/general/path';
import { fileOn } from './modular/general/file';
import Shortcut from "./modular/enhance/shortcut";

import Session from './modular/general/session';
import Dialog from './modular/additional/dialog';
import Menu from './modular/additional/menu';

import { xpsOn } from './xps/toRenderer';
import {  windowRegister } from './xps/toMain';
import xs from "./xps/xps_screenshots";
import xt from "./xps/xps_tesseract";

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

// 托盘
Tray.create();

xpsOn()

await windowRegister()

await App.use([Session, Dialog, Menu, xs, xt]);