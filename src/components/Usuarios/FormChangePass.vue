<template lang="pug">
  .usuarios-form-change-pass
    p Ingrese la nueva contraseña
    form(@submit.prevent="changePass", novalidate)
      input(
        type="password"
        placeholder="Nueva contraseña"
        v-validate="{required: true, confirmed: usuario.confirm_password}"
        name="password"
        v-model="usuario.password")
      input(
        type="password"
        placeholder="Repetir nueva contraseña"
        v-validate="'required'"
        name="password_confirm"
        v-model="usuario.confirm_password")
      input(
        type="submit"
        value="Cambiar contraseña"
        :disabled="!validForm || sent")
      .loading(v-if="sent")
        font-awesome-icon(icon="circle-notch", spin)
</template>

<script>
import m from '@/mixins/mixins';

export default {
  name: 'UsuariosFormNew',
  mixins: [m.FormValidation],
  props: {
    token: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      sent: false,
      usuario: {
        password: '',
        confirm_password: '',
      },
    };
  },
  methods: {
    changePass() {
      if (this.dirtyForm && this.validForm) {
        this.sent = true;
        this.$http({
          method: 'PUT',
          url: '/api/usuarios/ch_pass',
          body: this.usuario,
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
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
.usuarios-form-change-pass {
  @include default-form;
}
</style>
