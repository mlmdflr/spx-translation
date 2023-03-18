<template>
    <div ref="mainBody" class="main-body">
        <img class="main-body" style="object-fit: cover;" :src="refBase64">
    </div>
</template>

<script setup lang="ts">
import { windowMessageOn } from '@mlmdflr/electron-modules/renderer/window';
import { ref } from 'vue';

let refBase64 = ref('')
windowMessageOn((_, base64) => {
    refBase64.value = `data:image/png;base64,${base64}`
}, 'switch-background')

</script>

<style lang="scss" scoped>
.main-body {
    width: 100%;
    height: 100%;
}
</style>