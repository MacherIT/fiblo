import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import Usuarios from '@/views/Usuarios';
import Proyectos from '@/views/Proyectos';

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
    {
      path: '/proyectos',
      name: 'Proyectos',
      component: Proyectos,
    },
    { path: '*', redirect: '/' },
  ],
});
