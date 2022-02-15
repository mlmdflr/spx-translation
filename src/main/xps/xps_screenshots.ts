import gShortcut from "@/main/modular/enhance/shortcut";
import translate from "./google-translate-api";
import window from "../modular/window";
import Screenshots from "./screenshots/screenshots";
import tesseract from "./xps_tesseract";
export default class screenshots {
    on() {
        const screenshots = new Screenshots()
        gShortcut.register_id({
            id: 666,
            key: 'CommandOrControl+Shift+E',
            callback: () => {
                window.get(0)?.hide()
                screenshots.startCapture()
            }
        })

        screenshots.on('ok', async (e, ib, b) => {
            console.log('识别开始..');
            const { data: { text } } = await new tesseract().orc(ib)
            console.log('识别如下:', text);
            console.log('翻译开始..');
            translate(text, {
                from: 'auto',
                to: 'zh-CN',
                tld: 'cn'
            }).then(res => {
                console.log(res.text);
            })
        })
    }
}