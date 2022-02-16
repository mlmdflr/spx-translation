import Window from '../modular/window';
import Shortcut from "../modular/enhance/shortcut";
import { getJson, init } from ".";
import { app, BrowserWindow, dialog } from 'electron';

// 快捷键注册
export async function shortcutRegister() {

    const cfg = await getJson()

    if (cfg.hotKey.showHied) {
        // 显示隐藏
        Shortcut.register_id({
            id: 1,
            key: cfg.hotKey.showHied,
            callback: () => {
                if (Window.getAll().length > 1) return
                if (!(Window.get(0) as BrowserWindow).isFocused() && (Window.get(0) as BrowserWindow).isVisible()) {
                    (Window.get(0) as BrowserWindow).focus()
                    return
                }
                if ((Window.get(0) as BrowserWindow).isMinimized()) {
                    (Window.get(0) as BrowserWindow).restore();
                    (Window.get(0) as BrowserWindow).focus()
                    return
                }
                if ((Window.get(0) as BrowserWindow).isVisible()) {
                    (Window.get(0) as BrowserWindow).hide()
                } else {
                    (Window.get(0) as BrowserWindow).center();
                    (Window.get(0) as BrowserWindow).show()
                }
            }
        })
    }


    if (cfg.hotKey.setUp) {
        // 设置键
        Shortcut.register_id({
            id: 2,
            key: cfg.hotKey.setUp,
            callback: async () => {
                if (!(Window.get(1) as BrowserWindow)) {
                    if ((Window.get(0) as BrowserWindow).isFocused() && (Window.get(0) as BrowserWindow).isVisible()) {
                        Window.create(
                            {
                                id: 1,
                                title: '设置',
                                route: '/configure',
                                parentId: 0,
                                data: await getJson()
                            },
                            {
                                opacity: (await getJson()).winopacity,
                                height: 400,
                                width: 600,
                                modal: true,
                                maxHeight: 400,
                                maxWidth: 600,
                                maximizable: false,
                                minimizable: false
                            }
                        );
                    }
                } else {
                    if ((Window.get(1) as BrowserWindow).isFocused() && (Window.get(0) as BrowserWindow).isVisible()) {
                        (Window.get(1) as BrowserWindow)['close']()
                    }
                }
            }
        })
    }



    //快速翻译
}

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
                    opacity: (await getJson()).winopacity,
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
                    opacity: (await getJson()).winopacity,
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
                                opacity: (await getJson()).ggopacity,
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
                                opacity: (await getJson()).ggopacity,
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

