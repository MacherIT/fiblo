<template lang="pug">
  .usuarios-form-new
    p Crear una cuenta
    form(@submit.prevent="crearCuenta", novalidate)
      input(
        type="text"
        placeholder="Nombre"
        v-validate="'required'"
        name="nombre"
        v-model="usuario.nombre")
      input(
        type="email"
        placeholder="Email"
        v-validate="'required|email'"
        name="email"
        v-model="usuario.email")
      input(
        type="password"
        placeholder="Contraseña"
        v-validate="{required: true, confirmed: usuario.confirm_password}"
        name="password"
        v-model="usuario.password")
      input(
        type="password"
        placeholder="Repetir contraseña"
        v-validate="'required'"
        name="password_confirm"
        v-model="usuario.confirm_password")
      input(
        type="submit"
        value="Crear cuenta!"
        :disabled="!validForm || sent")
      .loading(v-if="sent")
        font-awesome-icon(icon="circle-notch", spin)
</template>

<script>
import m from '@/mixins/mixins';

export default {
  name: 'UsuariosFormNew',
  mixins: [m.FormValidation],
  data() {
    return {
      sent: false,
      usuario: {
        nombre: '',
        email: '',
        password: '',
        confirm_password: '',
      },
    };
  },
  methods: {
    crearCuenta() {
      if (this.dirtyForm && this.validForm) {
        this.sent = true;
        this.$http({
          method: 'POST',
          url: '/api/usuarios',
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
.usuarios-form-new {
  @include default-form;
}
</style>
