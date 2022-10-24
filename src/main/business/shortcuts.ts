import { shortcutInstance } from "@mlmdflr/electron-modules/main/shortcut";
import { windowInstance } from "@mlmdflr/electron-modules/main/window";


export const shortcutsOn = () => {
    shortcutInstance.register({
        key: 'CommandOrControl+E',
        name: 'showCenter',
        callback: () => {
            windowInstance.getMain()?.show()
            windowInstance.getMain()?.center()
        }
    })
}