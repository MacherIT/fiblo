<template lang="pug">
  .logout
    .presentacion
      PresentacionFiblo
    .boton
      .usuario
        span {{usuario.email}}
      .address
        span(v-if="!myAddress") Todavía no hay una dirección de Ethereum asociada a tu cuenta, ¿querés dirección la cuenta actual?
        span(v-if="myAddress") Tu dirección asociada
        .input-asoc
          input(
            type="text"
            :value="myAddress && myAddress[0] ? myAddress[0] : defaultAccount"
            readonly
            disabled)
          button(
            v-if="!myAddress"
            @click="asociar") Asociar
        .sent
          .loading(v-if="sent")
            font-awesome-icon(icon="circle-notch", spin)
      .cerrar-sesion
        button(@click="logout()") Cerrar sesión
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

import fiblo from '@/services/fiblo';

import PresentacionFiblo from '@/components/General/PresentacionFiblo';

export default {
  name: 'UsuariosButtonLogout',
  components: {
    PresentacionFiblo,
  },
  data() {
    return {
      myAddress: [],
      defaultAccount: '',
      sent: false,
    };
  },
  mounted() {
    this.setPageTitle('Mi perfil');
    this.$http({
      method: 'GET',
      url: `/api/usuarios/${this.usuario.id}/simple_data`,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    }).then(
      ({ data }) => {
        this.myAddress = data.address;
      },
      error => {
        console.error(error);
      },
    );
    fiblo.getDefaultAccount((error, account) => {
      if (error) {
        console.error(error);
      } else {
        this.defaultAccount = account;
      }
    });
  },
  computed: {
    ...mapState('usuarios', ['token']),
    ...mapGetters('usuarios', ['usuario']),
  },
  methods: {
    ...mapActions('usuarios', ['logout']),
    ...mapActions('general', ['setPageTitle']),
    asociar() {
      if (this.defaultAccount && (!this.myAddress || !this.myAddress[0])) {
        this.$http({
          method: 'PUT',
          url: '/api/usuarios/set_address',
          body: {
            address: this.defaultAccount,
          },
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }).then(
          ({ status }) => {
            this.sent = false;
            if (status === 200) {
              this.myAddress = [this.defaultAccount];
              this.defaultAccount = '';
            }
          },
          error => {
            console.error(error);
            this.sent = false;
          },
        );
      }
    },
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
    .address {
      padding: 0 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100%;
      span {
        color: #fff;
        margin-bottom: 10px;
      }
      .input-asoc {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 30px;
        input {
          border: 0;
          background-color: #ddd;
          border-radius: 4px;
          width: 100%;
          height: 100%;
          padding: 0 10px;
          color: #555;
          cursor: not-allowed;
        }
        button {
          border: 0;
          background-color: $colorAzulOscuro;
          border-radius: 4px;
          width: 80px;
          min-width: 80px;
          height: 100%;
          margin-left: 5px;
          color: #fff;
          cursor: pointer;
          @include ease-transition;
          &:hover {
            background-color: $colorAzulClaro;
          }
        }
      }
      .sent {
        width: 100%;
        height: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        .loading {
          svg {
            color: #fff;
          }
        }
      }
    }
    .cerrar-sesion {
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
}
</style>
