import { shortcutInstance } from "@mlmdflr/electron-modules/main/shortcut";
import translate from "@/main/google-translate-api";
import { windowInstance } from "@mlmdflr/electron-modules/main/window";
import Screenshots from "electron-screenshots";
import tesseract from "./tesseract";
import { getJson } from ".";
import { isNull, Snowflake } from "@mlmdflr/tools";
import { logWrapper } from "@mlmdflr/electron-modules/main/log";

export default async function on() {
    const cfg = await getJson();
    const screenshots = new Screenshots({ singleWindow: true })
    if (cfg.orc.open && cfg.hotKey.screenshotTranslate) {
        shortcutInstance.register({
            name: '666',
            key: cfg.hotKey.screenshotTranslate,
            callback: () => {
                windowInstance.get(0)?.hide()
                screenshots.startCapture()
                shortcutInstance.register({
                    name: '777',
                    key: "esc",
                    callback: () => {
                        if (screenshots.$win?.isFocused()) screenshots.endCapture()
                        shortcutInstance.unregister("esc")
                    }
                })
            }
        })

        screenshots.on('ok', async (e, ib, b) => {
            if (!cfg.orc.open) return;
            const sid = new Snowflake(0n, 0n).nextId()
            windowInstance.create({
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

                windowInstance.get(sid)?.webContents.send(`window-message-tesseract:ok:${sid}-back`, text)

                translate(text, {
                    from: 'auto',
                    to: 'zh-CN',
                    tld: isNull(cfg.default) ? 'cn' : (cfg.default === 2 ? 'com' : 'cn')
                }, { timeout: 3000 }, cfg.proxy.open ? cfg.proxy : undefined).then(res => {
                    windowInstance.get(sid)?.webContents.send(`window-message-translate:ok:${sid}-back`, { o: text, g: res.text })
                })
            } catch (error) {
                console.log(error);
                setTimeout(() => {
                    windowInstance.get(sid)?.webContents.send(`window-message-translate:err:${sid}-back`, error)
                }, 1000)
                logWrapper('error', undefined, '[screenshots or Translate]', error)
            }
        })
    }
}