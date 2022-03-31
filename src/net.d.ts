type AGENCY_TYPE = 'HTTP' | 'SOCKS'

type EasyAgent = {
    ip_dn: string
    port: number
    type: AGENCY_TYPE
}

type NET_RESPONSE_TYPE = 'TEXT' | 'JSON' | 'BUFFER' | 'BLOB'


interface NetOpt extends RequestInit {
    authorization?: string;
    isStringify?: boolean; //是否stringify参数（非GET请求使用）
    isHeaders?: boolean; //是否获取headers
    data?: any;
    body?: any;
    timeout?: number;
    type?: NET_RESPONSE_TYPE; //返回数据类型
    agent?: any
}

interface TimeOutAbort {
    signal: AbortSignal;
    id: NodeJS.Timeout;
}

