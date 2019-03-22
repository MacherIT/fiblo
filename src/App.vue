<template lang="pug">
  #root-app
    router-link.active-user(
      to="/usuarios"
      v-if="usuario")
      .holder
        span {{usuario.email}}
    MainMenu
    Flash
    MagicButton(v-if="loggedIn")
    .page-title
      .holder
        span {{pageTitle}}
    .main-box
      router-view
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import MainMenu from '@/components/General/MainMenu';
import Flash from '@/components/General/Flash';
import MagicButton from '@/components/MagicButton';

export default {
  name: 'App',
  components: {
    MainMenu,
    Flash,
    MagicButton,
  },
  computed: {
    ...mapState('usuarios', ['loggedIn']),
    ...mapState('general', ['pageTitle']),
    ...mapGetters('usuarios', ['usuario']),
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
      text-decoration: none;
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
  }
}
</style>
