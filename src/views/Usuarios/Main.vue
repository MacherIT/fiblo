<template lang="pug">
  section.page-index-usuarios
    UsuariosFormNew
    UsuariosFormPassRecovery
    UsuariosFormChangePass(:token="token")
</template>

<script>
import { mapState } from 'vuex';

import UsuariosFormNew from '@/components/Usuarios/FormNew';
import UsuariosFormPassRecovery from '@/components/Usuarios/FormPassRecovery';
import UsuariosFormChangePass from '@/components/Usuarios/FormChangePass';

export default {
  name: 'Usuarios',
  data() {
    return {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIsImV4cCI6MTUzNzY0NzA3MTQ2MSwiaWF0IjoxNTM3NTYwNjcxfQ.fpHzFH5UFR5VhA8rtvWfSaWY30fA5W0FfBnEN5HmBbw',
    };
  },
  computed: {
    ...mapState('usuarios', ['loggedIn']),
  },
  components: {
    UsuariosFormNew,
    UsuariosFormPassRecovery,
    UsuariosFormChangePass,
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
</style>
