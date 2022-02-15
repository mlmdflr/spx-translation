//@ts-nocheck
import sleep from "@/util/sleep"
import { readFile } from "../modular/general/file"
import Global from "../modular/general/global";
import { logInfo } from "../modular/general/log";
import { pupImg } from "../modular/pup";
import Window from '../modular/window';


export type cfg = { wifekeyword: string, ggopacity: number, winopacity: number, default: number }


/**
 * 获取配置文件
 * @returns 配置文件
 */
const getJson = async () => {
  return JSON.parse(await readFile(Global.getResourcesPath("extern", 'gg.json'), { encoding: 'utf-8' }) as string) as cfg
}

/**
 * 初始化方法
 * @param windowId 窗口id
 * @param time 延迟时间
 */
const init = async (windowId: number | bigint, time?: number) => {
  if (time !== undefined) {
    await sleep(time)
  }

  //加载失败处理 fail deal with
  Window.get(windowId).webContents.once('did-fail-load', async (event, errorCode, errorDescription, validatedURL, isMainFrame, frameProcessId, frameRoutingId) => {
    console.log(event, errorCode, errorDescription, validatedURL, isMainFrame, frameProcessId, frameRoutingId);
    logInfo(`[did-fail-load]\n`, errorCode, errorDescription, validatedURL, isMainFrame, frameProcessId, frameRoutingId)
    if (validatedURL === "https://translate.google.com/?sl=auto&tl=zh-CN" || validatedURL === "https://translate.google.cn/?sl=auto&tl=zh-CN") {
      Window.create({
        id: 3,
        title: '加载失败',
        route: '/notify',
        parentId: 0,
        data: { code: errorCode, msg: errorDescription, url: validatedURL }
      }, {
        opacity: (await getJson()).winopacity,
        height: 230,
        width: 600,
        modal: true,
        resizable: false
      })
    }
  })


  //开始加载显示窗体
  Window.get(windowId).webContents.once('did-start-loading', () => {
    Window.get(windowId).webContents.executeJavaScript(`
      window.ipc.send('window-func', { type: 'show' });
    `)
  })

  //加载完成注入
  Window.get(windowId).webContents.once('dom-ready', async () => {
    Window.get(windowId).webContents.executeJavaScript(`
          window.ipc.send('window-func', { type: 'show' });
          ${await readFile(Global.getResourcesPath("extern", '.gg1js'))}
        `).catch(()=>{})
    // 首次注入css
    Window.get(windowId).webContents.insertCSS(`
              ${await readFile(Global.getResourcesPath("extern", '.gg1css'))}
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
        `).catch(()=>{});
    //注入魔改原有后的样式 记录,伪类无法直接注入
    Window.get(windowId).webContents.executeJavaScript(`
          document.styleSheets[3].insertRule('.RvYhPd::before {background: transparent;border-bottom: 1px solid rgba(0, 0, 0, 0.12);content: "";display: block;overflow: hidden;width: 100%;z-index: -1;position: absolute;top: 0;left: 0;}', 0); 
        `).catch(()=>{})
    pupImg((await getJson()).wifekeyword).then(res => {
      Window.get(windowId).webContents.insertCSS(` 
                #yDmH0d{
                  background-size:100% 100%;
                  background-position: center;
                  background-image: url('${res}');
                } 
            `).catch(()=>{})
    })
  })

  //关闭创建新窗体
  Window.get(windowId).webContents.setWindowOpenHandler((): { action: "deny" } => {
    return { action: "deny" }
  })

  //禁止一些页面内跳转
  Window.get(windowId).webContents.on('will-navigate', (event, url) => {
    let tf = url.match(/translate_f/g)
    if (!tf) {
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
  `).catch(()=>{})
}

export { getJson, init, documInit }