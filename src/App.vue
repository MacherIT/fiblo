<template lang="pug">
  div(id="root-app")
    UsuariosFormNew
    UsuariosFormPassRecovery
    UsuariosFormChangePass(:token="token")
    UsuariosFormLogin
    router-view
</template>

<script>
import UsuariosFormNew from './components/Usuarios/FormNew';
import UsuariosFormPassRecovery from './components/Usuarios/FormPassRecovery';
import UsuariosFormChangePass from './components/Usuarios/FormChangePass';
import UsuariosFormLogin from './components/Usuarios/FormLogin';

export default {
  name: 'App',
  data() {
    return {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIsImV4cCI6MTUzNzY0NzA3MTQ2MSwiaWF0IjoxNTM3NTYwNjcxfQ.fpHzFH5UFR5VhA8rtvWfSaWY30fA5W0FfBnEN5HmBbw',
    };
  },
  components: {
    UsuariosFormNew,
    UsuariosFormPassRecovery,
    UsuariosFormChangePass,
    UsuariosFormLogin,
  },
};
</script>

<style lang="scss">
@import '~Styles/config';

body {
  margin: 0;
  padding: 0;
  #root-app {
    display: block;
    * {
      font-size: 16px;
      font-family: monospace;
    }
    input {
      @include ease-transition();
    }
  }
}
</style>
