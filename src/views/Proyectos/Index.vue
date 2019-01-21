<template lang="pug">
  section.page-proyectos
    h1 Proyectos
    ul
      li
        router-link(:to="{path: '/proyectos' }") Lista proyectos
      li
        router-link(:to="{path: '/proyectos/new' }") Nuevo proyecto
    router-view
</template>

<script>
export default {
  name: 'Proyectos',
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
</style>
