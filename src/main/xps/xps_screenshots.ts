import gShortcut from "@/main/modular/enhance/shortcut";
import Screenshots from "./screenshots/screenshots";


export default class screenshots {
    on() {
        const screenshots = new Screenshots()
        gShortcut.register_id({
            id: 666,
            key: 'alt+shift+a',
            callback: () => {
                screenshots.startCapture()
                screenshots.$view.webContents.openDevTools()
            }
        })
    }
}