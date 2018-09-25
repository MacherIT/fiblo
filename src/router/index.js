import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import Usuarios from '@/views/Usuarios';
import Proyectos from '@/views/Proyectos';
import NuevoProyecto from '@/components/Proyectos/Nuevo';
import ListaProyectos from '@/components/Proyectos/Lista';
import ShowProyecto from '@/components/Proyectos/Show';

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
      component: Proyectos,
      children: [
        {
          path: '',
          name: 'Proyectos',
          component: ListaProyectos,
        },
        {
          path: 'new',
          name: 'Nuevo proyecto',
          component: NuevoProyecto,
        },
        {
          path: ':id',
          name: 'Show proyecto',
          component: ShowProyecto,
        },
      ],
    },
    { path: '*', redirect: '/' },
  ],
});
