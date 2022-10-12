import { viewInstance } from '@mlmdflr/electron-modules/main/view';
import { windowInstance } from '@mlmdflr/electron-modules/main/window';
import { HandlerDetails, session, shell, webContents } from 'electron';
import { getJson } from ".";
import { readFile } from "@mlmdflr/electron-modules/main/file";
import { resourcesPathGet } from '@/main/modular/resources';
import { Snowflake } from '@mlmdflr/tools';
import { opt } from "@/cfg/window.json";
import { pupImgApi } from '../modular/pup';


export async function globalization(lang: GoogleTranslate.desiredLang, deeplLang: DeeplTranslate.desiredLang, json: cfg) {
    let winId = windowInstance.create(
        {
            route: '/home',
            isMainWin: true,
            currentHeight: 1420,
            currentWidth: 800,
            viewType: 'Multiple'
        },
        {
            width: 1420,
            height: 800,
            webPreferences: {
                backgroundThrottling: false
            }
        }
    )
    const { height, width } = windowInstance.get(winId)?.getBounds()!

    let googleReady = false
    let deeplReady = false

    let googleVid = viewInstance.create({
        url: `https://translate.google.com/?sl=auto&hl=${lang}`,
        session: {
            key: 'google',
            cache: true,
            persistence: true
        }
    }, {})
    let googleView = viewInstance.getView(googleVid)!;
    viewInstance.bindBV(windowInstance.get(winId)!, googleView, {
        x: 0, y: 0, height, width: width - 700
    })
    googleView.webContents.on('did-finish-load', async () => {
        googleView.webContents.executeJavaScript(`
            ${await readFile(resourcesPathGet("extern", 'google.js'))} 
            
            console.log(1);
          `).catch(() => { })

        googleView.webContents.executeJavaScript(`
          ${await readFile(resourcesPathGet("extern", 'vanilla-back-to-top.js'))} 
          console.log(1);
        `).then(() => {
            googleView.webContents.executeJavaScript(`
                window.addBackToTop({
                    diameter: 56,
                    backgroundColor: '#fff',
                    textColor:'#000',
                    opacity:${json.ggopacity}
                })
                console.log(1);
            `)
        })

        // 首次注入css
        googleView.webContents.insertCSS(`
                ${await readFile(resourcesPathGet("extern", 'google.css'))}
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
        googleView.webContents.executeJavaScript(`
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
            `).catch(() => { });
        (googleReady = true) && deeplReady && windowInstance.getMain()?.show()
    })

    //关闭创建新窗体
    googleView.webContents.setWindowOpenHandler((details: HandlerDetails): { action: "deny" } => {
        if (JSON.stringify(['https://translate.google.com/translate?sl',
            'tl',
            'hl',
            'u',
            'client'].sort()) === JSON.stringify(Array.from(new URLSearchParams(details.url).keys()).sort())) {
            getJson().then(async json => {
                if (json.webOpenmMode === 'electron') {
                    let id = new Snowflake(1n, 2n).nextId()
                    windowInstance.create({
                        id,
                        url: details.url
                    }, {
                        ...opt, webPreferences: {
                            partition: 'persist:google'
                        }
                    })
                } else shell.openExternal(details.url);
            })
        }
        return { action: "deny" }
    })

    viewInstance.setAutoResize(googleVid, { width: true, height: true, horizontal: true, vertical: true })

    let deeplVid = viewInstance.createBindBV(winId, {
        url: `https://www.deepl.com/${deeplLang}/translator`,
        session: {
            key: 'deepl',
            cache: true,
            persistence: true
        }
    }, {}, {
        x: 720, y: 0, height, width: width - 720
    })

    viewInstance.setAutoResize(deeplVid, { width: true, height: true, horizontal: true, vertical: true })
    let deeplView = viewInstance.getView(deeplVid)!;

    deeplView.webContents.on('did-finish-load', async () => {
        deeplView.webContents.executeJavaScript(`
            ${await readFile(resourcesPathGet("extern", 'deepl.js'))} 
          `).catch(() => { })

        deeplView.webContents.executeJavaScript(`
            ${await readFile(resourcesPathGet("extern", 'vanilla-back-to-top.js'))} 
            console.log(1);
      `).then(() => {
            deeplView.webContents.executeJavaScript(`
              window.addBackToTop({
                  diameter: 56,
                  backgroundColor: '#fff',
                  textColor:'#000',
                  opacity:${json.ggopacity},
                  zIndex:9999
              })
              console.log(1);
          `)
        })
        // 首次注入css
        deeplView.webContents.insertCSS(`
                ${await readFile(resourcesPathGet("extern", 'deepl.css'))}
                #dl_translator{
                    opacity: ${json.ggopacity};
                }
                .modal--l9GBM.noScroll--XcXwq.modal--HdqMl{
                    opacity: ${json.ggopacity};
                }
          `).catch(() => { });

        googleReady && (deeplReady = true) && windowInstance.getMain()?.show()
    })

    pupImgApi(json.wifekeyword).then(res => {
        windowInstance.send('window-message-switch-background-back', res)
        for (const view of viewInstance.getViewAll()) webContents.fromId(view.customize.id!).send('window-message-switch-background-json-back', json)
    })

    setTimeout(() => {
        if (!googleReady || !deeplReady) {
            windowInstance.getMain()?.show()
        }
    }, 10000);
}

// 窗口注册
export async function windowRegister() {

    const json = await getJson()

    const json_hl_lang: GoogleTranslate.desiredLang = json.htmlLang ?? 'zh-CN'
    let googleSess = session.fromPartition('persist:google')
    let deeplSess = session.fromPartition('persist:google')
    json.proxy.open && googleSess.setProxy({
        proxyRules: `${json.proxy.type}://${json.proxy.ip_dn}:${json.proxy.port}`
    })
    json.proxy.open && deeplSess.setProxy({
        proxyRules: `${json.proxy.type}://${json.proxy.ip_dn}:${json.proxy.port}`
    })
    session.defaultSession.setUserAgent(json.userAgent)
    googleSess.setUserAgent(json.userAgent)
    deeplSess.setUserAgent(json.userAgent)
    json.deeplHtmlLang === 'auto' && (json.deeplHtmlLang = 'en')
    globalization(json_hl_lang, json.deeplHtmlLang, json)
}

