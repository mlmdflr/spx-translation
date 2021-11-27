import {
  BrowserWindow,
  ipcMain,
  Menu,
  nativeImage,
  MenuItem,
  MenuItemConstructorOptions
} from 'electron';
import { join } from 'path';
import testIcon from '@/lib/assets/icon/test.png';

export default class Menus {
  constructor() { }

  /**
   * 监听
   */
  on() {
    ipcMain.on('menu-show', (event) => {
      const template: Array<MenuItemConstructorOptions | MenuItem> = [
        {
          label: '右键弹框测试',
          icon: nativeImage.createFromPath(join(__dirname, `../${testIcon}`)),
          click: () => {
            event.sender.send('menu-back', '邪王真眼是最强的');
          }
        },
        { label: 'Menu Item 2', type: 'checkbox', checked: true }
      ];
      const menu = Menu.buildFromTemplate(template);
      menu.popup({
        window: BrowserWindow.fromWebContents(event.sender)
      });
    });
  }
}
