import type { IpcRendererEvent } from 'electron';
import { contextBridge, ipcRenderer } from 'electron';
import { EOL } from 'os';
import { isSecondInstanceWin } from '@/cfg/app.json'
import sleep from '@/util/sleep'
import { Snowflake } from '@/util/snowflake'
import { net, NetOpt } from '@/renderer/common/enhance/net'

contextBridge.exposeInMainWorld('ipc', {
    send: (channel: string, args?: any) => ipcRenderer.send(channel, args),
    sendSync: (channel: string, args?: any) => ipcRenderer.sendSync(channel, args),
    on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) =>
        ipcRenderer.on(channel, listener),
    once: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) =>
        ipcRenderer.once(channel, listener),
    invoke: (channel: string, args: any) => ipcRenderer.invoke(channel, args),
    removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel)
});

contextBridge.exposeInMainWorld('environment', {
    EOL,
    systemVersion: process.getSystemVersion(),
    platform: process.platform,
    isSecondInstanceWin
});

contextBridge.exposeInMainWorld('sleep', (duration: number, value: any) => sleep(duration, value));

contextBridge.exposeInMainWorld('Snowflake', (workerId: bigint, dataCenterId: bigint) => new Snowflake(workerId, dataCenterId).nextId());

contextBridge.exposeInMainWorld('net', (url: string, param: NetOpt) => net(url, param));

const style = window.document.createElement("style");

style.innerHTML = `
    *,
    *:after,
    *:before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    }

    *::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 6px;
    }

    *::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.2);*/
    backdrop-filter: blur(10px);
    background: rgba(0, 0, 0, 0.3);
    }

    *::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    /*-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0);*/
    background: transparent;
    }
`
let index = 0
const id = setInterval(() => {
    index++; if (index === 10) clearInterval(id);
    if (window.document.getElementsByTagName('head')[0]) {
        window.document.getElementsByTagName('head')[0].appendChild(style)
        clearInterval(id);
    }
}, 200)