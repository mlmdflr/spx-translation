<template>
  <div class="container">

    <Head :eventShow="false" :max-show="false" :min-show="false" />
    <div class="message-info">
      <ElDivider content-position="left">设置老婆关键字</ElDivider>
      <ElRow :gutter="30">
        <ElCol :span="16">
          <ElInput :maxlength="10" v-model="wifekeyword"></ElInput>
        </ElCol>
        <ElCol :span="4" :offset="2">
          <ElButton plain size="small" @click="testWifekeyword">搜索</ElButton>
        </ElCol>
      </ElRow>
      <ElDivider content-position="left">设置透明度</ElDivider>
      <ElSlider :min="0.5" :max="1" :step="0.1" style="width: 80%" v-model="ggopacity"></ElSlider>
      <ElDivider content-position="left">缓存</ElDivider>
      <ElRow :gutter="30">
        <ElCol :span="4">程序缓存</ElCol>
        <ElCol :span="8">{{ cacheSize }}</ElCol>
        <ElCol :span="7">
          <ElButton type="warning" plain size="small" @click="delCache">清除缓存</ElButton>
        </ElCol>
      </ElRow>
      <ElDivider content-position="left">页面语言</ElDivider>
      谷歌: <ElSelect v-model="lang" @change="langChange" size="small">
        <ElOption v-for="item in Object.keys(objLangs)" :key="item" :label="objLangs[item]" :value="item" />
      </ElSelect>
      deepl: <ElSelect v-model="deeplLang" @change="deeplLangChange" size="small">
        <ElOption v-for="item in Object.keys(objdeeplLangs)" :key="item" :label="objdeeplLangs[item]" :value="item" />
      </ElSelect>
      <ElDivider content-position="left">
        <span style="padding: 10px;">网站翻译</span>
        <ElRadioGroup v-model="website_default">
          <ElRadio label="electron">electron</ElRadio>
          <ElRadio label="browser">系统</ElRadio>
        </ElRadioGroup>
      </ElDivider>
      <div class="close">
        <ElButton v-if="restShow" type="info" plain @click="restart">立即重启</ElButton>
        <ElButton @click="close">确定</ElButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';



import { windowClose, windowShow, } from '@mlmdflr/electron-modules/renderer/window';

import { bytesToSize } from "@mlmdflr/tools";

import Head from '@/renderer/views/components/head/index.vue';
import {
  ElButton,
  ElInput,
  ElRow,
  ElCol,
  ElDivider,
  ElRadio,
  ElRadioGroup,
  ElNotification,
  ElMessage,
  ElSelect,
  ElOption
} from 'element-plus';

import { ElSlider } from "element-plus";

import { langs } from "@/main/google-translate-api/languages";
import { langs as deeplLangs } from "@/main/deepl-api/languages";

import { relaunch } from '@mlmdflr/electron-modules/renderer/app';

const objLangs: {
  [key: string]: string
} = langs

const objdeeplLangs: {
  [key: string]: string
} = deeplLangs





const argsData = window.customize;

let cacheSize = ref('')

let restShow = ref(false)

let lang = ref(argsData.data.htmlLang)

let deeplLang = ref(argsData.data.deeplHtmlLang)



let getCache = () => window.ipc.invoke('get:cache').then(res => cacheSize.value = bytesToSize(res).bytes + bytesToSize(res).unit)

getCache()

let wifekeyword = ref(argsData.data?.wifekeyword);
let ggopacity = ref(argsData.data?.ggopacity);
let website_default = ref(argsData.data?.webOpenmMode)

let delCache = () => window.ipc.invoke('clear:cache').then(res => getCache()).then(res => ElMessage({
  message: '清除缓存成功',
  type: 'success',
}))


function restart() {
  argsData.data.wifekeyword = wifekeyword.value
  argsData.data.ggopacity = ggopacity.value;
  argsData.data.htmlLang = lang.value
  argsData.data.deeplHtmlLang = deeplLang.value
  argsData.data.webOpenmMode = website_default.value
  window.ipc.invoke('updateCfg', argsData.data).then(() => relaunch(true))
}

function close() {
  windowClose();
  argsData.data.wifekeyword = wifekeyword.value
  argsData.data.ggopacity = ggopacity.value;
  argsData.data.htmlLang = lang.value
  argsData.data.deeplHtmlLang = deeplLang.value
  argsData.data.webOpenmMode = website_default.value
  window.ipc.invoke('updateCfg', argsData.data);
}

function langChange(val: string) {
  lang.value = val
  restShow.value = true
}

function deeplLangChange(val: string) {
  deeplLang.value = val
  restShow.value = true
}

function testWifekeyword() {
  const count = window.ipc.sendSync('get-search-count', wifekeyword.value);
  if (count) {
    ElNotification({
      title: '搜索成功',
      message: '一共有' + count + '张图片',
      offset: 35,
      type: 'success'
    });
  } else {
    ElNotification({
      title: '搜索失败',
      message: '网络异常请||关键搜索不到',
      offset: 35,
      type: 'error'
    });
  }
}

onMounted(() => {
  windowShow();
});


</script>

<style lang='scss' scoped>
@import "./scss/index";
</style>
