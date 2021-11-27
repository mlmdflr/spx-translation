interface Customize {
  // 唯一id
  id?: number | bigint;
  // 标题 (仅路由下生效)
  title?: string;
  // 指定路由
  route?: string;
  // 指定网页
  url?: string;
  // 参数数据
  loadOptions?: Electron.LoadURLOptions | Electron.LoadFileOptions;
  // 父类窗口宽度
  currentWidth?: number;
  // 父类窗口高度
  currentHeight?: number;
  // 父类窗口是否全屏
  currentMaximized?: boolean;
  // 放开一路一窗限制(仅在单例模式下有效,多例默认重复创建)
  isOpenMultiWindow?: boolean;
  // 是否主窗口(当为true时会替代当前主窗口)
  isMainWin?: boolean;
  // 父窗口id
  parentId?: number | bigint;
  // 进程参数
  argv?: any;
  // 自定义参数
  data?: any;
}

declare namespace Electron {
  interface BrowserWindow {
    customize: Customize;
  }

  interface BrowserWindowConstructorOptions {
    customize: Customize;
  }
}

type windowAlwaysOnTopOpt =
  | 'normal'
  | 'floating'
  | 'torn-off-menu'
  | 'modal-panel'
  | 'main-menu'
  | 'status'
  | 'pop-up-menu'
  | 'screen-saver';

type windowFuncOpt = 'close' | 'hide' | 'show' | 'minimize' | 'maximize' | 'restore' | 'reload';

type windowStatusOpt =
  | 'isMaximized'
  | 'isMinimized'
  | 'isFullScreen'
  | 'isAlwaysOnTop'
  | 'isVisible'
  | 'isFocused'
  | 'isModal';

interface UpdateMessage {
  code: number;
  msg: string;
  value?: any;
}

interface SocketMessage {
  code: number;
  msg?: string;
  value?: any;
}
