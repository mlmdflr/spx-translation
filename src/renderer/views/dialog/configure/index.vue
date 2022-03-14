<template>
  <div class="container">
    <Head :eventShow="true" :max-show="false" :min-show="false" />
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
      <ElDivider content-position="left">默认源</ElDivider>
      <ElRadioGroup v-model="_default">
        <ElRadio :label="1">.cn</ElRadio>
        <ElRadio :label="2">.com</ElRadio>
        <ElRadio :label="0">不设置</ElRadio>
      </ElRadioGroup>
      <ElButton class="close" @click="close">确定</ElButton>
     
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import customize from '@/renderer/store/customize';

import { windowClose, windowShow, } from '@/renderer/common/window';

import net from "@/util/net";

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
} from 'element-plus';

import { ElSlider } from "element-plus";

const argsData = customize.get();

let cacheSize = ref('')


let getCache = () => window.ipc.invoke('get:cache').then(res => cacheSize.value = net.bytesToSize(res).bytes + net.bytesToSize(res).unit)

getCache()

let wifekeyword = ref(argsData.data?.wifekeyword);
let ggopacity = ref(argsData.data?.ggopacity);
let _default = ref(argsData.data?.default);

let delCache = () => window.ipc.invoke('clear:cache').then(res => getCache()).then(res => ElMessage({
  message: '清除缓存成功',
  type: 'success',
}))

function close() {
  windowClose();
  argsData.data.wifekeyword = wifekeyword.value
  argsData.data.ggopacity = ggopacity.value;
  argsData.data.default = _default.value
  window.ipc.invoke('updateCfg', argsData.data);
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
