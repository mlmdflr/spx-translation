import { isSecondInstanceWin } from '@/cfg/app.json'
import { urlPreloadInit } from "@mlmdflr/electron-modules/preload";

urlPreloadInit({isSecondInstanceWin})

