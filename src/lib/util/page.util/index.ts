import { isNull } from '@/lib/util'

/**
 * 限制首页页码 0 或 1
 */
type firstPageNoType = 0 | 1




/**
 * 分页工具类/手动分页的好帮手
 * 来源 hutool  https://hutool.cn/
 */
export default class PageUtil {

    /**
     * 首页页码
     */
    private static firstPageNo: firstPageNoType = 0;

    /**
     * 获得首页的页码，可以为0或者1
     *
     * @return 首页页码
     */
    public static getFirstPageNo() {
        return PageUtil.firstPageNo;
    }

    /**
     * 设置首页页码，可以为0或者1
     * 当设置为0时，页码0表示第一页，开始位置为0
     * 当设置为1时，页码1表示第一页，开始位置为0
     * @param customFirstPageNo 自定义的首页页码，为0或者1
     */
    private static setFirstPageNo(customFirstPageNo: firstPageNoType) {
        PageUtil.firstPageNo = customFirstPageNo;
    }

    /**
     * 设置首页页码为1
     * 当设置为1时，页码1表示第一页，开始位置为0
     */
    public static setOneAsFirstPageNo() {
        PageUtil.setFirstPageNo(1);
    }

    /**
     * 设置首页页码为0
     * 当设置为0时，页码0表示第一页，开始位置为0
     */
    public static setZeroAsFirstPageNo() {
        PageUtil.setFirstPageNo(0);
    }


    /**
     * 将页数和每页条目数转换为开始位置 
     * 此方法用于不包括结束位置的分页方法 
     * 例如：
     *
     * 页码：0，每页10 =》 0
     * 页码：1，每页10 =》 10
     *
     * 当{@link #setFirstPageNo(int)}设置为1时：
     * ...
     * 页码：1，每页10 =》 0
     * 页码：2，每页10 =》 10
     * ... 
     * @author 没礼貌的芬兰人
     * @date 2021-10-06 17:12:07
     * @param pageNo   页码（从0计数）
     * @param pageSize 每页条目数
     * @return 开始位置
     */
    public static getStart(pageNo: number, pageSize: number): number {
        if (pageNo < PageUtil.firstPageNo) {
            pageNo = PageUtil.firstPageNo;
        }

        if (pageSize < 1) {
            pageSize = 0;
        }

        return (pageNo - PageUtil.firstPageNo) * pageSize;
    }

    /**
     * 将页数和每页条目数转换为结束位置 
     * 此方法用于不包括结束位置的分页方法 
     * 例如：
     *
     * ...
     * 页码：0，每页10 =》 9
     * 页码：1，每页10 =》 19
     * ...
     *
     * ...
     * 当{@link #setFirstPageNo(int)}设置为1时：
     * 页码：1，每页10 =》 9
     * 页码：2，每页10 =》 19
     * ...
     * @author 没礼貌的芬兰人
     * @date 2021-10-06 17:11:54
     * @param pageNo   页码（从0计数）
     * @param pageSize 每页条目数
     * @return 开始位置
     */
    public static getEnd(pageNo: number, pageSize: number): number {
        const start = PageUtil.getStart(pageNo, pageSize);
        return PageUtil.getEndByStart(start, pageSize);
    }


    /**
     * 将页数和每页条目数转换为开始位置和结束位置
     * 此方法用于包括结束位置的分页方法
     * 例如：
     *
     * ...
     * 页码：0，每页10 =》 [0, 10]
     * 页码：1，每页10 =》 [10, 20]
     * ...
     *
     * 当{@link #setFirstPageNo(int)}设置为1时：
     * ...
     * 页码：1，每页10 =》 [0, 10]
     * 页码：2，每页10 =》 [10, 20]
     * ...
     * @author 没礼貌的芬兰人
     * @date 2021-10-06 17:11:28
     * @param pageNo   页码（从0计数）
     * @param pageSize 每页条目数
     * @return 第一个数为开始位置，第二个数为结束位置
     */
    public static transToStartEnd(pageNo: number, pageSize: number): number[] {
        const start: number = PageUtil.getStart(pageNo, pageSize);
        return [start, PageUtil.getEndByStart(start, pageSize)]
    };


    /**
     * @description 根据总数计算总页数
     * @author 没礼貌的芬兰人
     * @date 2021-10-06 17:11:21
     * @param totalCount 总数量
     * @param pageSize   每页数量
     * @return 总页数
     */
    public static totalPage(totalCount: number, pageSize: number): number {
        if (pageSize == 0) {
            return 0;
        }
        return totalCount % pageSize == 0 ? Math.floor(totalCount / pageSize) : (Math.floor(totalCount / pageSize) + 1);
    }


    /**
     * @description  根据起始位置获取结束位置
     * @author 没礼貌的芬兰人
     * @date 2021-10-06 17:11:07
     * @param start    起始位置
     * @param pageSize 每页条目数
     * @return 结束位置
     */
    private static getEndByStart(start: number, pageSize: number): number {
        if (pageSize < 1) {
            pageSize = 0;
        }
        return start + pageSize;
    }



    /**
     * @description 彩虹分页算法
     * @author 没礼貌的芬兰人
     * @date 2021-10-06 17:10:59
     * @param currentPage 当前页
     * @param pageCount 总页数
     * @param displayCount 每屏展示的页数
     * @returns 分页条
     * 
     * 实例:
     * rainbow(5, 20, 6);
     * 结果：[3, 4, 5, 6, 7, 8]
     * 页面效果: 上一页 3 4 [5] 6 7 8 下一页
     */
    public static rainbow(currentPage: number, pageCount: number, displayCount?: number): Promise<number[]> {
        displayCount = !isNull(displayCount) ? displayCount : 10

        if (currentPage < 0) {
            return Promise.reject(`参数异常,请检查 currentPage : ${currentPage}`);
        }

        if (pageCount < 0) {
            return Promise.reject(`参数异常,请检查 pageCount : ${pageCount}`);
        }

        if (displayCount < 0) {
            return Promise.reject(`参数异常,请检查 displayCount : ${displayCount}`);
        }

        const isEven: boolean = displayCount % 2 === 0;
        const left: number = Math.floor(displayCount / 2);
        let right: number = Math.floor(displayCount / 2);
        let length: number = displayCount;
        if (isEven) {
            right++;
        }
        if (pageCount < displayCount) {
            length = pageCount;
        }
        let result: number[] = new Array(length);
        if (pageCount >= displayCount) {
            if (currentPage <= left) {
                for (let i: number = 0; i < result.length; i++) {
                    result[i] = i + 1;
                }
            } else if (currentPage > pageCount - right) {
                for (let i: number = 0; i < result.length; i++) {
                    result[i] = i + pageCount - displayCount + 1;
                }
            } else {
                for (let i: number = 0; i < result.length; i++) {
                    result[i] = i + currentPage - left + (isEven ? 1 : 0);
                }
            }
        } else {
            for (let i: number = 0; i < result.length; i++) {
                result[i] = i + 1;
            }
        }
        return Promise.resolve(result)
    }
}
