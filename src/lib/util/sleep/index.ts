
/**
 * @description 休眠方法
 * @author 没礼貌的芬兰人
 * @date 2021-10-06 17:12:24
 * @param duration 休眠的毫秒数
 * @param value 
 * @returns 
 */
export default function sleep<T>(duration: number, value?: T): Promise<T> {
    let durationInMilliseconds: number;
    if (
        !isFinite(duration) ||
        Math.floor(duration) !== duration ||
        duration < 0
    ) {
        return Promise.reject('duration 必须为非负整数');
    }
    durationInMilliseconds = duration;
    return new Promise((resolve): any =>
        setTimeout(() => {
            resolve(value);
        }, durationInMilliseconds)
    );
}