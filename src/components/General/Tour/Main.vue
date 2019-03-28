<template lang="pug">
  .tour.fadeIn
    svg(
      width='100%'
      height='100%')
      rect(
        x='0'
        y='0'
        width='100%'
        height='100%'
        mask='url(#hole)')
      mask#hole
        rect(
          x='0'
          y='0'
          width='100%'
          height='100%'
          fill='#fffc')
        rect#diff-active-user.fadeIn(
          v-show="etapa === 0"
          fill='black')
        rect#diff-menu.fadeIn(
          v-show="etapa === 1"
          fill='black')
        rect#diff-main.fadeIn(
          v-show="etapa === 2"
          fill='black')
        rect#diff-login-form.fadeIn(
          v-show="etapa >= 3 && !loggedIn"
          fill='black')
    .textos(
      :class="'etapa' + etapa")
      .texto.etapa0(
        v-show="etapa === 0")
        span Este es el indicador de usuario
      .texto.etapa1(
        v-show="etapa === 1")
        span Este es el menú principal
      .texto.etapa2(
        v-show="etapa === 2")
        span Esta es la interfaz principal de la aplicación
      .texto.etapa3(
        v-show="etapa === 3 && !loggedIn")
        p
          | USUARIOS DE PRUEBA
          |
          | Para probar la plataforma con usuarios de prueba, iniciá sesión con los siguientes datos:
          |
          strong CREADOR DE PROYECTOS:
          em Email: creador@fiblo.com
          em Contraseña: 123456
          |
          strong ACCIONISTA1:
          em Email: accionista1@fiblo.com
          em Contraseña: 123456
          |
          strong ACCIONISTA2:
          em Email: accionista2@fiblo.com
          em Contraseña: 123456
      .texto.etapa4(
        v-show="etapa === 4 && !loggedIn")
        p
          | BILLETERAS DE PRUEBA
          |
          | Para realizar transacciones con billeteras de prueba, importar las siguientes claves privadas:
          |
          |
          a(href="https://miethereum.com/guias/metamask/#toc8", target="_blank") Guia para importar
          |
          |
          strong CREADOR DE PROYECTOS / FIBLO / CNV:
          em 3db0975119aa36924a7346f37fe7b44c7f1496b33436f099beb1097e438759c8
          |
          strong ACCIONISTA1:
          em ef7ff7b1380476a7b5a8a7b5b3caae166eb7c115492140fa966c4ddebe69871f
          |
          strong ACCIONISTA2:
          em f8070f8bdc76efd98a95bd4b6122e87a1a0d0dad3e96e420ec1dcc9a10f8d67d
    button.boton.saltar(
      @click="saltar")
      span Saltar
    button.boton.anterior(
      :disabled="etapa <= 0"
      @click="setAnterior")
      span Anterior
    button.boton.siguiente(
      @click="setSiguiente")
      span {{etapa < 4 ? 'Siguiente' : 'Terminar'}}
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      etapa: 0,
    };
  },
  computed: {
    ...mapState('usuarios', ['loggedIn']),
  },
  mounted() {
    this.setDiffs();
    window.addEventListener('resize', this.setDiffs);
  },
  methods: {
    ...mapActions('tour', ['finishMain']),
    saltar() {
      this.finishMain();
    },
    setSiguiente() {
      const end = this.loggedIn ? 2 : 4;
      if (this.etapa < end) {
        this.etapa += 1;
      } else {
        this.finishMain();
      }
    },
    setAnterior() {
      if (this.etapa > 0) {
        this.etapa -= 1;
      }
    },
    setDiffs() {
      const diffActiveUser = document.querySelector('#root-app .tour svg #diff-active-user');
      const activeUser = document.querySelector('#root-app .active-user').getBoundingClientRect();
      if (diffActiveUser) {
        diffActiveUser.setAttribute('x', activeUser.x - 10);
        diffActiveUser.setAttribute('y', 0);
        diffActiveUser.setAttribute('width', activeUser.width + 20);
        diffActiveUser.setAttribute('height', activeUser.height + 10);
      }

      const diffMenu = document.querySelector('#root-app .tour svg #diff-menu');
      const menu = document.querySelector('#root-app .main-menu').getBoundingClientRect();
      if (diffMenu) {
        diffMenu.setAttribute('x', 0);
        diffMenu.setAttribute('y', menu.y - 10);
        diffMenu.setAttribute('width', menu.width + 10);
        diffMenu.setAttribute('height', menu.height + 20);
      }

      const diffMain = document.querySelector('#root-app .tour svg #diff-main');
      const main = document.querySelector('#root-app .main-box').getBoundingClientRect();
      if (diffMain) {
        diffMain.setAttribute('x', main.x - 10);
        diffMain.setAttribute('y', main.y - 55);
        diffMain.setAttribute('width', main.width + 20);
        diffMain.setAttribute('height', main.height + 65);
      }

      if (!this.loggedIn) {
        const diffLoginForm = document.querySelector('#root-app .tour svg #diff-login-form');
        const loginForm = document
          .querySelector('#root-app .main-box .login-logout .login form')
          .getBoundingClientRect();
        if (diffLoginForm) {
          diffLoginForm.setAttribute('x', loginForm.x - 10);
          diffLoginForm.setAttribute('y', loginForm.y - 10);
          diffLoginForm.setAttribute('width', loginForm.width + 20);
          diffLoginForm.setAttribute('height', loginForm.height + 20);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
.tour {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  .textos {
    position: absolute;
    width: 200px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $colorAzulBase;
    border-radius: 5px;
    @include sombra(0 0 2px 0 #000);
    &.etapa0 {
      left: auto;
      top: 70px;
    }
    &.etapa1 {
      left: 110px;
      top: auto;
    }
    &.etapa2 {
      left: auto;
      right: 25px;
      top: auto;
    }
    &.etapa3,
    &.etapa4 {
      left: 21vw;
      top: auto;
      background-color: $colorPaletaC5;
      width: 27vw;
      height: auto;
      border: 4px solid #fff;
      @include sombra(0 0 15px 0 #000);
      .texto {
        text-align: left;
        width: 100%;
        padding: 20px;
        p {
          word-break: break-all;
          em {
            display: block;
          }
          strong {
            display: block;
            margin-top: 15px;
          }
          a {
            color: #99f;
          }
        }
      }
    }
    .texto {
      text-align: center;
      width: 80%;
      margin: auto;
      span,
      p {
        white-space: pre-line;
        font-family: $fontUbuntuRegular;
        color: #fff;
      }
    }
  }
  button.boton {
    position: absolute;
    background-color: $colorAzulBase;
    bottom: 20px;
    @include sombra(0 0 3px 0 #000);
    border-radius: 5px;
    border: 0;
    @include ease-transition;
    height: 40px;
    padding: 0 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    @include grayscale(0.8);
    outline: 0;
    &.saltar {
      left: 20px;
    }
    &.anterior {
      right: 150px;
    }
    &.siguiente {
      right: 20px;
    }
    &:not(:disabled) {
      @include grayscale(0);
      cursor: pointer;
      &:hover {
        background-color: $colorAzulOscuro;
      }
    }
    span {
      font-family: $fontUbuntuLight;
      color: #fff;
      text-transform: uppercase;
      font-size: 90%;
    }
  }
}
</style>
