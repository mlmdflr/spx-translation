import { sleep, Snowflake } from "@mlmdflr/tools"
import { BrowserWindow, HandlerDetails, session, shell } from "electron";
import { readFile, writeFile } from "../modular/general/file"
import Global from "../modular/general/global";
import { logInfo } from "../modular/general/log";
import { pupImgApi } from "../modular/pup";
import Window from '../modular/window';
import windowCfg from '@/cfg/window.json'


const setCfg = async (args: cfg) => {
  return writeFile(Global.getResourcesPath('extern', 'gg.json'), JSON.stringify(args), { encoding: 'utf-8' })
}


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
const init = async (windowId: number | bigint, df: GoogleTranslate.origin, time?: number) => {
  if (time !== undefined) await sleep(time)

  let win = Window.get(windowId) as BrowserWindow;

  if (win) {
    const json = await getJson()

    //html load proxy
    json.proxy.open && win.webContents.session.setProxy({
      proxyRules: `${json.proxy.type}://${json.proxy.ip_dn}:${json.proxy.port}`
    })

    //加载失败处理 fail deal with
    win.webContents.once('did-fail-load', async (event, errorCode, errorDescription, validatedURL, isMainFrame, frameProcessId, frameRoutingId) => {
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
          height: 230,
          width: 600,
          modal: true,
          resizable: false
        })
      }
    })


    //开始加载显示窗体
    win.webContents.once('did-start-loading', () => {
      win.webContents.executeJavaScript(`
      window.ipc.send('window-func', { type: 'show' });
      window.ipc.send('menu-show');
    `)
    })

    //加载完成注入
    win.webContents.once('dom-ready', async () => {

      win.webContents.executeJavaScript(`
          window.ipc.send('window-func', { type: 'show' });
          ${df === 'cn' ? await readFile(Global.getResourcesPath("extern", '.cnggjs')) : ''} 
          ${df === 'com' ? await readFile(Global.getResourcesPath("extern", '.gg1js')) : ''} 
        `).catch(() => { })
      // 首次注入css
      win.webContents.insertCSS(`
              ${await readFile(Global.getResourcesPath("extern", '.gg1css'))}
              .T4LgNb{
                opacity: ${json.ggopacity};
              }
              .VfPpkd-Jh9lGc{
                background: white;
                opacity: ${json.ggopacity};
              }
              .VfPpkd-Jh9lGc1{
                background-color: #1a73e8;
                background-color: var(--gm-fillbutton-container-color,#1a73e8);
                opacity: ${json.ggopacity};
              }
              .goog-container-vertical {
                opacity:  ${json.ggopacity};
              }
        `).catch(() => { });

      win.webContents.executeJavaScript(`
          document.styleSheets[3].insertRule('.RvYhPd::before {background: transparent;border-bottom: 1px solid rgba(0, 0, 0, 0.12);content: "";display: block;overflow: hidden;width: 100%;z-index: -1;position: absolute;top: 0;left: 0;}', 0); 
          let sid =  setInterval(()=>{
            if (document.styleSheets[6]) {
              document.styleSheets[6].deleteRule(78)
              document.styleSheets[6].deleteRule(79)
              document.styleSheets[6].deleteRule(79)
              document.styleSheets[6].insertRule('.ita-hwt-ime-st { position: fixed; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 16px; border: 1px solid rgb(204, 204, 204); transition: opacity 0.1s linear 0s; z-index: 2147483640; }',0)
              clearInterval(sid)
            }
          },200)
          `).catch(() => { })
      pupImgApi((await getJson()).wifekeyword).then(res => {
        win.webContents.insertCSS(` 
                #yDmH0d{
                  background-size:100% 100%;
                  background-position: center;
                  background-image: url('${res}');
                } 
            `).catch(() => { })
      }).catch(() => { })
    })

    //关闭创建新窗体
    win.webContents.setWindowOpenHandler((details: HandlerDetails): { action: "deny" } => {
      let us = new URLSearchParams(details.url);
      if (JSON.stringify(['https://translate.google.com/translate?sl',
        'tl',
        'hl',
        'u',
        'client'].sort()) === JSON.stringify(Array.from(new URLSearchParams(details.url).keys()).sort())) {
        getJson().then(async json => {
          if (json.webOpenmMode === 'electron') {
            let id = new Snowflake(1n, 2n).nextId()
            await Window.create({
              id,
              url: details.url
            }, { ...windowCfg.opt })
            Window.get(id)?.webContents.setWindowOpenHandler((details: HandlerDetails): { action: "deny" } => {
              if (JSON.stringify(['https://translate.google.com/website?sl',
                'tl',
                'hl',
                'u',
                'client'].sort()) === JSON.stringify(Array.from(new URLSearchParams(details.url).keys()).sort())
                ||
                new URL(details.url).host.includes('.translate.goog')
              ) {
                Window.get(id)?.webContents.loadURL(details.url)
              } else {
                us.set('u', details.url)
                Window.get(id)?.webContents.loadURL(decodeURIComponent(us.toString()))
              }
              return { action: "deny" }
            })
          }
          else shell.openExternal(details.url);
        })
      }
      return { action: "deny" }
    })

    //禁止一些页面内跳转
    win.webContents.on('will-navigate', (event, url) => {
      event.preventDefault()
    })
  }


}

export { setCfg, getJson, init }