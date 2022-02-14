<template>
  <div class="head-info drag">
    <div v-if="isMacintosh" class="content">
      <div></div>
      <div class="title">{{ title }}</div>
    </div>
    <div v-else class="content">
      <div class="title">{{ title }}</div>
      <div v-if="eventShow" class="events">
        <div @click="min" class="event min no-drag"></div>
        <div @click="maxMin" class="event max-min no-drag"></div>
        <div @click="close" class="event close no-drag"></div>
      </div>
    </div>
  </div>
</template>



<script setup lang='ts' >
import { getGlobal } from '@/renderer/common/app';
import { windowClose, windowMaxMin, windowMin } from '@/renderer/common/window';
import customize from '@/renderer/store/customize';

const props = defineProps({
    eventShow: {
    type: Boolean,
    default: true
  }
});

const isMacintosh = await getGlobal<string>('system.platform') === 'darwin';


let title: string = customize.get().title || await getGlobal<string>('app.name')

function min() {
  windowMin();
}

function maxMin() {
  windowMaxMin();
}

function close() {
  windowClose();
}

</script>

<style lang='scss' scoped>
@import "./scss/index";
</style>