import { BrowserWindow, ipcMain, session } from "electron"
import { logError } from "../modular/general/log";
import { getSearchCountApi, pupImgApi } from "../modular/pup"
import Window from '../modular/window';
import { getJson, setCfg, init } from ".";
import Shortcut from "../modular/enhance/shortcut";
import translate from "./google-translate-api";
import { isNull } from "@mlmdflr/tools";



export const xpsOn = () => {



  /**
   * 向渲染进程提供切换 背景图片
   */
  ipcMain.handle('switch-background', async (event, args) => {
    pupImgApi((await getJson()).wifekeyword).then(res => {
      (Window.get(0) as BrowserWindow).webContents.insertCSS(`
          #yDmH0d{
            background-size:100% 100%;
            background-position: center;
            background-image: url('${res}');
          }
      `)
    })
  })

  /**
   * 向渲染进程提供搜索关键字背景图片的数量
   */
  ipcMain.on('get-search-count', async (event, args) => {
    event.returnValue = await getSearchCountApi(args)
  })


  /**
   * 向渲染进程提供修改配置文件
   */
  ipcMain.handle('updateCfg', (event, args) => {
    setCfg(args).then(res => {
      (Window.get(0) as BrowserWindow).webContents.insertCSS(`
          .T4LgNb{
            opacity: ${args.ggopacity};
          }
          .VfPpkd-Jh9lGc{
            background: white;
            opacity: ${args.ggopacity};
          }
          .goog-container-vertical{
            opacity: ${args.ggopacity};
          }
      `);
    }).catch(err => {
      logError("[updateCfg]", err)
    })
  })

  ipcMain.handle('setCfg', (event, args) => {
    return setCfg(args)
  })


  /**
   * 向渲染进程提供获取配置文件
   */
  ipcMain.handle('getCfg', async () => {
    return await getJson()
  })


  /**
   * 向渲染进程提供全屏事件
   */
  ipcMain.handle('full-screen', () => {
    if ((Window.get(0) as BrowserWindow).fullScreen) (Window.get(0) as BrowserWindow).setFullScreen(false)
    else (Window.get(0) as BrowserWindow).setFullScreen(true)
  })

  /**
   * 向渲染进程提供解除
   */
  ipcMain.handle('unregisterAll', () => {
    Shortcut.unregisterAll()
  })

  //清除缓存
  ipcMain.handle('clear:cache', () => {
    session.defaultSession.clearCache()
  })
  //获取缓存大小
  ipcMain.handle('get:cache', () => session.defaultSession.getCacheSize())

  //打开设置窗体
  ipcMain.handle('open:window', async () => {
    Window.create(
      {
        id: 1,
        route: '/configure',
        parentId: 0,
        data: await getJson()
      },
      {
        height: 400,
        width: 600,
        modal: true,
        maxHeight: 400,
        maxWidth: 600,
        maximizable: false,
        minimizable: false
      }
    );
  })


  //翻译
  ipcMain.handle('translate-text', async (_, args) => {
    const cfg = await getJson()
    return translate(args.o, { from: args.lang_o, to: args.lang_g, tld: isNull(cfg.default) ? 'cn' : (cfg.default === 2 ? 'com' : 'cn') }, { timeout: 3000 }, cfg.proxy.open ? cfg.proxy : undefined)
  })
}