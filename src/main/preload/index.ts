import { isSecondInstanceWin } from '@/cfg/app.json'
import { preloadInit } from "@mlmdflr/electron-modules/preload";
preloadInit({ isSecondInstanceWin })

