import { ipcMain } from "electron";
import { net } from "../../modular/enhance/net-request/net";


export async function youdaoPageTranslate(request: any) {
    try {
        let isPost = request.type === "POST";
        let response = await net(request.url, {
            method: request.type,
            headers: isPost ? { "Content-Type": "application/x-www-form-urlencoded" } : {},
            body: isPost ? request.data : null,
        })
        return {
            response: JSON.stringify(response),
            index: request.index,
        };
    } catch (error) {
        return {
            response: null,
            index: request.index,
        };
    }
}


export function youdaoOn() {
    ipcMain.handle('youdaoPageTranslate', (_, args) => youdaoPageTranslate(args))
}
