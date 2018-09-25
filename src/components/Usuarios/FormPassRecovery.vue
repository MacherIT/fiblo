<template lang="pug">
  .usuarios-form-pass-recovery
    p Recuperar contraseña
    form(@submit.prevent="passRecovery", novalidate)
      input(
        type="email"
        placeholder="Email"
        v-validate="'required|email'"
        name="email"
        v-model="usuario.email")
      input(
        type="submit"
        value="Recuperar contraseña"
        :disabled="!validForm || sent")
      .loading(v-if="sent")
        font-awesome-icon(icon="circle-notch", spin)
</template>

<script>
import m from '@/mixins/mixins';

export default {
  name: 'UsuariosFormPassRecovery',
  mixins: [m.FormValidation],
  data() {
    return {
      sent: false,
      usuario: {
        email: '',
      },
    };
  },
  methods: {
    passRecovery() {
      if (this.dirtyForm && this.validForm) {
        this.sent = true;
        this.$http({
          method: 'POST',
          url: '/api/usuarios/mail_pass_check',
          body: this.usuario,
        }).then(
          ({ status }) => {
            this.sent = false;
            console.log(status);
          },
          error => {
            this.sent = false;
            console.error(error.data.token);
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
.usuarios-form-pass-recovery {
  @include default-form;
}
</style>
