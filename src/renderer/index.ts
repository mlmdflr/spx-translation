import { createApp } from 'vue';
import customize from '@/renderer/store/customize';
import { windowLoad } from '@/renderer/common/window';
import { domPropertyLoad } from '@/renderer/common/general/dom';
import App from '@/renderer/views/app.vue';
import router from '@/renderer/router';
import 'element-plus/dist/index.css'

windowLoad((_, args) => {
  router.addRoute({
    path: '/',
    redirect: args.route
  });
  customize.set(args);
  domPropertyLoad();
  createApp(App).use(router).mount('#app');
}); 
