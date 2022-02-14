//@ts-nocheck
import Window from '../modular/window';
import Shortcut from "../modular/enhance/shortcut";
import { getJson, init } from ".";
import { app, dialog } from 'electron';

// 快捷键注册
export function shortcutRegister() {
    Shortcut.register_id({
        id: 1,
        key: 'CommandOrControl+E',
        callback: () => {
            if (Window.getAll().length > 1) return
            if (!Window.get(0).isFocused() && Window.get(0).isVisible()) {
                Window.get(0).focus()
                return
            }
            if (Window.get(0).isMinimized()) {
                Window.get(0).restore()
                Window.get(0).focus()
                return
            }
            if (Window.get(0).isVisible()) {
                Window.get(0).hide()
            } else {
                Window.get(0).center()
                Window.get(0).show()
            }
        }
    })
    // 设置键
    Shortcut.register_id({
        id: 2,
        key: 'CommandOrControl+W',
        callback: async () => {
            if (!Window.get(1)) {
                if (Window.get(0).isFocused() && Window.get(0).isVisible()) {
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
                if (Window.get(1).isFocused() && Window.get(0).isVisible()) {
                    Window.get(1)['close']()
                }
            }
        }
    })
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
                    opacity: (await getJson()).winopacity,
                    frame: false,
                }
            );
            await init(0)
            break;
        default:
            // 选择创建翻译窗体
            dialog.showMessageBox(null, {
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

