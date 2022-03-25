import {
  Menu,
} from 'electron';
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
