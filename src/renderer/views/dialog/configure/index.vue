<template>
  <div class="container">
    <Head :eventShow="false" />
    <div class="message-info">
      <ElDivider content-position="left">设置老婆关键字</ElDivider>
      <ElRow :gutter="30">
        <ElCol :span="16">
          <ElInput v-model="wifekeyword"></ElInput>
        </ElCol>
        <ElCol :span="4" :offset="2">
          <ElButton plain size="medium" @click="testWifekeyword">搜索</ElButton>
        </ElCol>
      </ElRow>
      <ElDivider content-position="left">设置透明度</ElDivider>
      <ElSlider :min="0.5" :max="1" :step="0.1" style="width: 80%" v-model="ggopacity"></ElSlider>
      <ElDivider content-position="left">设置窗口透明度</ElDivider>
      <ElSlider :min="0.5" :max="1" :step="0.1" style="width: 80%" v-model="winopacity"></ElSlider>
      <ElDivider content-position="left">默认进入</ElDivider>
      <ElRadioGroup v-model="_default">
        <ElRadio :label="1">国内</ElRadio>
        <ElRadio :label="2">国外</ElRadio>
        <ElRadio :label="0">不设置</ElRadio>
      </ElRadioGroup>
      <ElButton class="close" @click="close">确定</ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import customize from '@/renderer/store/customize';

import { windowClose, windowShow, windowMessageRemove } from '@/renderer/common/window';

import Head from '@/renderer/views/components/head/index.vue';
import {
  ElButton,
  ElInput,
  ElRow,
  ElCol,
  ElDivider,
  ElRadio,
  ElRadioGroup,
  ElNotification
} from 'element-plus';

import { ElSlider } from "element-plus";

const argsData = customize.get();
let wifekeyword = ref(argsData.data?.wifekeyword);
let ggopacity = ref(argsData.data?.ggopacity);
let winopacity = ref(argsData.data?.winopacity);
let _default = ref(argsData.data?.default);

function close() {
  windowClose();
  window.ipc.invoke('updateCfg', {
    wifekeyword: wifekeyword.value,
    ggopacity: ggopacity.value,
    winopacity: winopacity.value,
    default: _default.value
  });
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

onUnmounted(() => {
  windowMessageRemove('communication'); //关闭监听
});

</script>

<style lang='scss' scoped>
@import "./scss/index";
</style>
