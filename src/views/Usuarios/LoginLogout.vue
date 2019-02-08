<template lang="pug">
  .login-logout
    //- h1 Login/Logout
    UsuariosFormLogin(v-if="!loggedIn")
    UsuariosButtonLogout(v-if="loggedIn")
</template>

<script>
import { mapState } from 'vuex';

import UsuariosFormLogin from '@/components/Usuarios/FormLogin';
import UsuariosButtonLogout from '@/components/Usuarios/ButtonLogout';

export default {
  name: 'Usuarios',
  computed: {
    ...mapState('usuarios', ['loggedIn']),
  },
  components: {
    UsuariosFormLogin,
    UsuariosButtonLogout,
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
.login-logout {
  width: 100%;
  height: 100%;
}
</style>
