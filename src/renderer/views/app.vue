<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition || 'fade'" mode="out-in">
      <keep-alive
        :include="keepAliveData.include"
        :exclude="keepAliveData.exclude"
        :max="keepAliveData.max"
        :key="route.meta['usePathKey'] ? route.path : undefined"
      >
        <Suspense>
          <component :is="Component" />
        </Suspense>
      </keep-alive>
    </transition>
  </router-view>
</template>
<script setup lang="ts">
import { keepAliveData } from '@/renderer/store';
</script>
<style lang="scss">
@import "./scss/color";
@import "./scss/index";
</style>
  