import { globalShortcut, ipcMain } from 'electron';
import { deepCopy } from '@/lib/util';
import { snowflake } from '@/lib/util/snowflake';
import Window from '@/main/modular/window';
import { logError } from "@/main/modular/general/log";

const { workerId, dataCenterId } = require('@/cfg/snowflake.json')



export type Accelerator = {
  // id
  id?: number | bigint;
  // 键
  key: string | string[];
  //回调
  callback: () => void;
};



enum ACCELERATOR_CONST {
  NOT_ID = -1
}


class Shortcut {
  private static instance: Shortcut;

  private data: Accelerator[] = [];

  static getInstance() {
    if (!Shortcut.instance) Shortcut.instance = new Shortcut();
    return Shortcut.instance;
  }

  constructor() { }

  /**
   * 添加已注册快捷键
   * @param accelerator
   */
  private set(accelerator: Accelerator) {
    this.data.push(accelerator);
  }

  /**
   * 根据id获取快捷键
   * @param id 
   * @returns 
   */
  private get_id(id: number | bigint) {
    for (let i = 0, len = this.data.length; i < len; i++) {
      const accelerator = this.data[i];
      if (accelerator.id === id) {
        return deepCopy<Accelerator>(accelerator);
      }
    }
    return null;
  }

  /**
  * 根据key获取快捷键
  * @param id 
  * @returns 
  */
  get(key: string) {
    for (let i = 0, len = this.data.length; i < len; i++) {
      const accelerator = this.data[i];
      if (
        (typeof accelerator.key === 'string' && accelerator.key === key) ||
        (Array.isArray(accelerator.key) && accelerator.key.indexOf(key) > ACCELERATOR_CONST.NOT_ID)
      ) {
        return deepCopy<Accelerator>(accelerator);
      }
    }
    return null;
  }



  /**
   * 获取全部已注册快捷键
   */
  getAll() {
    return deepCopy<Accelerator[]>(this.data);
  }


  /**
   * 根据id删除已注册快捷键
   * @param key
   */
  del_id(id: number | bigint) {
    if (id === ACCELERATOR_CONST.NOT_ID) return
    for (let i = 0, len = this.data.length; i < len; i++) {
      const accelerator = this.data[i];
      if (accelerator.id === id) {
        this.data.splice(i, 1);
        return
      }
    }
  }




  /**
   * 清空已注册快捷键
   */
  private delAll() {
    delete this.data;
    this.data = [];
  }

  /**
   * 检查key是否可用
   * @param key 
   * @returns 返回包含此key的id 可用则
   */
  check(key: string): number | bigint {
    for (let i = 0, len = this.data.length; i < len; i++) {
      const accelerator = this.data[i];
      if (typeof accelerator.key === 'string' && accelerator.key === key) {
        return accelerator.id
      }
      if (Array.isArray(accelerator.key)) {
        const index = accelerator.key.indexOf(key);
        if (index > ACCELERATOR_CONST.NOT_ID) {
          return accelerator.id
        }
      }
    }
    return ACCELERATOR_CONST.NOT_ID
  }



  /**
   * 注册快捷键(重复则覆盖)
   * @param accelerator 
   * @returns 
   */
  register_id(accelerator: Accelerator): boolean {
    if (!accelerator.key || accelerator.id === ACCELERATOR_CONST.NOT_ID) {
      logError(`[ shortcut accelerator ]  id  is ${accelerator.id} || key is ${accelerator.key} `);
      return false
    }
    this.unregister_id(accelerator.id);
    if (typeof accelerator.key === 'string') {
      this.unregister_id(this.check(accelerator.key))
      globalShortcut.register(accelerator.key, accelerator.callback);
    } else {
      accelerator.key.forEach(k => {
        this.unregister_id(this.check(k))
      })
      globalShortcut.registerAll(accelerator.key, accelerator.callback);
    }
    this.set(accelerator);
    return true
  }



  /**
   * 根据id清除快捷键
   */
  unregister_id(id: number | bigint) {
    if (id === ACCELERATOR_CONST.NOT_ID) return
    const accelerator = this.get_id(id)
    if (!accelerator) {
      return
    }
    this.del_id(id)
    if (typeof accelerator.key === 'string') {
      globalShortcut.unregister(accelerator.key);
      return
    }
    accelerator.key.forEach(e => globalShortcut.unregister(e))
  }

  /**
   * 清空全部快捷键
   */
  unregisterAll() {
    globalShortcut.unregisterAll();
    this.delAll();
  }

  /**
   * 监听
   */
  on() {
    ipcMain.handle('shortcut-register', (event, args: { id?: number | bigint; key: string | string[] }) => {
      const accelerator: Accelerator = {
        id: !args.id ? new snowflake(BigInt(workerId), BigInt(dataCenterId)).nextId() : args.id,
        key: args.key,
        callback: () => Window.send(`shortcut-${accelerator.id}-back`, args.key)
      };
      if (!this.register_id(accelerator)) {
        delete accelerator.callback;
        return undefined
      }
      return accelerator.id
    });
    ipcMain.handle('shortcut-unregister', (event, args) => this.unregister_id(args));
    ipcMain.handle('shortcut-unregisterAll', () => this.unregisterAll());
    ipcMain.handle('shortcut-get-id', (event, args) => {
      const accelerator = { ...this.get_id(args) };
      delete accelerator.callback;
      return accelerator;
    });
    ipcMain.handle('shortcut-get-key', (event, args) => {
      const accelerator = { ...this.get(args) };
      delete accelerator.callback;
      return accelerator;
    });
    ipcMain.handle('shortcut-getAll', (event) => {
      const acceleratorAll = this.getAll();
      acceleratorAll.map((e) => delete e.callback);
      return acceleratorAll;
    });
  }
}

export default Shortcut.getInstance();
