import gShortcut from "@/main/modular/enhance/shortcut";
import translate from "./google-translate-api";
import Window from "../modular/window";
import Screenshots from "electron-screenshots";
import tesseract from "./xps_tesseract";
import { getJson } from ".";
import { isNull, Snowflake } from "@mlmdflr/tools";
import { logError } from "../modular/general/log";

export default class screenshots {
    async on() {
        const cfg = await getJson();
        const screenshots = new Screenshots({ singleWindow: true })
        if (cfg.orc.open && cfg.hotKey.screenshotTranslate) {
            gShortcut.register_id({
                id: 666,
                key: cfg.hotKey.screenshotTranslate,
                callback: () => {
                    Window.get(0)?.hide()
                    screenshots.startCapture()
                    gShortcut.register_id({
                        id: 777,
                        key: "esc",
                        callback: () => {
                            if (screenshots.$win?.isFocused()) screenshots.endCapture()
                            gShortcut.unregister_id(777)
                        }
                    })
                }
            })

            screenshots.on('ok', async (e, ib, b) => {
                if (!cfg.orc.open) return;
                const sid = new Snowflake(0n, 0n).nextId()
                Window.create({
                    id: sid,
                    title: '翻译结果',
                    route: 'Translatefb',
                    isOpenMultiWindow: true
                }, {
                    show: true,
                    height: 500,
                    width: 400,
                    maxHeight: 500,
                    minHeight: 500,
                    maxWidth: 400,
                    minWidth: 400
                })
                try {
                    const { data: { text } } = await new tesseract().orc(ib)

                    Window.get(sid)?.webContents.send(`window-message-tesseract:ok:${sid}-back`, text)

                    translate(text, {
                        from: 'auto',
                        to: 'zh-CN',
                        tld: isNull(cfg.default) ? 'cn' : (cfg.default === 2 ? 'com' : 'cn')
                    }, { timeout: 3000 }, cfg.proxy.open ? cfg.proxy : undefined).then(res => {
                        Window.get(sid)?.webContents.send(`window-message-translate:ok:${sid}-back`, { o: text, g: res.text })
                    })
                } catch (error) {
                    console.log(error);
                    setTimeout(() => {
                        Window.get(sid)?.webContents.send(`window-message-translate:err:${sid}-back`, error)
                    }, 1000)
                    logError('[screenshots or Translate]', error)
                }
            })
        }


    }
}