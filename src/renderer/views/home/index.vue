<template>
    <div ref="mainBody" class="main-body">
    </div>
</template>

<script setup lang="ts">
import { windowMessageOn, windowShow } from '@mlmdflr/electron-modules/renderer/window';
import { ref, onMounted } from 'vue';

let mainBody = ref<HTMLElement>()

onMounted(() => {
    windowShow(window.customize.id);
});

windowMessageOn((_, url) => {
    console.log(url);
    
    mainBody.value!.style.backgroundSize = '100%'
    mainBody.value!.style.backgroundPosition = 'center'
    mainBody.value!.style.backgroundImage = `url('${url}')`
}, 'switch-background')

</script>

<style lang="scss" scoped>
.main-body {
    width: 100%;
    height: 100%;
}
</style>