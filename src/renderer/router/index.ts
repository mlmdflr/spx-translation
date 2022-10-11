import { createRouter, createWebHashHistory } from 'vue-router';
import { customizeUpdate } from '@mlmdflr/electron-modules/renderer/base';
import pageRoute from '@/renderer/router/modular/page';
import dialogRoute from '@/renderer/router/modular/dialog';
import { Customize_Route } from "@mlmdflr/electron-modules/types";


const Router = createRouter({
  history: createWebHashHistory(),
  routes: [...pageRoute, ...dialogRoute]
});

Router.beforeEach((to, from) => {
  if (to.path !== (window.customize as Customize_Route).route) {
    //更新窗口路由
    (window.customize as Customize_Route).route = to.path;
    customizeUpdate();
  }
});

export default Router;