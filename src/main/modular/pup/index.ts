import net from "../enhance/net-request"
import { JSDOM } from "jsdom";
import { random } from "@/lib/util";
import pageUtil from "@/lib/util/page.util";


export async function pupImg(name: string) {
    try {
        /**
         * 获取总条数
         */
        let totalCount = await getSearchCount(name)
        /**
         * 计算总页数
         */
        let totalPage = pageUtil.totalPage(totalCount, 24)
        /**
         * 关键字搜索不到则抛出异常
         */
        if (totalCount === 0) {
            return Promise.reject('[pupImg] Search results are empty');
        }
        /**
         * 随机页码
         */
        const page_rm = random(1, totalPage === 1 ? 1 : totalPage - 1)
        const search_end = await net<string>(`https://wallhaven.cc/search?q=${name}&page=${page_rm}`, { timeout: 3000 })
        const search_dom_end = new JSDOM(search_end);
        /**
         * 随机图片处理
         */
        let pic_rm = 0
        if (page_rm === (totalPage === 1 ? 1 : totalPage - 1)) {
            pic_rm = random(0, search_dom_end.window.document.querySelectorAll('.preview').length - 1)
        } else {
            pic_rm = random(0, 23)
        }
        /**
         * 最后请求大图
         */
        const pic_url = search_dom_end.window.document.querySelectorAll('.preview')[pic_rm].getAttribute('href');
        const pic = await net<string>(pic_url, { timeout: 3000 })
        const pic_dom = new JSDOM(pic);
        return pic_dom.window.document.querySelector('#wallpaper').getAttribute('src');
    } catch (e) {
        return Promise.reject('[pupImg] network anomaly');
    }
}


export async function getSearchCount(name: string) {
    let search: string
    try {
        search = await net<string>(`https://wallhaven.cc/search?q=${name}`, { timeout: 3000 })
    } catch (error) {
        return undefined
    }
    const search_dom = new JSDOM(search);
    let search_count = search_dom.window.document.querySelector('.listing-header>h1').outerHTML
    return Number(search_count.substring(search_count.lastIndexOf('</i>') + 4, search_count.indexOf('Wallpapers')).replace(/\,/g, ''))
}