<template lang="pug">
  .transferir-tokens.fadeIn
    .cerrar(@click="showPopupTransferirTokens('')")
      font-awesome-icon(icon="times")
    .acciones-actuales
      span Cantidad actual: {{accionesActuales}} acciones
    form(
      name="transferir"
      @submit.prevent="transferirTokens"
      novalidate)
      .campo.destino
        span Destino
        .input-lista
          input(
            type="text"
            placeholder="0x3ed81c7A...aA24aDB1CA"
            v-model="destino"
            name="destino"
            v-validate="'required'"
            :disabled="accionesActuales === 0")
          .toggle-lista(@click="toggleLista")
            font-awesome-icon(:icon="listaDesplegada ? 'caret-up' : 'caret-down'")
          .lista-usuarios.fadeIn(v-if="listaDesplegada")
            .usuario(
              v-for="usuario in listaUsuarios"
              :key="usuario.id"
              @click="setAddress(usuario.address[0])")
              .nombre
                span {{usuario.nombre}}
              .address
                span {{usuario.address[0].substring(0, 10)}}...{{usuario.address[0].substring(22, 32)}}
        span.error {{errors.first('destino')}}
      .campo.cantidad
        span Cantidad
        input(
          type="text"
          placeholder="100"
          v-model="cantidad"
          name="cantidad"
          v-validate="'required|max_value:' + accionesActuales"
          :disabled="accionesActuales === 0")
        span.error {{errors.first('cantidad')}}
      .subm
        .loading(v-if="sent")
          font-awesome-icon(icon="circle-notch", spin)
        input(
          type="submit"
          value="Transferir"
          :disabled="sent || !validForm")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

import fiblo from '@/services/fiblo';

export default {
  props: [
    'proyectoAddress',
    'accionesActuales',
    'showPopupTransferirTokens',
    'initMisParticipaciones',
  ],
  data() {
    return {
      destino: '',
      cantidad: '',
      sent: false,
      listaUsuarios: [],
      listaDesplegada: false,
    };
  },
  computed: {
    ...mapState('usuarios', ['token']),
    ...mapGetters('usuarios', ['usuario']),
  },
  mounted() {
    this.$http({
      method: 'GET',
      url: '/api/usuarios/with_address',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    }).then(
      ({ data }) => {
        this.listaUsuarios = data.filter(u => u.id !== this.usuario.id);
      },
      error => {
        console.error(error);
      },
    );
  },
  methods: {
    ...mapActions('general', ['setFlash']),
    toggleLista() {
      if (this.listaDesplegada) {
        this.listaDesplegada = false;
      } else {
        this.listaDesplegada = true;
      }
    },
    setAddress(address) {
      this.destino = address;
      this.listaDesplegada = false;
    },
    transferirTokens() {
      this.setFlash({});
      this.sent = true;
      const addrRegex = new RegExp(/^0x[a-fA-F0-9]{40}$/);
      if (this.destino && this.cantidad) {
        if (addrRegex.test(this.destino)) {
          if (parseFloat(this.cantidad) <= parseFloat(this.accionesActuales)) {
            fiblo.transfer(
              this.proyectoAddress,
              this.destino,
              web3.toWei(this.cantidad),
              (error, tx) => {
                if (error) {
                  this.setFlash({ tipo: 'error', mensaje: 'Ocurrió un error' });
                } else {
                  this.setFlash({
                    tipo: 'exito',
                    mensaje: 'Transferencia correcta!',
                    timeout: 3000,
                  });
                  this.initMisParticipaciones();
                  this.showPopupTransferirTokens('');
                }
              },
            );
          } else {
            this.sent = false;
            this.setFlash({ tipo: 'error', mensaje: 'No hay esa cantidad de tokens disponibles' });
          }
        } else {
          this.sent = false;
          this.setFlash({ tipo: 'error', mensaje: 'La dirección ingresada es inválida' });
        }
      } else {
        this.sent = false;
        this.setFlash({ tipo: 'error', mensaje: 'Valores de transferencia inválidos' });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
.transferir-tokens {
  position: absolute;
  right: 0;
  top: 0;
  width: 350px;
  // height: 200px;
  background-color: $colorAzulMedio;
  border-radius: 4px;
  padding: 10px;
  padding-top: 30px;
  @include sombra(0 0 3px 0 #111);
  .cerrar {
    position: absolute;
    right: 5px;
    top: 5px;
    @include minmaxwh(25px);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.6;
    @include ease-transition;
    cursor: pointer;
    &:hover {
      opacity: 1;
    }
    svg {
      color: #fff;
    }
  }
  .acciones-actuales {
    width: 100%;
    padding: 5px 0;
    margin-bottom: 5px;
    span {
      color: #fff;
    }
  }
  form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    .campo {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
      width: 100%;
      margin-bottom: 10px;
      &.destino {
        .input-lista {
          width: 100%;
          position: relative;
          input {
          }
          .toggle-lista {
            position: absolute;
            right: 0;
            top: 0;
            border-radius: 4px;
            @include minmaxwh(30px);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            opacity: 0.5;
            @include ease-transition;
            &:hover {
              opacity: 1;
            }
            svg {
              color: $colorAzulOscuro;
            }
          }
          .lista-usuarios {
            position: absolute;
            left: 0;
            top: 28px;
            background-color: #fff;
            width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-direction: column;
            z-index: 5;
            border-radius: 0 0 4px 4px;
            overflow: auto;
            max-height: 250px;
            .usuario {
              display: flex;
              justify-content: flex-start;
              align-items: flex-start;
              flex-direction: column;
              width: 100%;
              padding: 5px;
              border-bottom: 1px solid #ccc;
              @include ease-transition;
              cursor: pointer;
              &:hover {
                background-color: #ddd;
              }
              .nombre {
                span {
                  color: #333;
                  font-family: $fontUbuntuRegular;
                }
              }
              .address {
                span {
                  color: #777;
                  font-family: $fontUbuntuRegular;
                }
              }
            }
          }
        }
      }
      span {
        color: #fff;
        font-family: $fontKeepCalmMedium;
        text-transform: uppercase;
        font-size: 80%;
        margin-bottom: 3px;
      }
      input {
        width: 100%;
        height: 30px;
        border: 0;
        padding: 0 5px;
        background-color: #fff;
        border-radius: 3px;
      }
      span.error {
        margin-top: 3px;
        font-size: 70%;
        color: orange;
      }
    }
    .subm {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: 100%;
      .loading {
        margin-right: 5px;
        svg {
          color: #fff;
        }
      }
      input {
        border: 0;
        background-color: $colorPaletaC5;
        @include ease-transition;
        border-radius: 4px;
        color: #fff;
        text-transform: uppercase;
        width: 100px;
        height: 28px;
        font-weight: bold;
        font-size: 80%;
        &:disabled {
          @include grayscale(0.5);
        }
        &:not(:disabled) {
          cursor: pointer;
          &:hover {
            background-color: $colorPaletaC4;
          }
        }
      }
    }
  }
}
</style>
