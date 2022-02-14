import type { IpcRendererEvent, BrowserWindowConstructorOptions } from 'electron';
import customize from '@/renderer/store/customize';

/**
 * 窗口初始化 (i)
 * */
export function windowLoad(listener: (event: IpcRendererEvent, args: Customize) => void) {
  window.ipc.once(`window-load`, listener);
}

/**
 * 窗口数据更新
 */
export function windowUpdate() {
  window.ipc.send('window-update', customize.get());
}

/**
 * 窗口聚焦失焦监听
 */
export function windowBlurFocusOn(listener: (event: IpcRendererEvent, args: 'blur' | 'focus') => void) {
  window.ipc.on(`window-blur-focus-${customize.get().id}`, listener);
}

/**
 * 关闭窗口聚焦失焦监听
 */
export function windowBlurFocusRemove() {
  window.ipc.removeAllListeners(`window-blur-focus-${customize.get().id}`);
}

/**
 * 窗口大小化监听
 */
export function windowMaximizeOn(
  listener: (event: IpcRendererEvent, args: 'maximize' | 'unmaximize') => void
) {
  window.ipc.on(`window-maximize-status-${customize.get().id}`, listener);
}

/**
 * 关闭窗口大小化监听
 */
export function windowMaximizeRemove() {
  window.ipc.removeAllListeners(`window-maximize-status-${customize.get().id}`);
}

/**
 * 窗口消息监听
 */
export function windowMessageOn(
  channel: string,
  listener: (event: IpcRendererEvent, args: any) => void
) {
  window.ipc.on(`window-message-${channel}-back`, listener);
}

/**
 * 关闭窗口消息监听
 */
export function windowMessageRemove(channel: string) {
  window.ipc.removeAllListeners(`window-message-${channel}-back`);
}


/**
 * 指定窗口消息发送
 * 默认给父窗体发送,自身不反馈
 * @param channel 监听key（保证唯一）
 * @param value 需要发送的内容
 * @param isback 是否给自身反馈(默认false)
 * @param acceptIds 指定窗口id发送(默认为父窗体)
 */
export function windowMessageSend(
  channel: string, //监听key（保证唯一）
  value: any, //需要发送的内容
  isback: boolean = false, //是否给自身反馈
  acceptIds: (number | bigint | undefined)[] = [] //指定窗口id发送
) {
  if (acceptIds.length === 0 && customize.get().parentId !== undefined) acceptIds = [customize.get().parentId];
  window.ipc.send('window-message-send', {
    channel,
    value,
    isback,
    acceptIds,
    id: customize.get().id
  });
}

/**
 * 给所有窗体发送消息
 * @param channel 监听key（保证唯一）
 * @param value 需要发送的内容
 * @param isback 是否给自身反馈(默认false)
 */
export function windowMessageSendAll(
  channel: string,
  value: any,
  isback: boolean = false,
) {
  window.ipc.send('window-message-send-all', {
    channel,
    value,
    isback,
    id: customize.get().id
  });
}


/**
 * 创建窗口
 */
export function windowCreate(customize: Customize, opt?: BrowserWindowConstructorOptions) {
  window.ipc.send('window-new', { customize, opt });
}

/**
 * 窗口状态
 */
export async function windowStatus(id: number | bigint = customize.get().id as number | bigint, type: WindowStatusOpt) {
  return window.ipc.invoke('window-status', { type, id });
}

/**
 * 窗口置顶
 */
export function windowAlwaysOnTop(id: number | bigint = customize.get().id as number | bigint, is: boolean, type?: WindowAlwaysOnTopOpt) {
  window.ipc.send('window-always-top-set', { id, is, type });
}

/**
 * 设置窗口大小
 */
export function windowSetSize(
  size: number[],
  resizable: boolean = true,
  center: boolean = false,
  id: number | bigint = customize.get().id as number | bigint
) {
  window.ipc.send('window-size-set', { id, size, resizable, center });
}

/**
 * 设置窗口 最大/最小 大小
 */
export function windowSetMaxMinSize(
  type: 'max' | 'min',
  size: number | undefined[],
  id: number | bigint = customize.get().id as number | bigint
) {
  window.ipc.send(`window-${type}-size-set`, { id, size });
}

/**
 * 设置窗口背景颜色
 */
export function windowSetBackgroundColor(id: number | bigint = customize.get().id as number | bigint, color?: string) {
  window.ipc.send('window-bg-color-set', { id, color });
}

/**
 * 最大化&最小化当前窗口
 */
export function windowMaxMin(id: number | bigint = customize.get().id as number | bigint) {
  window.ipc.send('window-max-min-size', id);
}

/**
 * 关闭窗口
 */
export function windowClose(id: number | bigint = customize.get().id as number | bigint) {
  window.ipc.send('window-close', id);
}

/**
 * 窗口显示
 * @param id 窗口id
 * @param time 延迟显示时间
 */
export function windowShow(id: number | bigint = customize.get().id as number | bigint, time: number = 0) {
  setTimeout(() => window.ipc.send('window-func', { type: 'show', id }), time);
}

/**
 * 窗口隐藏
 */
export function windowHide(id: number | bigint = customize.get().id as number | bigint) {
  window.ipc.send('window-func', { type: 'hide', id });
}

/**
 * 最小化窗口 
 */
export function windowMin(id: number | bigint = customize.get().id as number | bigint) {
  window.ipc.send('window-func', { type: 'minimize', id });
}

/**
 * 最大化窗口
 */
export function windowMax(id: number | bigint = customize.get().id as number | bigint) {
  window.ipc.send('window-func', { type: 'maximize', id });
}

/**
 * window函数
 */
 export function windowFunc(
  type: WindowFuncOpt,
  data?: any[],
  id: number | bigint = customize.get().id as number | bigint
) {
  window.ipc.send('window-func', { type, data, id });
}

/**
 * 通过路由获取窗口id (不传route查全部)
 */
export async function windowIdRoute(route?: string): Promise<[]> {
  return window.ipc.invoke('window-id-route', route);
}
