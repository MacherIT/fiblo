<template lang="pug">
  .login-profile
    //- h1 Login/Profile
    UsuariosFormLogin(v-if="!loggedIn")
    UsuariosButtonProfile(v-if="loggedIn")
</template>

<script>
import { mapState } from 'vuex';

import UsuariosFormLogin from '@/components/Usuarios/FormLogin';
import UsuariosButtonProfile from '@/components/Usuarios/Profile';

export default {
  name: 'Usuarios',
  computed: {
    ...mapState('usuarios', ['loggedIn']),
  },
  components: {
    UsuariosFormLogin,
    UsuariosButtonProfile,
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
.login-profile {
  width: 100%;
  height: 100%;
}
</style>
