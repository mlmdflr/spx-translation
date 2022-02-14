
/**
 * 综合工具类
 */

/**
 * 判空
 * */
export function isNull(o: unknown): boolean {
  return o === '' || o === undefined || o === null || o === 'undefined' || o === 'null';
}

/**
 * 字符串判断是否为空或者空格
 */
export function isBlank(o: string): boolean {
  if (!isNull(o)) {
    return new RegExp('^[ ]+$').test(o)
  }
  return true
}

/**
 * 随机整数
 * 例如 6-10 （m-n）
 * */
export function ranDom(m: number, n: number): number {
  return Math.floor(Math.random() * (n - m)) + m;
}

/**
 * 数组元素互换
 * @param arr
 * @param index1 需要更换位置的元素初始下标
 * @param index2 更改后的下标
 */
export function swapArr<T>(arr: T[], index1: number, index2: number): void {
  [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
}

/**
 * 对象转参数
 * @param data
 */
export function queryParams(data: any): string {
  let _result = [];
  for (let key in data) {
    let value = data[key];
    if (['', undefined, null].includes(value)) {
      continue;
    }
    if (value.constructor === Array) {
      value.forEach((_value) => {
        _result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value));
      });
    } else {
      _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
  }
  return _result.length ? _result.join('&') : '';
}

/**
 * 日期转换
 * @param fmt yy-MM-dd hh:mm:ss
 * */
export function dateFormat(fmt: string = 'yyyy-MM-dd hh:mm:ss'): string {
  let date = new Date();
  let o: { [key: string]: unknown } = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? (o[k] as string) : ('00' + o[k]).substr(('' + o[k]).length)
      );
  return fmt;
}

/**
 * 深拷贝
 * @param obj
 */
export function deepCopy<T>(obj: any): T {
  const isArray = Array.isArray(obj);
  let result: any = {};
  if (isArray) result = [];
  let temp = null;
  let key = null;
  let keys = Object.keys(obj);
  keys.map((item, index) => {
    key = item;
    temp = obj[key];
    if (temp && typeof temp === 'object') {
      if (isArray) result.push(deepCopy(temp));
      else result[key] = deepCopy(temp);
    } else {
      if (isArray) result.push(temp);
      else result[key] = temp;
    }
  });
  return result;
}

/**
 * 防抖
 */
export function debounce(func: Function, wait: number): any {
  let timer: number = null;
  return function () {
    const context = this;
    const args = arguments; // 存一下传入的参数
    if (timer) clearTimeout(timer);
    func.apply(context, args);
    timer = setTimeout(func, wait);
  };
}

/**
 * 节流
 */
export function throttle(func: Function, delay: number): any {
  let timer: number = null;
  let startTime = Date.now();
  return function () {
    const remaining = delay - (Date.now() - startTime);
    const context = this;
    const args = arguments;
    if (timer) clearTimeout(timer);
    clearTimeout(timer);
    if (remaining <= 0) {
      func.apply(context, args);
      startTime = Date.now();
    } else {
      timer = setTimeout(func, remaining);
    }
  };
}

/**
 * 指定范围内的随机整数
 * @param start
 * @param end
 */
export function random(start: number = 0, end: number = 1): number {
  return (Math.random() * (end - start + 1) + start) | 0;
}


/**
 * @description 颜色RGB转十六进制
 * @author 没礼貌的芬兰人
 * @date 2021-10-06 16:29:56
 * @param r 
 * @param g 
 * @param b 
 * @returns 十六进制
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}


/**
 * @description 保留小数
 * @author 没礼貌的芬兰人
 * @date 2021-10-06 17:08:35
 * @param n 
 * @param fixed 保留位数
 */
export function toFixed(n: number, fixed: number) {
  return fixed <= 0 ? n : !(n % 1) ? n : fixed <= n.toString().split(".")[1].length ? (~~(Math.pow(10, fixed) * n) / Math.pow(10, fixed)) : (~~(Math.pow(10, n.toString().split(".")[1].length) * n) / Math.pow(10, n.toString().split(".")[1].length))
}
