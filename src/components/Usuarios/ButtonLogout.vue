<template lang="pug">
  .logout
    .presentacion
      PresentacionFiblo
    .boton
      .usuario
        span {{usuario.email}}
      button(@click="logout()") Cerrar sesión
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import PresentacionFiblo from '@/components/General/PresentacionFiblo';

export default {
  name: 'UsuariosButtonLogout',
  components: {
    PresentacionFiblo,
  },
  mounted() {
    this.setPageTitle('Mi perfil');
  },
  computed: {
    ...mapGetters('usuarios', ['usuario']),
  },
  methods: {
    ...mapActions('usuarios', ['logout']),
    ...mapActions('general', ['setPageTitle']),
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/config';
.logout {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  .presentacion {
    width: 50%;
    height: 100%;
  }
  .boton {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
    .usuario {
      margin-bottom: 20px;
      span {
        color: #fff;
      }
    }
    button {
      height: 20px;
      padding: 0 30px;
      border-radius: 3px;
      border: 0;
      font-size: 90%;
      background-color: $colorGrisBase;
      text-transform: uppercase;
      font-weight: bold;
      @include ease-transition;
      cursor: pointer;
      color: $colorBeigeBase;
      opacity: 1;
      &:hover {
        @include sombra(0 0 5px 0 #000);
      }
    }
  }
}
</style>
