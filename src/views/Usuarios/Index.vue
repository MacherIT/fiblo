<template lang="pug">
  section.page-usuarios
    h1 Usuarios
    ul
      li
        router-link(:to="{path: '/usuarios/session' }") Login/Logout
      li
        router-link(:to="{path: '/usuarios' }") Main usuarios
    router-view
</template>

<script>
export default {
  name: 'Usuarios',
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
</style>
