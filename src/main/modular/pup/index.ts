import { net, agent_net } from "@/main/modular/net-request/net";
import { random, PageUtil } from "@mlmdflr/tools";


export async function pupImgApi(name: string, agent?: NetReq.EasyAgent) {
    console.log(name,agent);
    
    try {
        /**
         * 获取总条数
         */
        let totalCount = await getSearchCountApi(name, agent)
        /**
         * 关键字搜索不到则抛出异常
         */
        if (totalCount === 0 || totalCount === undefined) return Promise.reject('[pupImg] Search results are empty');

        /**
         * 计算总页数
         */
        let totalPage = PageUtil.totalPage(totalCount, 24)

        /**
         * 随机页码
         */
        const page_rm = random(1, totalPage === 1 ? 1 : totalPage - 1)
        const search_end = await agent_net<any>(`https://wallhaven.cc/api/v1/search?q=${name}&page=${page_rm}`, { timeout: 3000, type: "JSON" }, agent)

        /**
         * 随机图片处理
         */
        let pic_rm = 0
        if (page_rm === (totalPage === 1 ? 1 : totalPage - 1)) pic_rm = random(0, search_end['data'].length - 1)
        else pic_rm = random(0, 23)
        let BUFFER = await agent_net<ArrayBuffer>(search_end['data'][pic_rm]['path'], { timeout: 3000, type: "BUFFER" }, agent)
        return Buffer.from(BUFFER).toString('base64')
    } catch (e) {
        console.log(e);
        return Promise.reject('[pupImg] network anomaly');
    }
}

export async function getSearchCountApi(name: string, agent?: NetReq.EasyAgent) {
    let search: any
    try {
        search = await agent_net<any>(`https://wallhaven.cc/api/v1/search?q=${name}`, { timeout: 3000, type: "JSON" }, agent)
    } catch (error) {
        console.log(error);
        return undefined
    }
    return search['meta']['total']
}
