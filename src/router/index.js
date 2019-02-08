import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
// import Usuarios from '@/views/Usuarios/Index';
// import Wallet from '@/views/Wallet/Index';
import UsuariosSignUp from '@/components/Usuarios/FormNew';
import LoginLogout from '@/views/Usuarios/LoginLogout';
import Proyectos from '@/views/Proyectos/Index';
import Cnv from '@/views/Proyectos/CNV';
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
    // {
    //   path: '/usuarios',
    //   component: Usuarios,
    //   children: [
    {
      path: '/usuarios',
      name: 'Login',
      component: LoginLogout,
    },
    {
      path: '/usuarios/crear-cuenta',
      name: 'Usuarios',
      component: UsuariosSignUp,
    },
    //   ],
    // },
    // {
    //   path: '/wallet',
    //   name: 'Wallet',
    //   component: Wallet,
    // },
    {
      path: '/cnv',
      component: Cnv,
      meta: {
        requiresLogin: true,
      },
    },
    {
      path: '/proyectos',
      name: 'Proyectos',
      component: ListaProyectos,
    },
    {
      path: '/proyectos/new',
      name: 'Nuevo proyecto',
      component: NuevoProyecto,
    },
    {
      path: '/proyectos/:id',
      name: 'Show proyecto',
      component: ShowProyecto,
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
