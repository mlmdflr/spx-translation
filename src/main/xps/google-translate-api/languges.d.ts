interface GoogleTranslateApi {
    from?: GoogleTranslate.desiredLang;
    to?: GoogleTranslate.desiredLang;
    tld?: GoogleTranslate.origin;
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

declare namespace GoogleTranslate {
    type desiredLang = keyof typeof import('./languages').langs;
    type origin = 'com' | 'cn';
}