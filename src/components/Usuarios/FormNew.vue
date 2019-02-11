<template lang="pug">
  .usuarios-form-new
    //- p Crear una cuenta
    form(@submit.prevent="crearCuenta", novalidate)
      .campo
        span Nombre
        input(
          type="text"
          placeholder="Nombre"
          v-validate="'required'"
          name="nombre"
          v-model="usuario.nombre")
      .campo
        span Email
        input(
          type="email"
          placeholder="Email"
          v-validate="'required|email'"
          name="email"
          v-model="usuario.email")
      .campo
        span Contraseña
        input(
          type="password"
          placeholder="Contraseña"
          v-validate="{required: true, confirmed: usuario.confirm_password}"
          name="password"
          v-model="usuario.password")
      .campo
        span Repetir contraseña
        input(
          type="password"
          placeholder="Repetir contraseña"
          v-validate="'required'"
          name="password_confirm"
          v-model="usuario.confirm_password")
      .subm
        .login
          router-link(to="/usuarios", tabindex="-1") ¿Ya tenés cuenta?
        .loading-input
          .loading(v-if="sent")
            font-awesome-icon(icon="circle-notch", spin)
          input(
            type="submit"
            value="Registrarme"
            :disabled="!validForm || sent")
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
  width: 100%;
  height: 100%;
  form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
    width: 80%;
    margin: auto;
    .campo {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
      margin-bottom: 30px;
      span {
        margin-bottom: 10px;
        color: #fff;
        text-transform: uppercase;
        font-family: $fontKeepCalmMedium;
        letter-spacing: 1px;
      }
      input {
        width: 100%;
        border: 0;
        border-radius: 5px;
        height: 30px;
        font-size: 90%;
        padding: 0 10px;
      }
    }
    .subm {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      .login {
        a {
          color: #fff;
          text-decoration: none;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-family: $fontKeepCalmMedium;
          letter-spacing: 1px;
          &:hover {
            text-decoration: underline;
          }
        }
      }
      .loading-input {
        display: flex;
        justify-content: center;
        align-items: center;
        .loading {
          margin-right: 10px;
          svg {
            color: $colorBeigeBase;
          }
        }
        input {
          height: 20px;
          padding: 0 30px;
          border-radius: 3px;
          border: 0;
          font-size: 90%;
          background-color: $colorGrisBase;
          text-transform: uppercase;
          color: #999;
          font-weight: bold;
          @include ease-transition;
          opacity: 0.8;
          cursor: pointer;
          &:not(:disabled) {
            color: $colorBeigeBase;
            opacity: 1;
            &:hover {
              @include sombra(0 0 5px 0 #000);
            }
          }
        }
      }
    }
  }
}
</style>
