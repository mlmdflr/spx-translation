/**
 * 日志(info)
 * @param args
 */
export function logInfo(...args: any): void {
  window.ipc.send('log-info', args);
}

/**
 * 日志(error)
 * @param args
 */
export function logError(...args: any): void {
  window.ipc.send('log-error', args);
}

/**
 * 设置全局参数
 * @param key 键
 * @param value 值
 */
export async function sendGlobal(key: string, value: unknown) {
  return window.ipc.invoke('global-shared-object-set', {
    key,
    value
  });
}

/**
 * 获取全局参数
 * @param key 键
 */
export async function getGlobal<T>(key: string): Promise<T> {
  return window.ipc.invoke('global-shared-object-get', key);
}

/**
 * 获取内部依赖文件路径(！文件必须都存放在lib/inside 针对打包后内部依赖文件路径问题)
 * */
export async function getInsidePath(path?: string): Promise<string> {
  return window.ipc.invoke('global-resources-path-get', { type: 'inside', path });
}

/**
 * 获取外部依赖文件路径(！文件必须都存放在lib/extern下 针对打包后外部依赖文件路径问题)
 * */
export async function getExternPath(path?: string): Promise<string> {
  return window.ipc.invoke('global-resources-path-get', { type: 'extern', path });
}

/**
 * 获取顶层依赖文件路径
 * @param path 
 */
export async function getRootPath(path?: string): Promise<string> {
  return window.ipc.invoke('global-resources-path-get', { type: 'root', path });
}
/**
 * 获取顶层平台依赖文件路径
 * @param path 
 */
export async function getPlatformPath(path?: string): Promise<string> {
  return window.ipc.invoke('global-resources-path-get', { type: 'platform', path });
}

/**
 * app重启
 * @param once 是否立即重启
 */
export function relaunch(once: boolean): void {
  return window.ipc.send('app-relaunch', once);
}

/**
 * app自启
 * @param once 是否开启
 */
export function launch(once?: boolean): boolean {
  return window.ipc.sendSync('app-launch', once);
}

/**
 * app常用信息
 * @returns
 */
export async function getAppInfo(): Promise<AppInfo> {
  return window.ipc.invoke('app-info-get');
}


/**
 * app常用获取路径
 */
export async function getAppPath(key: string): Promise<string> {
  return window.ipc.invoke('app-path-get', { key });
}

/**
 * app打开url
 */
export async function openUrl(url: string): Promise<void> {
  return window.ipc.invoke('app-open-url', { url });
}
