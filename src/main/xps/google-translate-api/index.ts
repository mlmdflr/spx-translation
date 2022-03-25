import req from "../../modular/enhance/net-request";
import { isSupported, getCode, langs } from "./languages";

interface googleTranslateApi {
    from?: string;
    to?: string;
    tld?: string;
}
interface ITranslateText {
    autoCorrected: boolean;
    value: string;
    didYouMean: boolean;
}

interface ITranslateLanguage {
    didYouMean: boolean;
    iso: string;
}

interface ITranslateResponse {
    text: string;
    pronunciation: string;
    from: {
        language: ITranslateLanguage;
        text: ITranslateText;
    };
    raw: string;
}



declare global {
    interface Error {
        code: number;
    }
}


function extract(key: string, res: { body: string; }) {
    var re = new RegExp(`"${key}":".*?"`);
    var result = re.exec(res.body);
    if (result !== null) {
        return result[0].replace(`"${key}":"`, '').slice(0, -1);
    }

    return '';
}

export default async function translate(text: any, opts: googleTranslateApi): Promise<ITranslateResponse> {
    let gotopts = {};
    var e: Error | undefined = undefined;
    [opts.from, opts.to].forEach((lang) => {
        if (lang && !isSupported(lang)) {
            e = new Error();
            e.code = 400;
            e.message = 'The language \'' + lang + '\' is not supported';
        }
    });
    if (e) {
        return new Promise(function (resolve, reject) {
            reject(e);
        });
    }

    opts.from = opts.from || 'auto';
    opts.to = opts.to || 'en';
    opts.tld = opts.tld || 'com';

    opts.from = getCode(opts.from as keyof typeof langs);
    opts.to = getCode(opts.to as keyof typeof langs);

    var url = 'https://translate.google.' + opts.tld;
    return req<string>(url, gotopts).then(function (res) {
        var data = {
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

        return data;
    }).then(async (data: any) => {
        url = url + '/_/TranslateWebserverUi/data/batchexecute?' + new URLSearchParams((data)).toString();
        gotopts = {
            data: 'f.req=' + encodeURIComponent(JSON.stringify([[['MkEWBc', JSON.stringify([[text, opts.from, opts.to, true], [null]]), null, 'generic']]])) + '&',
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }, method: 'post'
        }
        return req<string>(url, gotopts).then((res) => {
            var json = res.slice(6);
            var length = '';

            var result = {
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

            if (json[1][0][0][5] === undefined || json[1][0][0][5] === null) {
                // translation not found, could be a hyperlink or gender-specific translation?
                result.text = json[1][0][0][0];
            } else {
                result.text = (json[1][0][0][5] as unknown as [])
                    .map(function (obj: any[]) {
                        return obj[0];
                    })
                    .filter(Boolean)
                    // Google api seems to split text per sentences by <dot><space>
                    // So we join text back with spaces.
                    // See: https://github.com/vitalets/google-translate-api/issues/73 
                    .join(' ');
            }
            result.pronunciation = json[1][0][0][1];

            // From language
            if (json[0] && json[0][1] && json[0][1][1]) {
                result.from.language.didYouMean = true;
                result.from.language.iso = json[0][1][1][0];
            } else if (json[1][3] === 'auto') {
                result.from.language.iso = json[2];
            } else {
                result.from.language.iso = json[1][3];
            }
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
        }).catch((err: { message: string; statusCode: number | undefined; code: string; }) => {
            err.message += `\nUrl: ${url}`;
            if (err.statusCode !== undefined && err.statusCode !== 200) {
                err.code = 'BAD_REQUEST';
            } else {
                err.code = 'BAD_NETWORK';
            }
            throw err;
        });
    });
}


