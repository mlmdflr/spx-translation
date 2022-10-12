type OpenmMode = 'electron' | 'browser'

type cfg = {
    wifekeyword: string,
    ggopacity: number,
    default: number,
    webOpenmMode: OpenmMode,
    htmlLang: GoogleTranslate.desiredLang,
    deeplHtmlLang: DeeplTranslate.desiredLang,
    userAgent: string
    proxy: NetReq.EasyAgent & { open: boolean }
}

