//@ts-nocheck
import { ipcMain } from "electron"
import { writeFile } from "../modular/general/file"
import Global from "../modular/general/global"
import { logError } from "../modular/general/log";
import { getSearchCount, pupImg } from "../modular/pup"
import Window from '../modular/window';
import { getJson, init } from ".";
import type { cfg } from ".";
import Shortcut from "../modular/enhance/shortcut";



function setCfg(args: cfg): Promise<unknown> {
  return writeFile(Global.getResourcesPath('extern', 'gg.json'), JSON.stringify(args), { encoding: 'utf-8' })
}


export const xpsOn = () => {

  /**
    * 向渲染进程提供翻译的加载初始化
    */
  ipcMain.handle('init', (e, a) => init(a))


  /**
   * 向渲染进程提供切换 背景图片
   */
  ipcMain.handle('switch-background', async (event, args) => {
    pupImg((await getJson()).wifekeyword).then(res => {
      Window.get(0).webContents.insertCSS(`
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
    event.returnValue = await getSearchCount(args)
  })


  /**
   * 向渲染进程提供修改配置文件
   */
  ipcMain.handle('updateCfg', (event, args) => {
    setCfg(args).then(res => {
      Window.get(0).webContents.insertCSS(`
          .T4LgNb{
            opacity: ${args.ggopacity};
          }
          .VfPpkd-Jh9lGc{
            background: white;
            opacity: ${args.ggopacity};
          }
      `)
      // 修改窗体的透明度
      Window.get(0).setOpacity(args.winopacity)
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
    if (Window.get(0).fullScreen) Window.get(0).setFullScreen(false)
    else Window.get(0).setFullScreen(true)
  })



  /**
   * 向渲染进程提供解除
   */
  ipcMain.handle('unregisterAll', () => {
    Shortcut.unregisterAll()
  })

}