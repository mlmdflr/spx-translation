export type treatedBytes = { bytes: number, unit: string }

export default class {

    constructor() { }

    /**
     * @description 判斷ip地址是否為內網ip/包含localhost
     * @author 没礼貌的芬兰人
     * @date 2021-10-06 17:10:36
     * @param ip 
     * @returns 
     */
    public static isInnerIP = (ip: string): boolean => {
        if (ip.toLowerCase() === 'localhost') {
            return true
        }
        if ((ip.split('.')).length != 4) {
            return false
        }
        let ips: string[] = ip.split('.')
        let _ip: number = 0
        _ip += parseInt(ips[0]) << 24
        _ip += parseInt(ips[1]) << 16
        _ip += parseInt(ips[2]) << 8
        _ip += parseInt(ips[3]) << 0
        _ip = _ip >> 16 & 0xFFFF
        return (_ip >> 8 == 0x7F || _ip >> 8 == 0xA || _ip == 0xC0A8 || (_ip >= 0xAC10 && _ip <= 0xAC1F));
    }


    /**
     * @description b 自动向上转换函数
     * @author 没礼貌的芬兰人
     * @date 2021-10-06 17:10:44
     * @param bytes bytes 单位b
     * @returns treatedBytes {bytes, unit}
     */
    public static bytesToSize(bytes: number): treatedBytes {
        const sizes: string[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        if (bytes === 0) return { bytes: 0, unit: sizes[0] };
        let
            k: number = 1024,
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return { bytes: Math.round((bytes / Math.pow(k, i)) * Math.pow(10, 1)) / Math.pow(10, 1), unit: sizes[i] }
    }
}

