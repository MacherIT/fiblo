<template lang="pug">
  .proyectos-form-new
    p Crear un nuevo proyecto
    form(@submit.prevent="crearProyecto", novalidate)
      input(
        type="text"
        placeholder="Nombre"
        v-validate="'required'"
        name="nombre"
        v-model="proyecto.nombre")
      input(
        type="email"
        placeholder="Email"
        v-validate="'required|email'"
        name="email"
        v-model="proyecto.email")
      input(
        type="password"
        placeholder="Contraseña"
        v-validate="{required: true, confirmed: proyecto.confirm_password}"
        name="password"
        v-model="proyecto.password")
      input(
        type="password"
        placeholder="Repetir contraseña"
        v-validate="'required'"
        name="password_confirm"
        v-model="proyecto.confirm_password")
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
  name: 'ProyectosFormNew',
  mixins: [m.FormValidation],
  data() {
    return {
      sent: false,
      proyecto: {
        nombre: '',
        email: '',
        password: '',
        confirm_password: '',
      },
    };
  },
  methods: {
    crearProyecto() {
      if (this.dirtyForm && this.validForm) {
        this.sent = true;
        this.$http({
          method: 'POST',
          url: '/api/proyectos',
          body: this.proyecto,
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
.proyectos-form-new {
  @include default-form;
}
</style>
