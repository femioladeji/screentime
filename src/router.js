import Vue from 'vue';
import Router from 'vue-router';
import Add from '@/components/Add';
import Apps from '@/components/Apps';
import Index from '@/components/Index';
import Settings from '@/components/Settings';
import Advanced from '@/components/Advanced';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'Index',
      component: Index
    },
    {
      path: '/app',
      name: 'apps',
      component: Apps
    },
    {
      path: '/add',
      name: 'Add',
      component: Add
    },
    {
      path: '/app/:name',
      name: 'Advanced',
      component: Advanced
    },
    {
      path: '/settings',
      component: Settings
    }
  ]
});
