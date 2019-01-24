<template lang="pug">
  .proyecto-show
    .categoria
      span(v-if="proyecto.categoria") CATEGORÍA: {{proyecto.categoria.nombre}}
    .ciudad
      span(
        v-if="ciudad && ciudad.provincia")
        | CIUDAD: {{ciudad.provincia.nombre}} - {{ciudad.ciudad.nombre}}
    .nombre
      span NOMBRE: {{proyecto.nombre}}
    .monto
      span MONTO: ${{proyecto.monto}} --> {{proyecto.monto / valorCambio}} ETH
    .monto-supera-max
      span MONTO-SUPERA-MAX: ${{proyecto.montoSuperaMax}} --> {{proyecto.montoSuperaMax / valorCambio}} ETH
    .monto-recaudado
      span MONTO RECAUDADO: {{montoRecaudado}} ETH --> ${{montoRecaudado * valorCambio}}
    .sector
      span SECTOR ¯\_(°_°)_/¯ {{proyecto.sector}}
    .emprendedores
      span EMPRENDEDORES:
      ul
        li(
          v-for="(emprendedor, index) in proyecto.emprendedores"
          :key="index") {{emprendedor.nombre}}
    .pubdate
      span CREACIÓN: {{proyecto.createdAt | formatDate('DD/MM/YYYY hh:mm')}}
    .share-buying(v-if="proyecto.usuario_id !== usuario.id")
      .titulo
        span Comprar acciones
      form(@submit.prevent="comprarAccion", novalidate)
        input(
          type="number"
          placeholder="ETH"
          v-validate="'required'"
          v-model="montoAccion")
        input(
          type="submit"
          value="¡Comprar!"
          :disabled="!validForm || sent")
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import fiblo from '@/services/fiblo';

export default {
  name: 'ShowProyecto',
  data() {
    return {
      proyecto: {},
      contrato: {},
      sent: false,
      montoAccion: '',
      montoRecaudado: 0,
      valorCambio: 1,
    };
  },
  computed: {
    ...mapState('usuarios', ['token']),
    ...mapGetters('usuarios', ['usuario']),
    ciudad() {
      // return this.proyecto && this.proyecto.ciudad ? JSON.parse(this.proyecto.ciudad) : '';
      return '';
    },
  },
  mounted() {
    this.$http({
      method: 'GET',
      url: `/api/proyectos/${this.$route.params.id}`,
    }).then(
      ({ data }) => {
        this.proyecto = data;
        this.getMontoRecaudado();
      },
      error => {
        console.error(error);
      },
    );
    fiblo.init();

    this.$http({
      method: 'GET',
      url: 'https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=ARS',
    }).then(
      ({ data }) => {
        if (data && data[0] && data[0].price_ars) {
          this.valorCambio = parseFloat(data[0].price_ars);
        }
      },
      error => {
        console.error(error);
      },
    );
  },
  methods: {
    comprarAccion() {
      if (this.dirtyForm && this.validForm) {
        this.sent = true;
        this.getWalletAddress(wallet_address => {
          fiblo.receiveFunds(this.usuario.id, wallet_address, this.montoAccion, (error, tx) => {
            if (error) {
              console.error(error);
            } else {
              this.getMontoRecaudado();
              this.sent = false;
            }
          });
        });
      } else {
        this.$validator.validateAll();
      }
    },
    getWalletAddress(callback) {
      this.$http({
        method: 'GET',
        url: `/api/usuarios/${this.usuario.id}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }).then(
        ({ data }) => {
          callback(data.address);
        },
        error => {
          console.error(error);
        },
      );
    },
    getMontoRecaudado() {
      fiblo.getMontoRecaudado((error, monto) => {
        if (error) {
          console.error(error);
        }
        this.montoRecaudado = monto;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
.proyecto-show {
  margin: 15px;
  display: flex;
  flex-direction: column;
  @include default-form;
  .share-buying {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #ccc;
    width: 100%;
  }
}
</style>
