<template>
  <div class="container">
    <Head :eventShow="false" />
    <div class="message-info">
      <ElDescriptions size="mini" border :column="1" title="详细信息">
        <ElDescriptionsItem label="msg">{{ data.msg }}</ElDescriptionsItem>
        <ElDescriptionsItem label="code">
          <ElCheckTag
            size="small"
            @click="goPage('https://source.chromium.org/chromium/chromium/src/+/master:net/base/net_error_list.h')"
          >{{ data.code }}</ElCheckTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="url">
          <ElLink :underline="false" @click="openUrl(data.url)">{{ data.url }}</ElLink>
        </ElDescriptionsItem>
      </ElDescriptions>
      <div style="height: 10px;"></div>
      <ElRow :gutter="20">
        <ElCol :span="3" :offset="18">
          <ElButton size="mini" type="info" plain @click="restart">重启</ElButton>
        </ElCol>
        <ElCol :span="3">
          <ElButton size="mini" type="info" plain  @click="quit">退出</ElButton>
        </ElCol>
      </ElRow>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import customize from '@/renderer/store/customize';

import { windowClose, windowShow } from '@/renderer/common/window';

import Head from '@/renderer/views/components/head/index.vue';
import {
  ElButton,
  ElDescriptions,
  ElDescriptionsItem,
  ElLink,
  ElCheckTag,
  ElRow,
  ElCol
} from 'element-plus';
import { openUrl, relaunch } from '@/renderer/common';

const data: { code: number, msg: string, url: string } = customize.get().data;



const quit = () => {
  windowClose(0);
  windowClose(1);
  windowClose();
}

const restart = () => {
  relaunch(true)
}

const goPage = (url: string) => {
  openUrl(url)
}

onMounted(() => {
  windowShow();
});

</script>

<style lang='scss' scoped>
@import "./scss/index";
</style>
