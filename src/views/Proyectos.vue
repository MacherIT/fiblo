<template lang="pug">
  section.page-proyectos
    h1 Proyectos
    ProyectosFormNew
</template>

<script>
import ProyectosFormNew from '@/components/Proyectos/FormNew';

export default {
  name: 'Proyectos',
  components: {
    ProyectosFormNew,
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
</style>
