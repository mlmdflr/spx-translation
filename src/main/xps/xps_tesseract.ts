import { createWorker, createScheduler } from "tesseract.js";
import global from "@/main/modular/general/global";
import { logError, logInfo } from "../modular/general/log";


export default class tesseract {
    private static instance: tesseract;

    public static isOk: boolean = false;

    static getInstance() {
        if (!tesseract.instance) tesseract.instance = new tesseract();
        return tesseract.instance;
    }

    private scheduler!: Tesseract.Scheduler;

    async on() {
        tesseract.getInstance().scheduler = createScheduler();
        for (let index = 0; index < 3; index++) {
            const worker = createWorker({
                langPath: global.getResourcesPath('root', 'tesseract/langPath'),
                cachePath: global.getResourcesPath('root', 'tesseract/cachePath'),
                logger: m => logInfo('[tesseract info]', m),
                errorHandler: err => logError('[tesseract error]', err)
            })
            tesseract.getInstance().scheduler.addWorker(worker);
            await worker.load();
            await worker.loadLanguage('eng+jpn');
            await worker.initialize('eng+jpn');
        }
        console.log('[tesseract info]', 'Ready');
        tesseract.isOk = true
    }

    async orc(img: Buffer) {
        return await tesseract.getInstance().scheduler.addJob('recognize', img)
    }


}