<template lang="pug">
  .proyecto-show
    span projectValidity: {{projectValidity}}
    span beneficiaryValidity: {{beneficiaryValidity}}
    .sets
      button(@click="setProjectValidity") Set project validity
      button(@click="setBeneficiaryValidity") Set beneficiary validity
    .categoria
      span(v-if="proyecto.categoria") CATEGORÍA: {{proyecto.categoria.nombre}}
    .ciudad
      span(
        v-if="ciudad && ciudad.provincia")
        | CIUDAD: {{ciudad.provincia.nombre}} - {{ciudad.ciudad.nombre}}
    .nombre
      span NOMBRE: {{proyecto.nombre}}
    .monto
      //- span MONTO: ${{proyecto.monto}} --> {{proyecto.monto / valorCambio}} ETH
      span MONTO: {{proyecto.monto}} ETH
    .monto-supera-max
      //- span MONTO-SUPERA-MAX: ${{proyecto.montoSuperaMax}} --> {{proyecto.montoSuperaMax / valorCambio}} ETH
      span MONTO-SUPERA-MAX: {{proyecto.montoSuperaMax}} ETH
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
          v-model="montoAccion"
          :disabled="!projectValidity || !beneficiaryValidity")
        input(
          type="submit"
          value="¡Comprar!"
          :disabled="!validForm || sent")
        span(v-if="!projectValidity || !beneficiaryValidity") Proyecto todavía inválido
    .contribuciones
      ul
        li(
          v-for="(contribucion, index) in contribuciones"
          :key="index")
          span {{contribucion}}
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
      projectValidity: false,
      beneficiaryValidity: false,
      sent: false,
      montoAccion: '',
      montoRecaudado: 0,
      valorCambio: 1,
      contribuciones: [],
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
        this.getContribuciones(this.proyecto.address);
        this.getMontoRecaudado(this.proyecto.address);
        fiblo.projectValiditySet(this.proyecto.address, (error, res) => {
          if (error) {
            console.error(error);
          } else {
            this.projectValidity = res;
          }
        });
        fiblo.beneficiaryValiditySet(this.proyecto.address, (error, res) => {
          if (error) {
            console.error(error);
          } else {
            this.beneficiaryValidity = res;
          }
        });
      },
      error => {
        console.error(error);
      },
    );

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
    getContribuciones(project_address) {
      fiblo.getContribuciones(project_address, (error, contribucion) => {
        if (error) {
          console.error(error);
        } else {
          this.contribuciones.push({
            uid: contribucion.args.uid.toNumber(),
            monto: window.web3.fromWei(contribucion.args.amount).toNumber(),
          });
        }
      });
    },
    comprarAccion() {
      if (this.dirtyForm && this.validForm) {
        this.sent = true;
        fiblo.receiveFunds(
          this.proyecto.address,
          this.usuario.id,
          this.montoAccion,
          (error, tx) => {
            if (error) {
              console.error(error);
            } else {
              this.getMontoRecaudado(this.proyecto.address);
              this.sent = false;
            }
          },
        );
      } else {
        this.$validator.validateAll();
      }
    },
    getMontoRecaudado(project_address) {
      fiblo.getMontoRecaudado(project_address, (error, monto) => {
        if (error) {
          console.error(error);
        }
        this.montoRecaudado = monto;
      });
    },
    setProjectValidity() {
      fiblo.setProjectValidity(this.proyecto.address, (error, res) => {
        console.log(res);
      });
    },
    setBeneficiaryValidity() {
      fiblo.setBeneficiaryValidity(this.proyecto.address, (error, res) => {
        console.log(res);
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
  .sets {
    margin-bottom: 20px;
    button {
      display: block;
      margin-bottom: 7px;
    }
  }
  .share-buying {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #ccc;
    width: 100%;
  }
}
</style>
