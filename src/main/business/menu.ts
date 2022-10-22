import { viewInstance } from "@mlmdflr/electron-modules/main/view";
import { clipboard, ipcMain, Menu } from "electron";

export const menuOn = () => {
    let atTest = ''
    let copylMenu = Menu.buildFromTemplate([
        {
            label: '复制',
            click: () => clipboard.writeText(atTest)
        }
    ])

    let clipboardMenu = Menu.buildFromTemplate([
        {
            label: '从剪贴板上翻译',
            click: () => {
                for (const view of viewInstance.getViewAll()) view.webContents.send('menu-paste-deepl', clipboard.readText())
            }
        },
    ])

    ipcMain.on('menu-show-deepl', (_, args) => {
        if (args) {
            atTest = args
            copylMenu.popup()
        } else {
            clipboardMenu.popup()
        }
    })

    ipcMain.on('menu-show-goole', (_, args) => {
        if (args) {
            atTest = args
            copylMenu.popup()
        }
    })
}