<template>
  <Head/>
  <div class="container">
    <div class="about-info">
      <ElImage
        src="https://portrait.gitee.com/uploads/avatars/user/2624/7874260_liaozhi_5_1625049015.png"
        style="width: 68px; height: 68px"
        alt="@沒禮貌的芬蘭人"
        :preview-src-list="['https://portrait.gitee.com/uploads/avatars/user/2624/7874260_liaozhi_5_1625049015.png']"
      ></ElImage>
      <div @click="open" class="name">没礼貌的芬兰人</div>
      <ElButton @click="toHome">首页</ElButton>
    </div>
  </div>
</template>


<script setup lang="ts">
import { onMounted } from 'vue';
import { windowCreate, windowShow } from '@/renderer/common/window';
import { openUrl } from '@/renderer/common';
import { ElImage, ElButton } from 'element-plus'
import Head from "@/renderer/views/components/head/index.vue";


onMounted(() => {
  windowShow();
});


function open() {
  openUrl('https://gitee.com/liaozhi_5');
}

function toHome() {
  windowCreate({
    customize: {
      isMainWin: true,
      route: '/home'
    }
  });
}
</script>

<style lang='scss' scoped>
@import "./scss/index";
</style>
