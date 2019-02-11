<template lang="pug">
  #root-app
    MainMenu
    .main-box
      router-view
</template>

<script>
import MainMenu from '@/components/General/MainMenu';

export default {
  name: 'App',
  components: {
    MainMenu,
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
  font-family: monospace;
  #root-app {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .main-box {
      width: 50vw;
      height: 70vh;
      background-color: $colorAzulBase;
      border-radius: 10px;
      @include sombra(0 0 5px 0 #000);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      overflow: hidden;
    }
  }
}
</style>
