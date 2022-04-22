
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function queryParams(data) {
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
 * 创建 AbortController
 */
function AbortSignal() {
    return new AbortController();
}

/**
 * 超时处理
 * @param outTime
 */
function timeOutAbort(outTime) {
    var controller = AbortSignal();
    var timeoutId = setTimeout(function () {
        controller.abort();
    }, outTime);
    return { signal: controller.signal, id: timeoutId };
}

/**
 * 请求处理
 * @param url
 * @param sendData
 */
function fetchPromise(url, sendData) {
    var _this = this;
    return fetch(url, sendData)
        .then(function (res) {
            if (res.status >= 200 && res.status < 300)
                return res;
            throw new Error(res.statusText);
        })
        .then(function (res) {
            return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e;
                var _f, _g, _h, _j;
                return __generator(this, function (_k) {
                    switch (_k.label) {
                        case 0:
                            _a = sendData.type;
                            switch (_a) {
                                case 'TEXT': return [3 /*break*/, 1];
                                case 'JSON': return [3 /*break*/, 6];
                                case 'BUFFER': return [3 /*break*/, 11];
                                case 'BLOB': return [3 /*break*/, 16];
                            }
                            return [3 /*break*/, 21];
                        case 1:
                            if (!sendData.isHeaders) return [3 /*break*/, 3];
                            _f = {
                                headers: res.headers
                            };
                            return [4 /*yield*/, res.text()];
                        case 2:
                            _b = (_f.data = _k.sent(),
                                _f);
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, res.text()];
                        case 4:
                            _b = _k.sent();
                            _k.label = 5;
                        case 5: return [2 /*return*/, _b];
                        case 6:
                            if (!sendData.isHeaders) return [3 /*break*/, 8];
                            _g = {
                                headers: res.headers
                            };
                            return [4 /*yield*/, res.json()];
                        case 7:
                            _c = (_g.data = _k.sent(),
                                _g);
                            return [3 /*break*/, 10];
                        case 8: return [4 /*yield*/, res.json()];
                        case 9:
                            _c = _k.sent();
                            _k.label = 10;
                        case 10: return [2 /*return*/, _c];
                        case 11:
                            if (!sendData.isHeaders) return [3 /*break*/, 13];
                            _h = {
                                headers: res.headers
                            };
                            return [4 /*yield*/, res.arrayBuffer()];
                        case 12:
                            _d = (_h.data = _k.sent(),
                                _h);
                            return [3 /*break*/, 15];
                        case 13: return [4 /*yield*/, res.arrayBuffer()];
                        case 14:
                            _d = _k.sent();
                            _k.label = 15;
                        case 15: return [2 /*return*/, _d];
                        case 16:
                            if (!sendData.isHeaders) return [3 /*break*/, 18];
                            _j = {
                                headers: res.headers
                            };
                            return [4 /*yield*/, res.blob()];
                        case 17:
                            _e = (_j.data = _k.sent(),
                                _j);
                            return [3 /*break*/, 20];
                        case 18: return [4 /*yield*/, res.blob()];
                        case 19:
                            _e = _k.sent();
                            _k.label = 20;
                        case 20: return [2 /*return*/, _e];
                        case 21: return [2 /*return*/];
                    }
                });
            });
        })["catch"](function (err) { return ({ code: 400, msg: err.message }); });
}
/**
 * http请求
 * @param url
 * @param param
 */
function net(url, param) {
    if (param === void 0) { param = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var abort, sendData;
        return __generator(this, function (_a) {
            if (!url.startsWith('http://') && !url.startsWith('https://'))
                url = 'https://' + url;
            abort = null;
            if (!param.signal)
                abort = timeOutAbort(param.timeout || 3000);
            sendData = {
                isHeaders: param.isHeaders,
                isStringify: param.isStringify,
                headers: Object.assign({
                    'content-type': 'application/json;charset=utf-8'
                }, param.headers),
                type: param.type || 'TEXT',
                method: param.method || 'GET',
                // timeout只会在未指定signal下生效
                signal: abort ? abort.signal : param.signal,
            };
            if (param.body) {
                sendData.body = param.body;
            }
            else if (param.data) {
                if (sendData.method === 'GET')
                    url = "".concat(url, "?").concat((0, queryParams)(param.data));
                else
                    sendData.body = sendData.isStringify
                        ? (0, queryParams)(param.data)
                        : JSON.stringify(param.data);
            }
            return [2 /*return*/, fetchPromise(url, sendData).then(function (req) {
                if (abort)
                    clearTimeout(abort.id);
                return req;
            })];
        });
    });
}
function isNull(o) {
    return o === '' || o === undefined || o === null || o === 'undefined' || o === 'null';
}
/**
 * 分页工具类/手动分页的好帮手
 * 来源 hutool  https://hutool.cn/
 */
