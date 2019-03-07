<template lang="pug">
  .login
    .presentacion
      PresentacionFiblo
    form(@submit.prevent="iniciarSesion", novalidate)
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
          v-validate="'required'"
          name="password"
          v-model="usuario.password")
      .subm
        .sign-up
          router-link(to="/usuarios/crear-cuenta", tabindex="-1") ¿Todavía no tenés cuenta?
        .loading-input
          .loading(v-if="sent")
            font-awesome-icon(icon="circle-notch", spin)
          input(
            type="submit"
            value="Acceder"
            :disabled="!validForm || sent")
</template>

<script>
import { mapActions } from 'vuex';

import PresentacionFiblo from '@/components/General/PresentacionFiblo';

export default {
  name: 'UsuariosFormLogin',
  components: {
    PresentacionFiblo,
  },
  data() {
    return {
      sent: false,
      usuario: {
        email: '',
        password: '',
      },
    };
  },
  mounted() {
    this.setPageTitle('Login');
  },
  methods: {
    ...mapActions('general', ['setPageTitle']),
    ...mapActions('usuarios', ['login']),
    iniciarSesion() {
      if (this.dirtyForm && this.validForm) {
        this.sent = true;
        this.login({ email: this.usuario.email, password: this.usuario.password }).then(() => {
          this.sent = false;
        });
      } else {
        this.$validator.validateAll();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/config';
.login {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .presentacion {
    width: 50%;
    height: 100%;
  }
  form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
    width: 50%;
    margin: auto;
    padding: 0 30px;
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
      .sign-up {
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
