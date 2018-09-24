<template lang="pug">
  div(id="root-app")
    MainMenu
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

body {
  margin: 0;
  padding: 0;
  #root-app {
    display: block;
    * {
      font-size: 16px;
      font-family: monospace;
      box-sizing: border-box;
      max-width: 100% !important;
    }
    input {
      @include ease-transition();
    }
  }
}
</style>
