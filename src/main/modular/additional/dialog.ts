import { dialog, ipcMain } from 'electron';
import { logError } from '../general/log';
import Window from '../window';
export default class Dialog {
  constructor() {}
  /**
   * 监听
   */
  on() {
    ipcMain.handle('open-dialog', (event, args) => {
      const win = Window.get(args.winId);
      if (!win) {
        logError(`not found win -> ${args.winId}`);
        return;
      }
      dialog.showOpenDialog(win, args.params)
    });
  }
}
