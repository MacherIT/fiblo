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
      span MONTO: ${{proyecto.monto}}
    .monto-supera-max
      span MONTO-SUPERA-MAX: ${{proyecto.montoSuperaMax}}
    .monto-recaudado
      span MONTO RECAUDADO: ${{montoRecaudado}}
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
import { mapGetters } from 'vuex';
import fiblo from '@/services/fiblo';

export default {
  name: 'ShowProyecto',
  data() {
    return {
      proyecto: {},
      contrato: {},
      sent: false,
      montoAccion: '',
    };
  },
  computed: {
    ...mapGetters('usuarios', ['usuario']),
    ciudad() {
      return this.proyecto && this.proyecto.ciudad ? JSON.parse(this.proyecto.ciudad) : '';
    },
    montoRecaudado() {
      // if (!!this.contrato.contributionFiled) {
      //   this.contrato
      //     .receivedFunds({}, { fromBlock: 0, toBlock: 'latest' })
      //     .watch((error, eventResult) => {
      //       console.log(error);
      //       console.log(eventResult);
      //     });
      // }
      return this.contrato.contribution_counter
        ? parseInt(this.contrato.contribution_counter())
        : 0;
    },
  },
  mounted() {
    this.$http({
      method: 'GET',
      url: `/api/proyectos/${this.$route.params.id}`,
    }).then(
      ({ data }) => {
        this.proyecto = data;
        if (proxy) {
          // this.contrato = proxy.at(this.proyecto.address);
        }
      },
      error => {
        console.error(error);
      },
    );
    let proxy = fiblo.init();

    // const getEvents = () => {
    //   console.log('corrí el get');
    //
    //   proxy.receivedFunds({}, { fromBlock: 0, toBlock: 'latest' }).get((error, eventResult) => {
    //     if (error) console.log('Error in myEvent event handler: ' + error);
    //     else console.log('myEvent: ' + JSON.stringify(eventResult.args));
    //   });
    //
    //   this.contrato.events &&
    //     this.contrato.events
    //       .receivedFunds({}, { fromBlock: 0, toBlock: 'latest' })
    //       .on('data', function(event) {
    //         console.log(event);
    //       })
    //       .on('error', console.error);
    //
    //   setTimeout(getEvents, 3000);
    // };
    //
    // window.getEvents = getEvents;
  },
  methods: {
    comprarAccion() {
      if (this.dirtyForm && this.validForm) {
        this.sent = true;
        this.contrato.receiveFunds(this.usuario.id, {
          value: window.web3.toWei(this.montoAccion, 'ether'),
          from: window.web3.eth.defaultAccount,
          address: this.contrato.address,
          gas: 8000000,
        });
      } else {
        this.$validator.validateAll();
      }
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
  .share-buying {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #ccc;
    width: 100%;
  }
}
</style>
