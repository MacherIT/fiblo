<template lang="pug">
  section.page-usuarios
    h1 Usuarios
    div(v-if="loggedIn")
      span {{usuario.email}}
    ul
      li
        router-link(:to="{path: '/usuarios/session' }") Login/Logout
      li
        router-link(:to="{path: '/usuarios' }") Main usuarios
    router-view
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'Usuarios',
  computed: {
    ...mapState('usuarios', ['loggedIn']),
    ...mapGetters('usuarios', ['usuario']),
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
</style>
