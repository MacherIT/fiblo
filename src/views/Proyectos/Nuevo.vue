<template lang="pug">
  .proyectos-nuevo
    ProyectosFormNew(v-if="loggedIn")
    div(v-if="!loggedIn")
      span Para poder añadir proyectos, inicie sesión
      UsuariosFormLogin
</template>

<script>
import { mapState } from 'vuex';

import ProyectosFormNew from '@/components/Proyectos/FormNew';
import UsuariosFormLogin from '@/components/Usuarios/FormLogin';

export default {
  name: 'NuevoProyecto',
  components: {
    ProyectosFormNew,
    UsuariosFormLogin,
  },
  computed: {
    ...mapState('usuarios', ['loggedIn']),
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
.proyectos-nuevo {
  width: 100%;
  height: 100%;
}
</style>
