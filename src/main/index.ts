import App from './modular/app';
import Window from './modular/window';
import Global from './modular/general/global';
import Tray from './modular/additional/tray';
import { logOn } from './modular/general/log';
import { pathOn } from './modular/general/path';
import { fileOn } from './modular/general/file';
import Shortcut from "./modular/enhance/shortcut";
import { getJson, init } from './xps';
import { app, dialog } from 'electron';
import { xpsOn } from './xps/toRenderer';

await App.start();
// 主要模块
Global.on();//全局模块
Window.on();//窗口模块
Shortcut.on();//快捷键模块
Tray.on();//托盘模块
logOn();//日志模块

// 可选模块
fileOn();//文件模块
pathOn();//路径模块

await App.use([
  import('./modular/general/session'),
  import('./modular/additional/dialog'),
  import('./modular/additional/menu'),
  import('./modular/enhance/update'),
  import('./modular/enhance/socket'),
]);

// 老板键
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
            opacity: (await getJson()).winopacity,
            customize: {
              id: 1,
              title: '设置',
              route: '/configure',
              parentId: 0,
              data: await getJson()
            },
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

xpsOn()


// 窗口
switch ((await getJson()).default) {
  case 1:
    Window.create(
      {
        opacity: (await getJson()).winopacity,
        frame: false,
        customize: {
          id: 0,
          url: 'https://translate.google.cn/?sl=auto&tl=zh-CN',
        }
      }
    );
    init(0)
    break;
  case 2:
    Window.create(
      {
        opacity: (await getJson()).winopacity,
        frame: false,
        customize: {
          id: 0,
          url: 'https://translate.google.com/?sl=auto&tl=zh-CN'
        }
      }
    );
    init(0)
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
              opacity: (await getJson()).ggopacity,
              frame: false,
              customize: {
                id: 0,
                url: 'https://translate.google.cn/?sl=auto&tl=zh-CN',
              }
            }
          );
          init(0)
          break;
        case 2:
          Window.create(
            {
              opacity: (await getJson()).ggopacity,
              frame: false,
              customize: {
                id: 0,
                url: 'https://translate.google.com/?sl=auto&tl=zh-CN'
              }
            }
          );
          init(0)
          break;
      }
    })
    break;
}
// 托盘
Tray.create();
