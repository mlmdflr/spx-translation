<script setup lang="ts">
import { onMounted, ref } from 'vue';

import customize from '@/renderer/store/customize';

import { windowClose, windowShow, windowMessageOn } from '@/renderer/common/window';

import Head from '@/renderer/views/components/head/index.vue';
import {
    ElButton,
    ElRow,
    ElCol,
    ElInput,
    ElHeader,
    ElContainer,
    ElFooter,
    ElMain,
    ElLoading,
    ElNotification
} from 'element-plus';


let ell = ElLoading.service({ fullscreen: true, background: "#222", text: '识别中...' })

let o = ref('')

let g = ref('')


windowMessageOn('tesseract:ok:' + customize.get().id, (_, data) => {
    console.log('tesseract', data);
    o.value = data
})

windowMessageOn('translate:ok:' + customize.get().id, (_, data) => {
    console.log('translate', data);
    g.value = data
    ell.close()
})


windowMessageOn('translate:err:' + customize.get().id, (_, err) => {
    ell.close()
    ElNotification({
        position: 'top-right',
        title: 'Error',
        message: err,
        type: 'error',
    })
    setTimeout(() => {
        windowClose()
    }, 4000);
})

onMounted(() => windowShow())

</script>

<style lang='scss' scoped>
@import "./scss/index";
</style>

<template>
    <div>
        <el-container>
            <el-header height="25px">
                <Head :event-show="false" />
            </el-header>
            <el-main>
                <span class="color">原文:</span>
                <el-input
                    input-style=" color: white; background: rgb(34, 34, 34);"
                    v-model="o"
                    :rows="7"
                    resize="none"
                    type="textarea"
                />
                <span class="color">翻译:</span>
                <el-input
                    input-style=" color: white; background: rgb(34, 34, 34);"
                    v-model="g"
                    :rows="7"
                    resize="none"
                    type="textarea"
                />
            </el-main>
            <el-footer>
                <el-row :gutter="30">
                    <el-col :span="12">&nbsp;</el-col>
                    <el-col :span="6" :offset="6">
                        <el-button @click="windowClose()" class="color">关闭</el-button>
                    </el-col>
                </el-row>
            </el-footer>
        </el-container>
    </div>
</template>