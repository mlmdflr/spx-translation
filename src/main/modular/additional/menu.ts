import {
  BrowserWindow,
  ipcMain,
  Menu,
  nativeImage,
  MenuItem,
  MenuItemConstructorOptions
} from 'electron';
import { join } from 'path';
import testIcon from '@/assets/icon/test.png';
import win from "../window";
export default class Menus {
  constructor() {}

  /**
   * 监听
   */
  on() {
     // 注销原始菜单
     const menu = Menu.buildFromTemplate([]);
     Menu.setApplicationMenu(menu)
  }
}