var PageUtil = /** @class */ (function () {
    function PageUtil() {
    }
    /**
     * 获得首页的页码，可以为0或者1
     *
     * @return 首页页码
     */
    PageUtil.getFirstPageNo = function () {
        return PageUtil.firstPageNo;
    };
    /**
     * 设置首页页码，可以为0或者1
     * 当设置为0时，页码0表示第一页，开始位置为0
     * 当设置为1时，页码1表示第一页，开始位置为0
     * @param customFirstPageNo 自定义的首页页码，为0或者1
     */
    PageUtil.setFirstPageNo = function (customFirstPageNo) {
        PageUtil.firstPageNo = customFirstPageNo;
    };
    /**
     * 设置首页页码为1
     * 当设置为1时，页码1表示第一页，开始位置为0
     */
    PageUtil.setOneAsFirstPageNo = function () {
        PageUtil.setFirstPageNo(1);
    };
    /**
     * 设置首页页码为0
     * 当设置为0时，页码0表示第一页，开始位置为0
     */
    PageUtil.setZeroAsFirstPageNo = function () {
        PageUtil.setFirstPageNo(0);
    };
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
    PageUtil.getStart = function (pageNo, pageSize) {
        if (pageNo < PageUtil.firstPageNo) {
            pageNo = PageUtil.firstPageNo;
        }
        if (pageSize < 1) {
            pageSize = 0;
        }
        return (pageNo - PageUtil.firstPageNo) * pageSize;
    };
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
    PageUtil.getEnd = function (pageNo, pageSize) {
        var start = PageUtil.getStart(pageNo, pageSize);
        return PageUtil.getEndByStart(start, pageSize);
    };
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
    PageUtil.transToStartEnd = function (pageNo, pageSize) {
        var start = PageUtil.getStart(pageNo, pageSize);
        return [start, PageUtil.getEndByStart(start, pageSize)];
    };
    ;
    /**
     * @description 根据总数计算总页数
     * @author 没礼貌的芬兰人
     * @date 2021-10-06 17:11:21
     * @param totalCount 总数量
     * @param pageSize   每页数量
     * @return 总页数
     */
    PageUtil.totalPage = function (totalCount, pageSize) {
        if (pageSize == 0) {
            return 0;
        }
        return totalCount % pageSize == 0 ? Math.floor(totalCount / pageSize) : (Math.floor(totalCount / pageSize) + 1);
    };
    /**
     * @description  根据起始位置获取结束位置
     * @author 没礼貌的芬兰人
     * @date 2021-10-06 17:11:07
     * @param start    起始位置
     * @param pageSize 每页条目数
     * @return 结束位置
     */
    PageUtil.getEndByStart = function (start, pageSize) {
        if (pageSize < 1) {
            pageSize = 0;
        }
        return start + pageSize;
    };
    /**
     * @description 彩虹分页算法
     * @author 没礼貌的芬兰人
     * @date 2020-6-06 17:10:59
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
    PageUtil.rainbow = function (currentPage, pageCount, displayCount) {
        displayCount = !(0, isNull)(displayCount) ? displayCount : 10;
        if (currentPage < 0) {
            return Promise.reject("\u53C2\u6570\u5F02\u5E38,\u8BF7\u68C0\u67E5 currentPage : ".concat(currentPage));
        }
        if (pageCount < 0) {
            return Promise.reject("\u53C2\u6570\u5F02\u5E38,\u8BF7\u68C0\u67E5 pageCount : ".concat(pageCount));
        }
        if (displayCount < 0) {
            return Promise.reject("\u53C2\u6570\u5F02\u5E38,\u8BF7\u68C0\u67E5 displayCount : ".concat(displayCount));
        }
        var isEven = displayCount % 2 === 0;
        var left = Math.floor(displayCount / 2);
        var right = Math.floor(displayCount / 2);
        var length = displayCount;
        if (isEven) {
            right++;
        }
        if (pageCount < displayCount) {
            length = pageCount;
        }
        var result = new Array(length);
        if (pageCount >= displayCount) {
            if (currentPage <= left) {
                for (var i = 0; i < result.length; i++) {
                    result[i] = i + 1;
                }
            }
            else if (currentPage > pageCount - right) {
                for (var i = 0; i < result.length; i++) {
                    result[i] = i + pageCount - displayCount + 1;
                }
            }
            else {
                for (var i = 0; i < result.length; i++) {
                    result[i] = i + currentPage - left + (isEven ? 1 : 0);
                }
            }
        }
        else {
            for (var i = 0; i < result.length; i++) {
                result[i] = i + 1;
            }
        }
        return Promise.resolve(result);
    };
    /**
     * 首页页码
     */
    PageUtil.firstPageNo = 0;
    return PageUtil;
}());


var stringToHTML = function (str) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, 'text/html');
    return doc.body;
};

function random(start, end) {
    return (Math.random() * (end - start + 1) + start) | 0;
}


async function getImgUrl() {
    try {
        let key = localStorage.getItem('Keyword') ?? 'rikka'

        let totalCount = await getSearchCount(key)
        console.log(key,totalCount);
        let totalPage = PageUtil.totalPage(totalCount, 24)
        if (totalCount === 0) return Promise.reject('[pupImg] Search results are empty');

        const page_rm = random(1, totalPage === 1 ? 1 : totalPage - 1)
        const search_end = stringToHTML(await net(`https://wallhaven.cc/search?q=${key}&page=${page_rm}`, { timeout: 5000 }))


        let pic_rm = 0
        if (page_rm === (totalPage === 1 ? 1 : totalPage - 1)) pic_rm = random(0, search_end.querySelectorAll('.preview').length - 1)
        else pic_rm = random(0, 23)


        const pic_url = search_end.querySelectorAll('.preview')[pic_rm].getAttribute('href');
        const pic_dom = stringToHTML(await net(pic_url, { timeout: 5000 }))
        return pic_dom.querySelector('#wallpaper').getAttribute("src")
    } catch (e) {
        console.log(e);
        return Promise.reject('[pupImg] network anomaly');
    }
}

async function getSearchCount(name) {
    let search = stringToHTML(await net(`https://wallhaven.cc/search?q=${name}`, { timeout: 5000 }))
    let search_count = search.querySelector('.listing-header>h1').outerHTML
    console.log(search_count);
    return Number(search_count.substring(search_count.lastIndexOf('</i>') + 4, search_count.indexOf('Wallpapers')).replace(/\,/g, ''))
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.men === 'Refresh') {
            getImgUrl().then(url => sendResponse({ url, ggopacity: localStorage.getItem('ggopacity') ?? 0.8 }))
        }
        return true
    });