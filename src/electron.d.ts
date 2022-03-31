interface Customize_Route {
  // 唯一id
  id?: number | bigint;
  // 标题 (仅路由下生效)
  title?: string;
  // 指定路由
  route: string;
  // 根url
  baseUrl?: string;
  // 参数数据
  loadOptions?: Electron.LoadURLOptions | Electron.LoadFileOptions;
  // 父类窗口宽度
  currentWidth?: number;
  // 父类窗口高度
  currentHeight?: number;
  // 父类窗口是否全屏
  currentMaximized?: boolean;
  // 放开一路一窗限制
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

interface Customize_Url {
  // 唯一id
  id?: number | bigint;
  // 指定网页
  url: string;
  // 参数数据
  loadOptions?: Electron.LoadURLOptions | Electron.LoadFileOptions;
  // 父类窗口宽度
  currentWidth?: number;
  // 父类窗口高度
  currentHeight?: number;
  // 父类窗口是否全屏
  currentMaximized?: boolean;
  // 是否主窗口(当为true时会替代当前主窗口)
  isMainWin?: boolean;
  // 父窗口id
  parentId?: number | bigint;
  // 进程参数
  argv?: any;
  // 自定义参数
  data?: any;
}
type Customize = Customize_Route | Customize_Url


interface AppInfo {
  isPackaged: boolean;
  name: string;
  version: string;
}

declare namespace Electron {
  interface BrowserWindow {
    customize: Customize;
  }
}

type WindowAlwaysOnTopOpt =
  | 'normal'
  | 'floating'
  | 'torn-off-menu'
  | 'modal-panel'
  | 'main-menu'
  | 'status'
  | 'pop-up-menu'
  | 'screen-saver';

type WindowFuncOpt = 'close' | 'hide' | 'show' | 'minimize' | 'maximize' | 'restore' | 'reload';

type WindowStatusOpt =
  | 'isMaximized'
  | 'isMinimized'
  | 'isFullScreen'
  | 'isAlwaysOnTop'
  | 'isVisible'
  | 'isFocused'
  | 'isModal';

type OpenmMode = 'electron' | 'browser'

type cfg = {
  wifekeyword: string,
  ggopacity: number,
  default: number,
  webOpenmMode: OpenmMode,
  htmlLang: GoogleTranslate.desiredLang,
  hotKey: {
    showHied: string
    screenshotTranslate: string
    fastTranslate: string
  },
  proxy: EasyAgent,
  orc: {
    lang: [],
    worker: number,
    open: boolean
  }
}

interface AnyObject {
  [key: string]: any
}