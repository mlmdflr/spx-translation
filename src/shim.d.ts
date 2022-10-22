declare module '*.vue' {
  import { defineComponent } from 'vue';
  import { Customize_Route } from '@mlmdflr/electron-modules/types';

  const component: ReturnType<typeof defineComponent>;
  export default component;

  global {
    interface Window {
      customize: Customize_Route
    }
  }
}
declare module '*.svg'
declare module '*.png'
declare module '*.ico'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'