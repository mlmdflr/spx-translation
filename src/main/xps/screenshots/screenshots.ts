import { dialog, ipcMain, clipboard, nativeImage, BrowserWindow, BrowserView, desktopCapturer, app } from 'electron'
import type { SourcesOptions } from "electron";
import fs from 'fs/promises'
import Event from './event'
import Events from 'events'
import padStart from './padStart'
import getBoundAndDisplay from './getBoundAndDisplay'
import { join } from "path";
import { Global } from "@/main/modular/general/global";


export interface ScreenshotsOpts {
  lang: Partial<Lang>
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}


export interface Lang {
  magnifier_position_label: string;
  operation_ok_title: string;
  operation_cancel_title: string;
  operation_save_title: string;
  operation_redo_title: string;
  operation_undo_title: string;
  operation_mosaic_title: string;
  operation_text_title: string;
  operation_brush_title: string;
  operation_arrow_title: string;
  operation_ellipse_title: string;
  operation_rectangle_title: string;
}


export default class Screenshots extends Events {
  // 截图窗口对象
  public $win: BrowserWindow | null = null

  public $view: BrowserView = new BrowserView({
    webPreferences: {
      preload: join(__dirname, './preload.screenshots.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  private isReady = new Promise<void>(resolve => {
    ipcMain.once('SCREENSHOTS:ready', () => {
      resolve()
    })
  })

  constructor(opts?: ScreenshotsOpts) {
    super()
    this.listenIpc()
    this.$view.webContents.loadURL(`file://${Global.getInstance().getResourcesPath('inside', 'screenshots/index.html')}`)
    if (opts?.lang) {
      this.setLang(opts.lang)
    }
  }

  /**
   * 开始截图
   */
  public startCapture(): void {
    this.isReady.then(() => {
      if (this.$win && !this.$win.isDestroyed()) {
        this.$win.close()
      }
      this.createWindow()
      // 捕捉桌面之后显示窗口
      // 避免截图窗口自己被截图
      ipcMain.once('SCREENSHOTS:captured', () => {
        if (!this.$win) return
        // linux截图存在黑屏，这里设置为false就不会出现这个问题
        this.$win.setFullScreen(true)
        this.$win.show()
        this.$win.focus()
      })
    })
  }

  /**
   * 结束截图
   */
  public endCapture(): void {
    if (!this.$win) return
    this.$win.setSimpleFullScreen(false)
    this.$win.close()
    this.$win = null
  }

  /**
   * 设置语言
   */
  public setLang(lang: Partial<Lang>): void {
    this.isReady.then(() => {
      this.$view.webContents.send('SCREENSHOTS:setLang', lang)
    })
  }

  /**
   * 初始化窗口
   */
  private createWindow(): void {
    const { bound, display } = getBoundAndDisplay()
    this.$win = new BrowserWindow({
      title: 'screenshots',
      x: bound.x,
      y: bound.y,
      width: bound.width,
      height: bound.height,
      useContentSize: true,
      frame: false,
      show: false,
      autoHideMenuBar: true,
      transparent: true,
      resizable: false,
      movable: false,
      focusable: true,
      // 为true，截屏显示为黑屏
      // 所以在截屏图像生成后再设置为true
      // 参考48-49行
      fullscreen: true,
      // 设为true mac全屏窗口没有桌面滚动效果
      simpleFullscreen: true,
      backgroundColor: '#00000000',
      titleBarStyle: 'hidden',
      alwaysOnTop: true,
      enableLargerThanScreen: true,
      skipTaskbar: true,
      minimizable: false,
      maximizable: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        devTools: !app.isPackaged,
      }
    })
    this.$win.setBrowserView(this.$view)
    this.$view.setBounds(bound)
    this.$view.webContents.send('SCREENSHOTS:capture', display)
  }

  /**
   * 绑定ipc时间处理
   */
  private listenIpc(): void {
    ipcMain.handle('SCREENSHOTS:getSources', async (e, sourcesOptions: SourcesOptions) => {
      return await desktopCapturer.getSources(sourcesOptions)
    })
    /**
     * OK事件
     */
    ipcMain.on('SCREENSHOTS:ok', (e, buffer: Buffer, bounds: Bounds) => {
      const event = new Event()
      this.emit('ok', event, buffer, bounds)
      if (event.defaultPrevented) {
        return
      }
      clipboard.writeImage(nativeImage.createFromBuffer(buffer))
      this.endCapture()
    })
    /**
     * CANCEL事件
     */
    ipcMain.on('SCREENSHOTS:cancel', () => {
      const event = new Event()
      this.emit('cancel', event)
      if (event.defaultPrevented) {
        return
      }
      this.endCapture()
    })

    /**
     * SAVE事件
     */
    ipcMain.on('SCREENSHOTS:save', async (e, buffer: Buffer, bounds: Bounds) => {
      const event = new Event()
      this.emit('save', event, buffer, bounds)
      if (event.defaultPrevented || !this.$win) {
        return
      }
      const time = new Date()
      const year = time.getFullYear()
      const month = padStart(time.getMonth() + 1, 2, '0')
      const date = padStart(time.getDate(), 2, '0')
      const hours = padStart(time.getHours(), 2, '0')
      const minutes = padStart(time.getMinutes(), 2, '0')
      const seconds = padStart(time.getSeconds(), 2, '0')
      const milliseconds = padStart(time.getMilliseconds(), 3, '0')
      this.$win.setAlwaysOnTop(false)
      const { canceled, filePath } = await dialog.showSaveDialog(this.$win, {
        title: '保存图片',
        defaultPath: `${year}${month}${date}${hours}${minutes}${seconds}${milliseconds}.png`
      })
      if (!this.$win) {
        return
      }
      this.$win.setAlwaysOnTop(true)
      if (canceled || !filePath) {
        return
      }
      await fs.writeFile(filePath, buffer)
      this.endCapture()
    })
  }
}
