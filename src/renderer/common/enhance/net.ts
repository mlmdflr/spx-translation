import { queryParams } from "mm-tool";

import { Headers } from "node-fetch";


/**
 * 创建 AbortController
 */
export function AbortSignal() {
  return new AbortController();
}

/**
 * 超时处理
 * @param outTime
 */
function timeOutAbort(outTime: number): NetReq.TimeOutAbort {
  const controller = AbortSignal();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, outTime);
  return { signal: controller.signal, id: timeoutId };
}

/**
 * 请求处理
 * @param url
 * @param sendData
 */
function fetchPromise<T>(url: string, sendData: NetReq.NetOpt): Promise<T> {
  return fetch(url, sendData)
    .then((res) => {
      if (res.status >= 200 && res.status < 300) return res;
      throw new Error(res.statusText);
    })
    .then(async (res) => {
      switch (sendData.type) {
        case 'TEXT':
          return sendData.isHeaders
            ? {
              headers: res.headers,
              data: await res.text()
            }
            : await res.text();
        case 'JSON':
          return sendData.isHeaders
            ? {
              headers: res.headers,
              data: await res.json()
            }
            : await res.json();
        case 'BUFFER':
          return sendData.isHeaders
            ? {
              headers: res.headers,
              data: await res.arrayBuffer()
            }
            : await res.arrayBuffer();
        case 'BLOB':
          return sendData.isHeaders
            ? {
              headers: res.headers,
              data: await res.blob()
            }
            : await res.blob();
      }
    })
    .catch((err) => ({ code: 400, msg: err.message })) as Promise<T>;
}

/**
 * http请求
 * @param url
 * @param param
 */
export async function net<T>(url: string, param: NetReq.NetOpt = {}): Promise<T> {
  if (!url.startsWith('http://') && !url.startsWith('https://'))
    url = 'https://' + url
  let abort: NetReq.TimeOutAbort | null = null;
  if (!param.signal) abort = timeOutAbort(param.timeout || 3000);
  let sendData: NetReq.NetOpt = {
    isHeaders: param.isHeaders,
    isStringify: param.isStringify,
    headers: new Headers(
      Object.assign(
        {
          'content-type': 'application/json;charset=utf-8',
        },
        param.headers
      )
    ),
    type: param.type || 'TEXT',
    method: param.method || 'GET',
    // timeout只会在未指定signal下生效
    signal: abort ? abort.signal : param.signal
  };
  if (param.body) {
    sendData.body = param.body;
  } else if (param.data) {
    if (sendData.method === 'GET') url = `${url}?${queryParams(param.data)}`;
    else
      sendData.body = sendData.isStringify
        ? queryParams(param.data)
        : JSON.stringify(param.data);
  }
  return fetchPromise<T>(url, sendData).then((req) => {
    if (abort) clearTimeout(abort.id);
    return req;
  });
}

