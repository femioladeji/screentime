import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/components/Index';
import Settings from '@/components/Settings';
import AddOrRemove from '@/components/AddOrRemove';
import Add from '@/components/Add';

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
    },
    {
      path: '/addremove',
      name: 'AddOrRemove',
      component: AddOrRemove
    },
    {
      path: '/add',
      name: 'Add',
      component: Add
    }
  ]
});
