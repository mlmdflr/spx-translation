import { createApp } from 'vue';
import customize from '@/renderer/store/customize';
import { windowLoad } from '@/renderer/common/window';
import App from '@/renderer/views/app.vue';
import router from '@/renderer/router';
import Head from "@/renderer/views/components/head/index.vue";
import 'element-plus/dist/index.css'

windowLoad(async (_, args) => {
  router.addRoute({
    path: '/',
    redirect: (args as Customize_Route).route as string
  });
  customize.set(args);
  document.body.setAttribute('platform', window.environment.platform);
  createApp(App).component("Head", Head).use(router).mount('#app');
}); 
