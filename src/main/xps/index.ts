import { isNull } from "@/lib/util"
import sleep from "@/lib/util/sleep"
import { BrowserWindowConstructorOptions } from "electron";
import { readFile } from "../modular/general/file"
import Global from "../modular/general/global";
import { pupImg } from "../modular/pup";
import Window from '../modular/window';


/**
 * 获取配置文件
 * @returns 配置文件
 */
const getJson = async () => {
  return JSON.parse(await readFile(Global.getExternPath('gg.json'), { encoding: 'utf-8' }) as string) as { wifekeyword: string, ggopacity: number, winopacity: number, default: number }
}

/**
 * 初始化方法
 * @param windowId 窗口id
 * @param time 延迟时间
 */
const init = async (windowId: number | bigint, time?: number) => {
  if (!isNull(time)) {
    await sleep(time)
  }

  //加载失败处理 fail deal with
  Window.get(windowId).webContents.once('did-fail-load', async (event, errorCode, errorDescription, validatedURL, isMainFrame, frameProcessId, frameRoutingId) => {
    console.log(event, errorCode, errorDescription, validatedURL, isMainFrame, frameProcessId, frameRoutingId);
    Window.create({
      opacity: (await getJson()).winopacity,
      customize: {
        id: 3,
        title: '加载失败',
        route: '/notify',
        parentId: 0,
        data: { code: errorCode, msg: errorDescription, url: validatedURL }
      },
      height: 230,
      width: 600,
      modal: true,
      resizable: false
    })
  })
  Window.get(windowId).webContents.once('did-finish-load', async () => {
    Window.get(windowId).webContents.executeJavaScript(`
          window.ipc.send('window-func', { type: 'show' });
          ${await readFile(Global.getExternPath('.gg1js'))}
        `)
    // 首次注入css
    Window.get(windowId).webContents.insertCSS(`
              ${await readFile(Global.getExternPath('.gg1css'))}
              .T4LgNb{
                opacity: ${(await getJson()).ggopacity};
              }
              .VfPpkd-Jh9lGc{
                background: white;
                opacity: ${(await getJson()).ggopacity};
              }
              .VfPpkd-Jh9lGc1{
                background-color: #1a73e8;
                background-color: var(--gm-fillbutton-container-color,#1a73e8);
                opacity: ${(await getJson()).ggopacity};
              }
        `);
    //注入魔改原有后的样式 记录,伪类无法直接注入
    Window.get(windowId).webContents.executeJavaScript(`
          document.styleSheets[3].insertRule('.RvYhPd::before {background: transparent;border-bottom: 1px solid rgba(0, 0, 0, 0.12);content: "";display: block;overflow: hidden;width: 100%;z-index: -1;position: absolute;top: 0;left: 0;}', 0); 
        `)
    pupImg((await getJson()).wifekeyword).then(res => {
      Window.get(windowId).webContents.insertCSS(` 
                #yDmH0d{
                  background-size:100% 100%;
                  background-position: center;
                  background-image: url('${res}');
                } 
            `)
    })
  })
  Window.get(windowId).webContents.setWindowOpenHandler((): { action: "deny" } => {
    return { action: "deny" }
  })
  Window.get(windowId).webContents.on('will-navigate', (event, url) => {
    let tf = url.match(/translate_f/g)
    let sl = url.match(/ServiceLogin/g)
    if (sl) {
      event.preventDefault()
    }
    if (tf) {
      documInit(windowId)
    }
  })
}

/**
 * 文档翻译页面注入初始化
 * @param windowId 窗口id
 */
const documInit = async (windowId: number | bigint) => {
  Window.get(windowId).webContents.executeJavaScript(`
        let inputFHtml = document.createElement("input"); 
        inputFHtml.type = "button"
        inputFHtml.value = "返回"
        inputFHtml.id = "buttonF"
        inputFHtml.style = 'position: fixed;bottom: 20px;right: 20px;display: inline-block;margin-bottom: 0px;font-weight: normal;text-align: center;white-space: nowrap;vertical-align: middle;touch-action: manipulation;cursor: pointer;background-image: none;border: 1px solid transparent;padding: 6px 12px;font-size: 14px;line-height: 1.42857;border-radius: 4px;'
        document.getElementsByTagName('body')[0].appendChild(inputFHtml); 
        document.querySelector('#buttonF').onclick = function () {
          window.history.go(-1)
          window.ipc.invoke('init',0);
        }
    `)
}

export { getJson, init, documInit }