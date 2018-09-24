<template lang="pug">
  .usuarios-button-logout
    button(@click="logout()") Cerrar sesión
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'UsuariosButtonLogout',
  methods: {
    ...mapActions('usuarios', ['logout']),
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/config';
.usuarios-button-logout {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  button {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 6px;
    width: 100%;
    margin-bottom: 10px;
    margin: 0;
    width: 100%;
    background-color: #eee;
    border: 0;
    cursor: pointer;
    &:hover {
      background-color: #999;
    }
  }
}
</style>
