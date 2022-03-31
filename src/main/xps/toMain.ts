import Window from '../modular/window';
import { getJson, init } from ".";
import { app, BrowserWindow, dialog } from 'electron';

export async function globalization(lang: GoogleTranslate.desiredLang, tld: GoogleTranslate.origin) {
    Window.create(
        {
            id: 0,
            url: `https://translate.google.${tld}/?sl=auto&hl=${lang}`,
        },
        {
            show: false,
            frame: false,
        }
    );
    await init(0)
}


// 窗口注册
export async function windowRegister() {

    const json = await getJson()

    const json_hl_lang: GoogleTranslate.desiredLang = json.htmlLang ?? 'zh-CN'

    // 窗口
    switch (json.default) {
        case 1:
            globalization(json_hl_lang,'cn')
            break;
        case 2:
            globalization(json_hl_lang,'com')
            break;
        default:
            // 选择创建翻译窗体
            dialog.showMessageBox(undefined as unknown as BrowserWindow, {
                message: '请选择进入的地址',
                buttons: ['退出', '谷歌翻译中国(免翻)', '谷歌国际']
            }).then(async res => {
                switch (res.response) {
                    case 0:
                        app.exit(0)
                        break;
                    case 1:
                        globalization(json_hl_lang,'cn')
                        break;
                    case 2:
                        globalization(json_hl_lang,'com')
                        break;
                }
            })
            break;
    }
}

