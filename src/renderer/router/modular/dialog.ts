import { RouteRecordRaw } from 'vue-router';

const Route: RouteRecordRaw[] = [
  {
    path: '/configure',
    name: 'Configure',
    component: () => import('@/renderer/views/dialog/configure/index.vue')
  }
];

export default Route;
