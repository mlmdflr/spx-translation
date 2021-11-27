import { RouteRecordRaw } from 'vue-router';

const Route: RouteRecordRaw[] = [
  {
    path: '/about',
    name: 'About',
    component: () => import('@/renderer/views/pages/about/index.vue')
  }
];

export default Route;
