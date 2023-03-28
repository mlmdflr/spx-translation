import { appInstance } from '@mlmdflr/electron-modules/main/app';
import { TrayInstance } from '@mlmdflr/electron-modules/main/tray';
import { windowInstance } from "@mlmdflr/electron-modules/main/window";
import { Session } from '@mlmdflr/electron-modules/main/session';
import { renderOn } from './business/toRenderer';
import { windowRegister } from './business/toMain';
import ico from '@/assets/icon/tray.png';
import { join } from "path";
import { readFile } from "@mlmdflr/electron-modules/main/file";
import { Menu, app } from 'electron';

import { menuOn } from "./business/menu";
import { shortcutsOn } from './business/shortcuts';

await appInstance.start();

const dataUrl = 'data:image/png;base64,' + await readFile(join(__dirname, `../${ico}`), { encoding: 'base64' })
TrayInstance.create(dataUrl);
//托盘设置
TrayInstance.main?.setContextMenu(Menu.buildFromTemplate([
    { label: '显示', type: 'normal', click: () => windowInstance.getMain()?.show() },
    { label: '隐藏', type: 'normal', click: () => windowInstance.getMain()?.hide() },
    {
        label: '重启', type: 'normal', click: () => {
            app.relaunch({ args: process.argv.slice(1) });
            app.exit(0);
        }
    },
    {
        label: '退出', type: 'normal', click: () => app.exit(0)
    },
]))

shortcutsOn()
menuOn()

app.isPackaged && windowInstance.setDefaultCfg({
    defaultLoadUrl: join(__dirname, '../index.html'),
    defaultRoutePreload: join(__dirname, './preload.js'),
    defaultUrlPreload: join(__dirname, './preload.url.js'),
    defaultExtraOptions: {
        isSetWindowOpenHandler: false
    }
})

!app.isPackaged && windowInstance.setDefaultCfg({
    defaultLoadUrl: `http://localhost:${await readFile(join('.port'), { encoding: 'utf-8' })}`,
    defaultRoutePreload: join(__dirname, './preload.js'),
    defaultUrlPreload: join(__dirname, './preload.url.js'),
    defaultExtraOptions: {
        isSetWindowOpenHandler: false
    }
})
const dfSess = new Session();
dfSess.on()
const googleSess = new Session(`persist:google`);
googleSess.on()
const deeplSess = new Session(`persist:deepl`);
deeplSess.on()
windowRegister()

renderOn(dfSess.session, googleSess.session, deeplSess.session)