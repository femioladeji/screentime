import Vue from 'vue';
import Router from 'vue-router';
import Add from '@/components/Add';
import Index from '@/components/Index';
import Settings from '@/components/Settings';
import Advanced from '@/components/Advanced';
import AddOrRemove from '@/components/AddOrRemove';

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
    },
    {
      path: '/advanced/:name',
      name: 'Advanced',
      component: Advanced
    }
  ]
});
