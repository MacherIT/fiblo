<template lang="pug">
  ul
    li
      router-link(:to="{ name: 'Home', path: '/' }") Home
    li
      router-link(:to="{ name: 'Usuarios', path: 'usuarios' }") Usuarios
    li
      router-link(:to="{ name: 'Proyectos', path: 'proyectos' }") Proyectos
</template>

<script>
export default {
  name: 'MainMenu',
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
</style>
