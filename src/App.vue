<template lang="pug">
  #root-app
    TourFirstRun(v-if="!tour.firstRun")
    TourMain(v-if="tour.firstRun && !tour.main")
    .active-user
      .holder
        span {{usuario ? usuario.email : 'Usuario'}}
    MainMenu
    Flash
    MagicButton(v-if="loggedIn")
    .page-title
      .holder
        span {{pageTitle}}
    .main-box
      router-view
    .reset-tour(@click="reiniciarTour")
      .about
        span Reiniciar tutorial
      font-awesome-icon.undo(icon="undo")
      font-awesome-icon.info(icon="info")
    .web3-not-ready(v-if="!web3Ready")
      span Para poder utilizar la plataforma tenés que tener instalada la extensión 'MetaMask' y tener al menos 1 cuenta habilitada.
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

import fiblo from '@/services/fiblo';

import TourFirstRun from '@/components/General/Tour/FirstRun';
import TourMain from '@/components/General/Tour/Main';

import MainMenu from '@/components/General/MainMenu';
import Flash from '@/components/General/Flash';
import MagicButton from '@/components/MagicButton';

export default {
  name: 'App',
  data() {
    return {
      web3Ready: true,
    };
  },
  components: {
    TourFirstRun,
    TourMain,
    MainMenu,
    Flash,
    MagicButton,
  },
  computed: {
    ...mapState('usuarios', ['loggedIn']),
    ...mapState('general', ['pageTitle']),
    ...mapState('tour', ['tour']),
    ...mapGetters('usuarios', ['usuario']),
  },
  mounted() {
    setTimeout(() => {
      const self = this;
      fiblo.isMetaMaskInstalled(ready => {
        self.web3Ready = ready;
      });
    }, 3000);
  },
  methods: {
    ...mapActions('tour', ['resetTour']),
    reiniciarTour() {
      this.$router.replace('/');
      this.resetTour();
    },
  },
};
</script>

<style lang="scss">
@import '~Styles/config';

@font-face {
  font-family: 'KeepCalm-Medium';
  src: url('./assets/fonts/KeepCalm-Medium.ttf');
}
@font-face {
  font-family: 'Ubuntu-Light';
  src: url('./assets/fonts/Ubuntu-Light.ttf');
}
@font-face {
  font-family: 'Ubuntu-Regular';
  src: url('./assets/fonts/Ubuntu-Regular.ttf');
}

* {
  box-sizing: border-box !important;
  button::-moz-focus-inner,
  a::-moz-focus-inner {
    border: 0;
  }
}

body {
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url('./assets/images/fondo.jpg');
  // background-color: $colorBeigeBase;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100vh;
  font-size: 14px;
  font-family: $fontUbuntuRegular, monospace;
  #root-app {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .active-user {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 200px;
      position: fixed;
      top: 0;
      .holder {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 40px;
        @include sombra(0 1px 6px 0 #555);
        background-color: $colorGrisBase;
        border-radius: 0 0 10px 10px;
        z-index: 5;
        position: relative;
        span {
          color: $colorAzulBase;
          font-family: $fontKeepCalmMedium;
          text-transform: uppercase;
          font-size: 85%;
        }
      }
    }
    .page-title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 60vw;
      .holder {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 30%;
        height: 45px;
        // margin-bottom: 10px;
        @include sombra(0 -1px 6px 0 #555);
        background-color: $colorGrisBase;
        border-radius: 10px 10px 0 0;
        z-index: 5;
        position: relative;
        span {
          color: $colorAzulBase;
          font-family: $fontKeepCalmMedium;
          text-transform: uppercase;
          font-size: 90%;
          margin-top: 3px;
        }
      }
    }
    .main-box {
      width: 60vw;
      height: 70vh;
      background-color: $colorAzulBase;
      border-radius: 0 10px 10px 10px;
      @include sombra(0 0 5px 0 #555);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      overflow: hidden;
    }
    .reset-tour {
      position: fixed;
      bottom: 30px;
      right: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      @include minmaxwh(50px);
      background-color: #222;
      border-radius: 50%;
      cursor: pointer;
      @include ease-transition;
      @include sombra(0 0 2px 0 #000);
      &:hover {
        background-color: #444;
      }
      &:hover > .about {
        opacity: 1;
        z-index: 10;
      }
      .about {
        position: absolute;
        top: -50px;
        left: -100px;
        width: 150px;
        height: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(#000, 0.5);
        z-index: -1;
        opacity: 0;
        @include ease-transition(300ms);
        span {
          color: #fff;
        }
      }
      svg {
        color: #fff;
        margin: 0 3px;
      }
    }
    .web3-not-ready {
      position: fixed;
      bottom: 0;
      background-color: $colorPaletaC7;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 0 15px;
      height: 40px;
      border-radius: 10px 10px 0 0;
      @include sombra(0 0 3px 0 #000);
      span {
        color: #fff;
      }
    }
  }
}
</style>
