import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/components/Index';
import Settings from '@/components/Settings';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    }
  ],
});
