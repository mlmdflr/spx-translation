import { getGlobal } from '..';

/**
 * 页面初始化加载
 */
export function domPropertyLoad() {
  getGlobal<string>('system.platform').then((platform) =>
    document.body.setAttribute('platform', platform)
  );
}