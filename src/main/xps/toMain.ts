import Window from '../modular/window';
import { getJson, init } from ".";
import { app, BrowserWindow, dialog } from 'electron';


// 窗口注册
export async function windowRegister() {
    // 窗口
    switch ((await getJson()).default) {
        case 1:
            Window.create(
                {
                    id: 0,
                    url: 'https://translate.google.cn/?sl=auto&tl=zh-CN',
                },
                {
                    show: false,
                    frame: false,
                }
            );
            await init(0)
            break;
        case 2:
            Window.create(
                {
                    id: 0,
                    url: 'https://translate.google.com/?sl=auto&tl=zh-CN'
                },
                {
                    show: false,
                    frame: false,
                }
            );
            await init(0)
            break;
        default:
            // 选择创建翻译窗体
            dialog.showMessageBox(null as unknown as BrowserWindow, {
                message: '请选择进入的地址',
                buttons: ['退出', '谷歌翻译中国(免翻)', '谷歌国际']
            }).then(async res => {
                switch (res.response) {
                    case 0:
                        app.exit(0)
                        break;
                    case 1:
                        Window.create(
                            {
                                id: 0,
                                url: 'https://translate.google.cn/?sl=auto&tl=zh-CN',
                            },
                            {
                                show: false,
                                frame: false
                            }
                        );
                        await init(0)
                        break;
                    case 2:
                        Window.create(
                            {
                                id: 0,
                                url: 'https://translate.google.com/?sl=auto&tl=zh-CN'
                            },
                            {
                                show: false,
                                frame: false
                            }
                        );
                        await init(0)
                        break;
                }
            })
            break;
    }
}

