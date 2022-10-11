import { readFile, writeFile } from "@mlmdflr/electron-modules/main/file"
import { resourcesPathGet } from "@/main/modular/resources";


const setCfg = async (args: cfg) => {
  return writeFile(resourcesPathGet('extern', 'gg.json'), JSON.stringify(args), { encoding: 'utf-8' })
}


/**
 * 获取配置文件
 * @returns 配置文件
 */
const getJson = async () => {
  return JSON.parse(await readFile(resourcesPathGet("extern", 'gg.json'), { encoding: 'utf-8' }) as string) as cfg
}


export { setCfg, getJson }