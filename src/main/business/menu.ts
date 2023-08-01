import { viewInstance } from "@mlmdflr/electron-modules/main/view";
import { clipboard, ipcMain, Menu } from "electron";
import { getJson } from '.'

export const menuOn = () => {
    let atTest = ''
    let copylMenu = Menu.buildFromTemplate([
        {
            label: '复制',
            click: () => clipboard.writeText(atTest)
        }
    ])
    let debugginglMenuFun = (key: string) => [
        {
            label: '打开调试模式',
            click: () => {
                for (const view of viewInstance.getViewAll()) view.customize.session.key === key && view.webContents.openDevTools({ mode: 'detach' })
            }
        }
    ]
    
    let comeBackMenu = Menu.buildFromTemplate([
        {
            label: '从剪贴板上写作',
            click: () => {
                for (const view of viewInstance.getViewAll()) view.webContents.send('menu-paste-deepl', clipboard.readText())
            }
        },
        {
            label: '回到翻译页面',
            click: async () => {
                for (const view of viewInstance.getViewAll()) {
                    const cfg = await getJson()
                    view.customize.session.key === 'deepl' && view.webContents.loadURL(`https://www.deepl.com/${cfg.deeplHtmlLang}/translator`)
                }
            }
        },
        ...debugginglMenuFun('deepl')
    ])

    ipcMain.on('menu-show-deepl', (_, args) => {
        if (args) {
            atTest = args
            copylMenu.popup()
        } else Menu.buildFromTemplate([
            {
                label: '从剪贴板上翻译',
                click: () => {
                    for (const view of viewInstance.getViewAll()) view.webContents.send('menu-paste-deepl', clipboard.readText())
                }
            },
            ...(debugginglMenuFun('deepl'))
        ]).popup()
    })

    ipcMain.on('menu-show-deepl-come-back', (_, args) => {
        if (args) {
            atTest = args
            copylMenu.popup()
        } else comeBackMenu.popup()
    })

    ipcMain.on('menu-show-goole', (_, args) => {
        if (args) {
            atTest = args
            copylMenu.popup()
        } else Menu.buildFromTemplate(debugginglMenuFun('google')).popup()
    })
}