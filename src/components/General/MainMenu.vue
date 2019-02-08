<template lang="pug">
  .main-menu
    ul
      li
        router-link(to="/")
          font-awesome-icon(icon="home")
      li
        router-link(to="/usuarios")
          font-awesome-icon(icon="user")
      //- li(v-if="loggedIn")
      //-   router-link(:to="{ name: 'Wallet', path: '/wallet' }") Wallet
      //- li(v-if="loggedIn")
      //-   router-link(to="/cnv") CNV
      li
        router-link(to="/proyectos")
          font-awesome-icon(icon="handshake")
      li
        router-link(to="/mis-contribuciones")
          font-awesome-icon(icon="briefcase")
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
.main-menu {
  position: fixed;
  left: 0;
  background-color: $colorGrisBase;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  border-radius: 0 10px 10px 0;
  @include sombra(0 0 3px 0 #333);
  ul {
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    li {
      list-style: none;
      display: flex;
      justify-content: center;
      align-items: center;
      &:not(:last-of-type) {
        margin-bottom: 15px;
      }
      a {
        display: flex;
        justify-content: center;
        align-items: center;
        @include minmaxwh(50px);
        background-color: $colorAzulClaro;
        border-radius: 50%;
        @include sombra(1px 1px 2px 0 #333);
        @include ease-transition;
        cursor: pointer;
        &:hover {
          @include sombra(1px 1px 7px 0 #000);
        }
        svg {
          color: #fff;
          font-size: 200%;
        }
      }
    }
  }
}
</style>
