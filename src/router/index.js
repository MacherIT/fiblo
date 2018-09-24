import Vue from 'vue';
import Router from 'vue-router';
import Usuarios from '@/views/Usuarios';
import Home from '@/views/Home';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/usuarios',
      name: 'Usuarios',
      component: Usuarios,
    },
  ],
});
