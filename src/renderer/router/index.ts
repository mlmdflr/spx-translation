import { createRouter, createWebHashHistory } from 'vue-router';
import customize from '@/renderer/store/customize';
import { windowUpdate } from '@/renderer/common/window';

import pageRoute from '@/renderer/router/modular/page';
import dialogRoute from '@/renderer/router/modular/dialog';

const Router = createRouter({
  history: createWebHashHistory(),
  routes: [...pageRoute, ...dialogRoute]
});

Router.beforeEach((to, from) => {
  if (to.path !== (customize.get() as Customize_Route).route) {
    //更新窗口路由
    (customize.get() as Customize_Route).route = to.path;
    windowUpdate();
  }
});

export default Router;