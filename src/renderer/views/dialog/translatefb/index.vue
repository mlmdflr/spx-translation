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
    ElNotification,
    ElMessage,
    ElSelect,
    ElOption
} from 'element-plus';

import { langs } from "@/main/xps/google-translate-api/languages";


const objLangs: {
    [key: string]: string
} = langs

let lang_o = ref('auto')

let lang_g = ref('zh-CN')

let ell = ElLoading.service({ fullscreen: false, background: "#222", text: '识别中...' })

let o = ref('')

let g = ref('')



function langChange() {
    console.log(lang_o.value, lang_g.value);
    ElMessage.success(`翻译中...`)
    window.ipc.invoke('translate-text', { o: o.value, lang_o: lang_o.value, lang_g: lang_g.value })
        .then(res => {
            console.log(res);
            
            g.value = res.text
        })
        .catch(err => {
            ElNotification({
                position: 'top-right',
                title: 'Error',
                message: err,
                type: 'error',
            })
        })
}

windowMessageOn('tesseract:ok:' + customize.get().id, (_, data) => {
    ell.close()
    console.log('tesseract', data);
    o.value = data
})

windowMessageOn('translate:ok:' + customize.get().id, (_, data) => {
    ell.close();
    console.log('translate', data);
    g.value = data.g
    o.value = data.o
})


windowMessageOn('translate:err:' + customize.get().id, (_, err) => {
    ell.close();
    ElNotification({
        position: 'top-right',
        title: 'Error',
        message: err,
        type: 'error',
    })
})

onMounted(() => windowShow())

</script>

<style lang='scss' scoped>
@import "./scss/index";
</style>

<template>
    <div class="container">
        <el-container>
            <el-header height="25px">
                <Head :event-show="false" />
            </el-header>
            <el-main>
                <div>
                    <ElSelect
                        style="float: right;"
                        v-model="lang_o"
                        @change="langChange"
                        size="small"
                    >
                        <ElOption
                            v-for="item in Object.keys(objLangs)"
                            :key="item"
                            :label="objLangs[item]"
                            :value="item"
                        />
                    </ElSelect>
                    <span class="color">原文:</span>
                    <el-input
                        input-style="background: #eeeeee;"
                        v-model="o"
                        :rows="7"
                        resize="none"
                        type="textarea"
                    />
                </div>&nbsp;
                <div>
                    <ElSelect
                        style="float: right;"
                        v-model="lang_g"
                        @change="langChange"
                        size="small"
                    >
                        <ElOption
                            v-for="item in Object.keys(objLangs)"
                            :key="item"
                            :label="objLangs[item]"
                            :value="item"
                        />
                    </ElSelect>
                    <span class="color">翻译:</span>
                    <el-input
                        input-style="background: #eeeeee;"
                        v-model="g"
                        :rows="7"
                        resize="none"
                        type="textarea"
                    />
                </div>
            </el-main>
            <el-footer>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-button type="primary" @click="langChange()" class="color">翻译</el-button>
                    </el-col>
                    <el-col :span="6" :offset="6">
                        <el-button type="info" @click="windowClose()" class="color">关闭</el-button>
                    </el-col>
                </el-row>
            </el-footer>
        </el-container>
    </div>
</template>