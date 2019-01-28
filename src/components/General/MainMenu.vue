<template lang="pug">
  ul
    li
      router-link(:to="{ name: 'Home', path: '/' }") Home
    li
      router-link(:to="{ name: 'Usuarios', path: '/usuarios' }") Usuarios
    //- li(v-if="loggedIn")
    //-   router-link(:to="{ name: 'Wallet', path: '/wallet' }") Wallet
    li(v-if="loggedIn")
      router-link(:to="{ name: 'CNV', path: '/cnv' }") CNV
    li
      router-link(:to="{ name: 'Proyectos', path: 'proyectos' }") Proyectos
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'MainMenu',
  computed: {
    ...mapState('usuarios', ['loggedIn']),
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
</style>
