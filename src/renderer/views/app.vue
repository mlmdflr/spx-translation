<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition as string || 'fade'" mode="out-in">
      <keep-alive :include="keepAliveData.include" :exclude="keepAliveData.exclude" :max="keepAliveData.max"
        :key="route.meta['usePathKey'] ? route.path : undefined">
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
</template>
<script setup lang="ts">
import { keepAliveData } from "@/renderer/store";
import { defineComponent, h, resolveComponent, } from 'vue';
const routerView = defineComponent({
  render: () => h(resolveComponent('router-view'))
})
const component = defineComponent({
  render: () => h(resolveComponent('component'))
})
const keepAlive = defineComponent({
  render: () => h(resolveComponent('keep-alive'))
})
</script>
<style lang="scss">
@import "./scss/color";
@import "./scss/index";

:root {
  --background_color: red
}
</style>
