import { createWorker, createScheduler } from "tesseract.js";
import global from "@/main/modular/general/global";
import { logError, logInfo } from "../modular/general/log";
import { getJson } from ".";
import { isNull } from "@mlmdflr/tools";

export default class tesseract {
    private static instance: tesseract;

    public isOk: boolean = false;

    static getInstance() {
        if (!tesseract.instance) tesseract.instance = new tesseract();
        return tesseract.instance;
    }

    private scheduler!: Tesseract.Scheduler;

    async on() {
        const cfg = await getJson()

        if (!cfg.orc.open) throw Error('tesseract close')

        let lang = ''
        let workerLen = 3
        if (cfg.orc.lang && cfg.orc.lang.length !== 0) {
            lang = cfg.orc.lang.join('+')
        } else return;
        if (!isNull(cfg.orc.worker) && cfg.orc.worker > 0 && cfg.orc.worker < 10) workerLen = cfg.orc.worker
        tesseract.getInstance().scheduler = createScheduler();
        for (let index = 0; index < workerLen; index++) {
            const worker = createWorker({
                langPath: global.getResourcesPath('root', 'tesseract/langPath'),
                cachePath: global.getResourcesPath('root', 'tesseract/cachePath'),
                // logger: m => logInfo('[tesseract info]', m),
                errorHandler: err => logError('[tesseract error]', err)
            })
            tesseract.getInstance().scheduler.addWorker(worker);
            await worker.load();
            await worker.loadLanguage(lang);
            await worker.initialize(lang);
        }
        console.log('[tesseract info]', 'Ready');
        tesseract.getInstance().isOk = true
    }
    
    async orc(img: Buffer) {
        if (tesseract.getInstance().isOk) return await tesseract.getInstance().scheduler.addJob('recognize', img)
        else throw Error('tesseract not')
    }
}