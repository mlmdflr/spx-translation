import { statSync, writeFileSync, appendFileSync } from "fs";
import { sep } from "path";
import { app, ipcMain } from "electron";
import { EOL } from "os";

const logFile: string = app.getPath("logs");

function write(type: string, data: string) {
  const date = new Date();
  const path =
    logFile +
    `${sep}${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date
      .getDate()
      .toString()
      .padStart(2, "0")}.${type}.log`;
  const str = `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] [${type}] ${data}${EOL}`;
  try {
    statSync(path);
  } catch (e) {
    writeFileSync(path, str);
    return;
  }
  appendFileSync(path, str);
}

/**
 * info日志
 * @param val
 */
export function logInfo(...val: any): void {
  let data = "";
  val.forEach((e: any) => {
    try {
      if (typeof e === "object") data += JSON.stringify(e);
      else data += e.toString();
    } catch (e) {
      data += e;
    }
  });
  write("info", data);
}

/**
 * info警告
 * @param val
 */
export function logWarn(...val: any): void {
  let data = "";
  val.forEach((e: any) => {
    try {
      if (typeof e === "object") data += JSON.stringify(e);
      else data += e.toString();
    } catch (e) {
      data += e;
    }
  });
  write("warn", data);
}

/**
 * info错误
 * @param val
 */
export function logError(...val: any): void {
  let data = "";
  val.forEach((e: any) => {
    try {
      if (typeof e === "object") data += JSON.stringify(e);
      else data += e.toString();
    } catch (e) {
      data += e;
    }
  });
  write("error", data);
}

/**
 * 监听
 */
export function logOn() {
  ipcMain.on("log-info", async (event, args) => logInfo(...args));
  ipcMain.on("log-error", async (event, args) => logError(...args));
}
