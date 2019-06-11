import Vue from "vue";
import Router from "vue-router";
import UsuariosSignUp from "@/components/Usuarios/FormNew";
import LoginProfile from "@/views/Usuarios/LoginProfile";
import Cnv from "@/views/Admin/CNV";
import NuevoProyecto from "@/views/Proyectos/Nuevo";
import ListaProyectos from "@/views/Proyectos/Lista";
import MisProyectos from "@/views/Proyectos/Mis";
import ShowProyecto from "@/views/Proyectos/Show";
import MisParticipaciones from "@/views/Usuarios/MisParticipaciones";

import store from "@/store/index";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: ListaProyectos,
      meta: {
        requiresLogin: true
      }
    },
    // {
    //   path: '/usuarios',
    //   component: Usuarios,
    //   children: [
    {
      path: "/usuarios",
      name: "Login",
      component: LoginProfile
    },
    {
      path: "/usuarios/crear-cuenta",
      name: "Usuarios",
      component: UsuariosSignUp
    },
    //   ],
    // },
    // {
    //   path: '/wallet',
    //   name: 'Wallet',
    //   component: Wallet,
    // },
    {
      path: "/mis-participaciones",
      name: "Mis participaciones",
      component: MisParticipaciones,
      meta: {
        requiresLogin: true
      }
    },
    {
      path: "/cnv",
      component: Cnv,
      meta: {
        requiresLogin: true
      }
    },
    {
      path: "/mis-proyectos",
      name: "Mis proyectos",
      component: MisProyectos,
      meta: {
        requiresLogin: true
      }
    },
    {
      path: "/proyectos/new",
      name: "Nuevo proyecto",
      component: NuevoProyecto,
      meta: {
        requiresLogin: true
      }
    },
    {
      path: "/proyectos/:id",
      name: "Show proyecto",
      component: ShowProyecto,
      meta: {
        requiresLogin: true
      }
    },
    { path: "*", redirect: "/" }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresLogin)) {
    if (!store.state.usuarios.loggedIn) {
      next({
        path: "/usuarios"
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
