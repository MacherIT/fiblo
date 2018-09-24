<template lang="pug">
  div(id="root-app")
    ul
      li
        router-link(:to="{ name: 'Home', path: '/' }") Home
      li
        router-link(:to="{ name: 'Usuarios', path: 'usuarios' }") Usuarios
    router-view
</template>

<script>
export default {
  name: 'App',
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
    }
    input {
      @include ease-transition();
    }
  }
}
</style>
