<template lang="pug">
  .usuarios-form-login
    p Iniciar sesión
    form(@submit.prevent="iniciarSesion", novalidate)
      input(
        type="email"
        placeholder="Email"
        v-validate="'required|email'"
        name="email"
        v-model="usuario.email")
      input(
        type="password"
        placeholder="Contraseña"
        v-validate="'required'"
        name="password"
        v-model="usuario.password")
      input(
        type="submit"
        value="Iniciar sesión"
        :disabled="!validForm || sent")
      .loading(v-if="sent")
        font-awesome-icon(icon="circle-notch", spin)
</template>

<script>
import m from '@/mixins/mixins';

export default {
  name: 'UsuariosFormLogin',
  mixins: [m.FormValidation],
  data() {
    return {
      sent: false,
      usuario: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    iniciarSesion() {
      if (this.dirtyForm && this.validForm) {
        this.sent = true;
        this.$http({
          method: 'POST',
          url: '/api/usuarios/login',
          body: this.usuario,
        }).then(
          ({ status }) => {
            this.sent = false;
            console.log(status);
          },
          error => {
            this.sent = false;
            console.error(error);
          },
        );
      } else {
        this.$validator.validateAll();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/config';
.usuarios-form-login {
  @include default-form;
}
</style>
