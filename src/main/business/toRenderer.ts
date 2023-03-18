import { ipcMain, Session, session as eleSess, webContents, BrowserWindow } from "electron"
import { logWrapper } from "@mlmdflr/electron-modules/main/log";
import { getSearchCountApi, pupImgApi } from "../modular/pup"
import { windowInstance } from '@mlmdflr/electron-modules/main/window';
import { viewInstance } from '@mlmdflr/electron-modules/main/view';
import { getJson, setCfg, } from ".";
import Shortcut from "@mlmdflr/electron-modules/main/shortcut";
import translate from "@/main/google-translate-api";
import { isNull } from "@mlmdflr/tools";



export const renderOn = (...session: Session[]) => {



  /**
   * 向渲染进程提供切换 背景图片
   */
  ipcMain.handle('switch-background', async (event, args) => {
    getJson().then(json => {
      pupImgApi(json.wifekeyword, json.proxy.open ? json.proxy : undefined).then(res => {
        windowInstance.send('window-message-switch-background-back', res)
        for (const view of viewInstance.getViewAll()) view.webContents.send('window-message-switch-background-json-back', json)
      })
    })
  })

  /**
   * 向渲染进程提供搜索关键字背景图片的数量
   */
  ipcMain.handle('get-search-count', async (event, args) => {
   let json = await getJson()
    return await getSearchCountApi(args, json.proxy.open ? json.proxy : undefined)
  })


  /**
   * 向渲染进程提供修改配置文件
   */
  ipcMain.handle('updateCfg', (event, args) => {
    setCfg(args).then(res => {
      for (const view of viewInstance.getViewAll()) {
        switch (view.customize.session.key) {
          case 'google':
            view.webContents.insertCSS(
              `
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
        `)
            break;
          case 'deepl':
            view.webContents.insertCSS(
              `
                #dl_translator{
                  opacity: ${args.ggopacity};
              }
              .modal--l9GBM.noScroll--XcXwq.modal--HdqMl{
                  opacity: ${args.ggopacity};
              }
          `)
            break;
          default:
            break;
        }
      }


    }).catch(err => {
      logWrapper('error', undefined, "[updateCfg]", err)
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
    const main = windowInstance.getMain()
    if (main && main.fullScreen) {
      main.setFullScreen(false)
    } else main?.setFullScreen(true)
  })

  /**
   * 向渲染进程提供解除
   */
  ipcMain.handle('unregisterAll', () => {
    Shortcut.shortcutInstance.unregisterAll()
  })

  //清除缓存
  ipcMain.handle('clear:cache', () => {
    for (const iterator of session) iterator.clearCache()
  })
  //获取缓存大小
  ipcMain.handle('get:cache', async () => {
    let sum = 0;
    for (const iterator of session) sum += await iterator.getCacheSize()
    return sum
  })
  //打开设置窗体
  ipcMain.handle('open:window', async (event, _) => {
    windowInstance.create(
      {
        id: 1,
        route: '/configure',
        parentId: BrowserWindow.fromWebContents(event.sender)?.customize.id,
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