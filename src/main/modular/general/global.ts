import { app, ipcMain } from 'electron';
import { accessSync, constants } from 'fs';
import { resolve, normalize, join } from 'path';
import { EOL } from 'os';
import { logError } from '@/main/modular/general/log';
import { readFile } from './file';

const { single } = require('@/cfg/window.json');


type Obj<Value> = {} & {
  [key: string]: Value | Obj<Value>;
};

/**
 * @param path 配置文件路径
 * @param seat 存放位置
 * @param parse 是否parse
 * @param opt
 */
interface Config {
  path: string;
  seat: string;
  parse: boolean;
  opt?: { encoding?: BufferEncoding; flag?: string };
}


/**
 * Global
 */
export class Global {
  private static instance: Global;

  public sharedObject: { [key: string]: any } = {
    //系统信息
    system: {
      EOL,
      version: process.getSystemVersion(),
      platform: process.platform
    },
    //应用信息
    app: {
      // 是否单例
      single,
      name: app.name,
      version: app.getVersion(),
      isPackaged: app.isPackaged
    }
  };

  static getInstance() {
    if (!Global.instance) Global.instance = new Global();
    return Global.instance;
  }

  constructor() { }

  /**
   * 挂载配置
   */
  async use(conf: Config | Config[]) {
    if (Array.isArray(conf)) {
      for (let index = 0; index < conf.length; index++) {
        const c = conf[index];
        try {
          const cfg = (await readFile(c.path, c.opt || { encoding: 'utf-8' })) as any;
          if (cfg) this.sendGlobal(c.seat, c.parse ? JSON.parse(cfg) : cfg);
        } catch (e) {
          logError(`[cfg ${c.path}]`, e);
        }
      }
    } else {
      try {
        const cfg = (await readFile(conf.path, conf.opt || { encoding: 'utf-8' })) as any;
        if (cfg) this.sendGlobal(conf.seat, conf.parse ? JSON.parse(cfg) : cfg);
      } catch (e) {
        logError(`[cfg ${conf.path}]`, e);
      }
    }
  }


  /**
   * 开启监听
   */
  on() {
    //赋值(sharedObject)
    ipcMain.handle('global-shared-object-set', (event, args) => {
      return this.sendGlobal(args.key, args.value);
    });
    //获取(sharedObject)
    ipcMain.handle('global-shared-object-get', (event, key) => {
      return this.getGlobal(key);
    });
    //获取(insidePath)
    ipcMain.handle('global-inside-path-get', (event, path) => {
      return this.getInsidePath(path);
    });
    //获取(externPath)
    ipcMain.handle('global-extern-path-get', (event, path) => {
      return this.getExternPath(path);
    });
    //获取(rootPath)
    ipcMain.handle('global-root-path-get', (event, path) => {
      return this.getRootPath(path);
    });
  }

  getGlobal<Value>(key: string): Value | undefined {
    if (key === '') {
      console.error('Invalid key, the key can not be a empty string');
      return;
    }

    if (!key.includes('.') && Object.prototype.hasOwnProperty.call(this.sharedObject, key)) {
      return this.sharedObject[key] as Value;
    }

    const levels = key.split('.');
    let cur = this.sharedObject;
    for (const level of levels) {
      if (Object.prototype.hasOwnProperty.call(cur, level)) {
        cur = cur[level] as unknown as Obj<Value>;
      } else {
        return;
      }
    }

    return cur as unknown as Value;
  }

  sendGlobal<Value>(key: string, value: Value): void {
    if (key === '') {
      console.error('Invalid key, the key can not be a empty string');
      return;
    }

    if (!key.includes('.')) {
      if (Object.prototype.hasOwnProperty.call(this.sharedObject, key)) {
        console.log(`The key ${key} looks like already exists on obj.`);
      }
      this.sharedObject[key] = value;
    }

    const levels = key.split('.');
    const lastKey = levels.pop()!;

    let cur = this.sharedObject;
    for (const level of levels) {
      if (Object.prototype.hasOwnProperty.call(cur, level)) {
        cur = cur[level];
      } else {
        console.error(`Cannot set value because the key ${key} is not exists on obj.`);
        return;
      }
    }

    if (typeof cur !== 'object') {
      console.error(`Invalid key ${key} because the value of this key is not a object.`);
      return;
    }
    if (Object.prototype.hasOwnProperty.call(cur, lastKey)) {
      console.log(`The key ${key} looks like already exists on obj.`);
    }
    cur[lastKey] = value;
  }

  /**
   * 获取内部依赖文件路径(！文件必须都存放在lib/inside 针对打包后内部依赖文件路径问题)
   * 2021.9.7 修改 打包后无法获取路径问题 使用join来拼接路径
   * 修复直接抛出异常阻塞node的bug
   * @param path lib/inside为起点的相对路径 | 异常时会返回 undefined
   * */
  getInsidePath(path?: string): string {
    try {
      if (!path) return app.isPackaged
        ? resolve(join(__dirname, '..', '..', 'inside'))
        : resolve(join('src', 'lib', 'inside'))
      path = normalize(
        app.isPackaged
          ? resolve(join(__dirname, '..', '..', 'inside', path))
          : resolve(join('src', 'lib', 'inside', path))
      );
      accessSync(path, constants.R_OK);
      return path;
    } catch (e) {
      logError(`[InsidePath ${path}]`, e);
      return
    }
  }

  /**
   * 获取外部依赖文件路径(！文件必须都存放在lib/extern下 针对打包后外部依赖文件路径问题)
   * 2021.9.7 修改 打包后无法获取路径问题 使用join来拼接路径
   * 修复直接抛出异常阻塞node的bug
   * @param path lib/extern为起点的相对路径  | 异常时会返回 undefined
   * */
  getExternPath(path?: string): string {
    try {
      if (!path) return app.isPackaged
        ? resolve(join(__dirname, '..', '..', '..', 'extern'))
        : resolve(join('src', 'lib', 'extern'))
      path = normalize(
        app.isPackaged
          ? resolve(join(__dirname, '..', '..', '..', 'extern', path))
          : resolve(join('src', 'lib', 'extern', path))
      );
      accessSync(path, constants.R_OK);
      return path;
    } catch (e) {
      logError(`[ExternPath ${path}]`, e);
      return
    }
  }


  getRootPath(path?: string): string {
    try {
      if (!path) return app.isPackaged
        ? resolve(join(__dirname, '..', '..', '..', '..'))
        : resolve(join('src', 'lib', 'root'))
      path = normalize(
        app.isPackaged
          ? resolve(join(__dirname, '..', '..', '..', '..', path))
          : resolve(join('src', 'lib', 'root', path))
      );
      accessSync(path, constants.R_OK);
      return path;
    } catch (e) {
      logError(`[getRootPath ${path}]`, e);
      return
    }
  }
}

export default Global.getInstance();
