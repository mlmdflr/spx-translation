type AGENCY_TYPE = 'HTTP' | 'SOCKS4' | 'SOCKS5'


type NET_RESPONSE_TYPE = 'TEXT' | 'JSON' | 'BUFFER' | 'BLOB'



declare namespace NetReq {
    interface EasyAgent {
        ip_dn: string
        port: number
        type: AGENCY_TYPE
    }
    interface TimeOutAbort {
        signal: any;
        id: NodeJS.Timeout;
    }
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
}