const { info, success, warn } = require('./log')
const fs = require('fs');
const path = require('path');
const v8 = require('v8');
const bytenode = require('bytenode');
v8.setFlagsFromString('--no-lazy');

const codePath = path.join('./dist'); // 编译目录
const ignorePath = ['static', 'web']; // 编译忽略规则文件夹
const ignorefile = ['index.html', 'preload.js', 'preload.url.js']; // 编译忽略规则文件

module.exports = async () => {
  info('[bytecode build] start');
  await buildDir(codePath);
  success('[bytecode build] success');
  // 遍历构建
  async function buildDir(dir) {
    const files = fs.readdirSync(dir);

    for (let file of files) {
      const filePath = path.join(dir, file);
      if (ignorePath.includes(path.parse(filePath).base)) {
        warn(`[bytecode build skip] ${filePath} hit ignore rule`);
        return
      }
      // 检查文件是否在忽略列表
      if (ignorefile.includes(file)) {
        warn(`[bytecode build skip] ${filePath} hit ignore rule`);
        return
      }
      try {
        const fileInfo = fs.statSync(filePath);
        if (fileInfo.isDirectory()) {
          // 是文件夹
          await buildDir(filePath);
        } else {
          // 是文件
          await buildFile(filePath);
        }
      } catch (error) {
        console.warn(`[Skip Build] ${filePath}`, error);
      }
    }
  }
  // 构建 bytecode 文件
  async function buildFile(source) {
    const fileNameInfo = path.parse(source);
    if (fileNameInfo.ext == '.jsc') {
      warn('[bytecode build]', `${source} it has been compiled.`);
      return;
    }

    await bytenode.compileFile({
      electron: true,
      filename: source,
      output: `${fileNameInfo.dir}/${fileNameInfo.name}.jsc`
    });
    bytenode.addLoaderFile(`${fileNameInfo.dir}/${fileNameInfo.name}.jsc`, `${fileNameInfo.base}`);

    success('[bytecode build] success', source);
  }
};
