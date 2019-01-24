import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import Usuarios from '@/views/Usuarios/Index';
// import Wallet from '@/views/Wallet/Index';
import UsuariosMain from '@/views/Usuarios/Main';
import LoginLogout from '@/views/Usuarios/LoginLogout';
import Proyectos from '@/views/Proyectos/Index';
import NuevoProyecto from '@/views/Proyectos/Nuevo';
import ListaProyectos from '@/views/Proyectos/Lista';
import ShowProyecto from '@/views/Proyectos/Show';

import store from '@/store/index';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/usuarios',
      component: Usuarios,
      children: [
        {
          path: '',
          name: 'Usuarios',
          component: UsuariosMain,
        },
        {
          path: 'session',
          name: 'Login',
          component: LoginLogout,
        },
      ],
    },
    // {
    //   path: '/wallet',
    //   name: 'Wallet',
    //   component: Wallet,
    // },
    {
      path: '/proyectos',
      component: Proyectos,
      meta: {
        requiresLogin: true,
      },
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

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresLogin)) {
    if (!store.state.usuarios.loggedIn) {
      next({
        path: '/usuarios/session',
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
