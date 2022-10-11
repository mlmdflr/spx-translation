import { createApp } from 'vue';
import { LoadRoute } from '@mlmdflr/electron-modules/renderer/base';
import App from '@/renderer/views/app.vue';
import router from '@/renderer/router';
import Head from "@/renderer/views/components/head/index.vue";
import 'element-plus/dist/index.css'
import "@/renderer/views/scss/element/index.scss";


LoadRoute((_, args) => {
  router.addRoute({
    path: '/',
    redirect: args.route
  });
  window.customize = args
  document.body.setAttribute('platform', window.environment.platform);
  createApp(App).component("Head", Head).use(router).mount('#app');
}); 


