import { agent_net } from "../../modular/enhance/net-request/net";
import { isSupported, getCode } from "./languages";

declare global {
    interface Error {
        code: number;
    }
}

function extract(key: string, res: { body: string; }) {
    var re = new RegExp(`"${key}":".*?"`);
    var result = re.exec(res.body);
    if (result !== null) return result[0].replace(`"${key}":"`, '').slice(0, -1);
    return '';
}


export default async function translate(text: any, opts: GoogleTranslateApi, param?: NetReq.NetOpt, netagent?: NetReq.EasyAgent): Promise<ITranslateResponse> {
    let gotopts = {};
    var e: Error | undefined = undefined;
    [opts.from, opts.to].forEach((lang) => {
        if (lang && !isSupported(lang as GoogleTranslate.desiredLang)) {
            e = new Error();
            e.code = 400;
            e.message = 'The language \'' + lang + '\' is not supported';
        }
    });
    if (e) return Promise.reject(e)

    opts.from = opts.from || 'auto';
    opts.to = opts.to || 'en';
    opts.tld = opts.tld || 'com';
    opts.from = getCode(opts.from as GoogleTranslate.desiredLang);
    opts.to = getCode(opts.to as GoogleTranslate.desiredLang);

    let url = 'https://translate.google.' + opts.tld;
    return agent_net<string>(url, param, netagent).catch(err => {
        err.msg += `\nUrl: ${url}`;
        err.code = 400;
        throw err;
    }).then((res) => {
        return {
            'rpcids': 'MkEWBc',
            'f.sid': extract('FdrFJe', { body: res }),
            'bl': extract('cfb2h', { body: res }),
            'hl': 'en-US',
            'soc-app': 1,
            'soc-platform': 1,
            'soc-device': 1,
            '_reqid': Math.floor(1000 + (Math.random() * 9000)),
            'rt': 'c'
        };
    }).then(async (data: any) => {
        url = url + '/_/TranslateWebserverUi/data/batchexecute?' + new URLSearchParams((data)).toString();
        gotopts = {
            body: 'f.req=' + encodeURIComponent(JSON.stringify([[['MkEWBc', JSON.stringify([[text, opts.from, opts.to, true], [null]]), null, 'generic']]])) + '&',
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            method: 'post',
        }
        return agent_net<string>(url, { ...gotopts, timeout: param?.timeout }, netagent).then((res) => {
            let json = res.slice(6);
            let length = '';
            const result = {
                text: '',
                pronunciation: '',
                from: {
                    language: {
                        didYouMean: false,
                        iso: ''
                    },
                    text: {
                        autoCorrected: false,
                        value: '',
                        didYouMean: false
                    }
                },
                raw: ''
            };
            try {
                length = (/^\d+/.exec(json) as RegExpExecArray)[0];
                json = JSON.parse(json.slice(length.length, parseInt(length, 10) + length.length));
                json = JSON.parse(json[0][2]);
                result.raw = json;
            } catch (e) {
                return result;
            }
            if (json[1][0][0][5] === undefined || json[1][0][0][5] === null) result.text = json[1][0][0][0];
            else result.text = (json[1][0][0][5] as unknown as []).map((obj: any[]) => obj[0]).filter(Boolean).join(' ');
            result.pronunciation = json[1][0][0][1];
            if (json[0] && json[0][1] && json[0][1][1]) {
                result.from.language.didYouMean = true;
                result.from.language.iso = json[0][1][1][0];
            } else if (json[1][3] === 'auto') result.from.language.iso = json[2];
            else result.from.language.iso = json[1][3];
            if (json[0] && json[0][1] && json[0][1][0]) {
                var str = json[0][1][0][0][1];
                str = str.replace(/<b>(<i>)?/g, '[');
                str = str.replace(/(<\/i>)?<\/b>/g, ']');
                result.from.text.value = str;
                if (json[0][1][0][2] === '1') {
                    result.from.text.autoCorrected = true;
                } else {
                    result.from.text.didYouMean = true;
                }
            }
            return result;
        }).catch((err) => {
            err.msg += `\nUrl: ${url}`;
            err.code = 400;
            throw err;
        });
    })
}


