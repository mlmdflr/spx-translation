const fs = require('fs');
const readline = require('readline');
const util = require('util');
const path = require('path');
const webpack = require('webpack');
const builder = require('electron-builder');
const buildConfig = require('../resources/build/cfg/build.json');
const main = require('./webpack.main.config'); //主进程
const renderer = require('./webpack.renderer.config'); //子进程
let [, , arch, _notP] = process.argv;

const optional = ['win', 'win32', 'win64', 'winp', 'winp32', 'winp64', 'darwin', 'mac', 'linux'];
const linuxOptional = ['AppImage', 'snap', 'deb', 'rpm', 'pacman'];
const notP_optional = '-notp'

const r = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const question = util.promisify(r.question).bind(r);

function deleteFolderRecursive(url) {
  let files = [];
  if (fs.existsSync(url)) {
    files = fs.readdirSync(url);
    files.forEach(function (file, index) {
      let curPath = path.join(url, file);
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(url);
  }
}

buildConfig.afterPack = 'scripts/buildAfterPack.js';

buildConfig.extraResources = [
  {
    from: 'resources/extern',
    to: 'extern/',
    filter: ['**/*']
  }
];

function checkInput(str) {
  if (optional.indexOf(str) === -1) {
    console.log(`\x1B[31mIllegal input , Please check input \x1B[0m`);
    r.close();
    return false;
  }
  return true;
}

async function core(arch) {
  arch = arch.trim();
  let archTag = '';
  let archPath = '';
  switch (arch) {
    case 'win':
    case 'win32':
    case 'win64':
    case 'winp':
    case 'winp32':
    case 'winp64':
      archTag = builder.Platform.WINDOWS.createTarget();
      archPath = 'platform/win32';
      if (arch.startsWith('win')) {
        let bv = {
          target: 'nsis',
          arch: null
        };
        if (arch.length === 3) bv.arch = ['x64', 'ia32'];
        else if (arch.indexOf('32') > -1) bv.arch = ['ia32'];
        else if (arch.indexOf('64') > -1) bv.arch = ['x64'];
        buildConfig.win.target = [bv];
      }
      if (arch.startsWith('winp')) {
        let bv = {
          target: 'portable',
          arch: null
        };
        if (arch.length === 4) bv.arch = ['x64', 'ia32'];
        else if (arch.indexOf('32') > -1) bv.arch = ['ia32'];
        else if (arch.indexOf('64') > -1) bv.arch = ['x64'];
        buildConfig.win.target = [bv];
      }
      break;
    case 'darwin':
    case 'mac':
      archTag = builder.Platform.MAC.createTarget();
      archPath = 'platform/darwin';
      break;
    case 'linux':
      archTag = builder.Platform.LINUX.createTarget();
      archPath = 'platform/linux';
      let line = await question('\x1B[36mPlease input linux package type:\x1B[0m \n optional：\x1B[33m' + linuxOptional + '\x1B[0m  \x1B[1mor\x1B[0m  \x1B[33mq\x1B[0m \x1B[1m(exit)\x1B[0m\n')
      line = line.trim();
      if (line === 'q') {
        r.close();
        process.exit(0);
      }
      if (linuxOptional.indexOf(line) > -1) {
        buildConfig.linux.target = line;
        r.close();
      } else {
        console.log(`\x1B[31mIllegal input , Please check input \x1B[0m`);
        process.exit(0);
      }
      break;
  }
  try {
    fs.accessSync(path.resolve('./resources/' + archPath));
    buildConfig.extraResources.push({
      from: 'resources/' + archPath,
      to: archPath,
      filter: ['**/*']
    });
  } catch (err) { }
  fs.writeFileSync('./resources/build/cfg/build.json', JSON.stringify(buildConfig, null, 2)); //写入配置
  deleteFolderRecursive(path.resolve('dist')); //清除dist
  console.log('\x1B[34m[build start]\x1B[0m');
  webpack([{ ...main('production') }, { ...renderer('production') }], (err, stats) => {
    if (err || stats.hasErrors()) throw err;
    builder
      .build({
        targets: archTag,
        config: buildConfig
      })
      .then(() => {
        console.log('\x1B[32m[build success] \x1B[0m');
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => process.exit());
  });
}

if (!arch) {
  console.log('\x1B[36mWhich platform is you want to build?\x1B[0m');
  console.log(` optional：\x1B[33m${optional}\x1B[0m  \x1B[1mor\x1B[0m  \x1B[33mq\x1B[0m \x1B[1m(exit)\x1B[0m  \x1B[2m|\x1B[0m  [\x1B[36m${notP_optional}\x1B[0m]  `);
  r.on('line', (str) => {
    let strs = str.split(" ").filter(s => s !== '')
    if (strs[0] === 'q') {
      console.log(`\x1B[32mExit success\x1B[0m`);
      r.close();
      return;
    }
    if (strs[1] && strs[1] === notP_optional) delete buildConfig.afterPack
    if (!checkInput(str)) return;
    r.pause();
    core(str);
  });
} else {
  if (_notP) delete buildConfig.afterPack
  if (checkInput(arch)) core(arch);
}
