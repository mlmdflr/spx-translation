type OpenmMode = 'electron' | 'browser'

type cfg = {
    wifekeyword: string,
    ggopacity: number,
    default: number,
    webOpenmMode: OpenmMode,
    htmlLang: GoogleTranslate.desiredLang,
    deeplHtmlLang: DeeplTranslate.desiredLang,
    hotKey: {
        showHied: string
        screenshotTranslate: string
        fastTranslate: string
    },
    userAgent: string
    proxy: NetReq.EasyAgent & { open: boolean }
    orc: {
        lang: [],
        worker: number,
        open: boolean
    }
}

