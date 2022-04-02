/**
 * node-fetch的封转,可使用代理请求
 */
import fetch, { Headers, RequestInit } from 'node-fetch';
import { AbortController as NodeAbortController } from 'node-abort-controller';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';


/**
 * 创建 AbortController
 */
export function AbortSignal() {
    return new NodeAbortController();
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
        .catch((err) => {
            return Promise.reject({ code: 400, msg: err.message })
        }) as Promise<T>;
}



/**
 * 处理函数
 * @param url
 * @param param
 */
export async function net<T>(url: string, param: NetReq.NetOpt = {}, agent?: any): Promise<T> {
    if (url.indexOf('http://') === -1 && url.indexOf('https://') === -1) url = 'https:' + url;
    let abort: NetReq.TimeOutAbort | null = null;
    if (!param.signal) abort = timeOutAbort(param.timeout || 3000);
    let sendData: NetReq.NetOpt = {
        isHeaders: param.isHeaders,
        isStringify: param.isStringify,
        headers: new Headers(
            Object.assign(
                {
                    'content-type': 'application/json;charset=utf-8',
                    authorization: param.authorization || ''
                },
                param.headers
            )
        ),
        type: param.type || 'TEXT',
        method: param.method || 'GET',
        // timeout只会在未指定signal下生效
        signal: abort ? abort.signal : param.signal,
        //param.agent是原生NetOpt代理實現 || agent是簡單代理由main進程net.ts實現   警告:請勿輕易傳參,除非你知道你在幹什麽
        agent: param.agent === undefined ? agent : param.agent
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

export function agent_net<T>(url: string, param?: NetReq.NetOpt, agent?: NetReq.EasyAgent): Promise<T> {
    if (!agent) return net(url, param, agent)
    return net<T>(url, param, new SocksProxyAgent(`${agent.type}://${agent.ip_dn}:${agent.port}`))
}
