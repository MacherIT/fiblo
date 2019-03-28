<template lang="pug">
  .etapa-acciones
    form(
      @submit.prevent="setFields"
      novalidate)
      .campo
        span Monto a recaudar
        .valor-equivalencia
          input(
            type="text"
            v-validate="'required|numeric|max_value:100'"
            name="monto"
            v-model="etapa.monto"
            placeholder="$100")
          .equivalencia
            span ≈ Ξ {{(etapa.monto / valorCambio).toFixed(2)}}
          .error
            span.fadeIn(v-if="etapa.monto > 200") El monto máximo es $100
      .campo
        span Monto de supersuscripción
        .valor-equivalencia
          input(
            type="text"
            v-validate="'required|numeric|min_value:' + etapa.monto + '|max_value: 200'"
            name="montoSuperaMax"
            v-model="etapa.montoSuperaMax"
            placeholder="$200")
          .equivalencia
            span ≈ Ξ {{(etapa.montoSuperaMax / valorCambio).toFixed(2)}}
          .error
            span.fadeIn(v-if="etapa.montoSuperaMax > 200") El monto máximo es $200
      .campo
        span Cantidad de acciones
        .valor-equivalencia
          input(
            type="text"
            v-validate="'required|numeric'"
            name="cantAcciones"
            v-model="etapa.cantAcciones"
            placeholder="500")
          .equivalencia
            span ≈ ${{etapa.cantAcciones && etapa.cantAcciones > 0 ? (etapa.monto / etapa.cantAcciones).toFixed(2) : 0}}/acción
      .subm
        .loading(v-if="sent")
          font-awesome-icon(icon="circle-notch", spin)
        input(
          type="submit"
          value="Finalizar"
          :disabled="!validForm || sent")
</template>

<script>
import marketcap from '@/services/marketcap';

export default {
  props: ['proyecto', 'set', 'setEtapaActiva'],
  data() {
    return {
      valorCambio: '',
      sent: false,
      etapa: {
        monto: this.proyecto.monto ? this.proyecto.monto : '',
        montoSuperaMax: this.proyecto.montoSuperaMax ? this.proyecto.montoSuperaMax : '',
        cantAcciones: this.proyecto.cantAcciones ? this.proyecto.cantAcciones : '',
      },
    };
  },
  mounted() {
    marketcap.getArs().then(
      monto => {
        this.valorCambio = monto;
      },
      error => {
        console.error(error);
        this.valorCambio = 4000;
      },
    );
  },
  methods: {
    setFields() {
      Object.keys(this.etapa).map(k => {
        this.set(k, this.etapa[k]);
      });
      this.setEtapaActiva(4);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
.etapa-acciones {
  width: 100%;
  height: 100%;
  form {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    padding: 30px;
    .campo {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
      width: 100%;
      margin-bottom: 15px;
      & > span {
        margin-bottom: 7px;
        color: #fff;
        text-transform: uppercase;
        font-family: $fontKeepCalmMedium;
        letter-spacing: 1px;
        font-size: 85%;
      }
      .valor-equivalencia {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        width: 100%;
        input {
          width: 70%;
          border: 0;
          border-radius: 5px;
          height: 30px;
          padding: 0 10px;
          font-family: $fontUbuntuRegular;
          font-size: 80%;
          &::placeholder {
            font-family: $fontUbuntuLight;
            text-transform: uppercase;
          }
        }
        .equivalencia {
          width: 29%;
          span {
            font-size: 120%;
            color: #fff;
          }
        }
        .error {
          width: 100%;
          height: 25px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          span {
            font-size: 85%;
            color: #ff4d00;
          }
        }
      }
    }
    .subm {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: 100%;
      .loading {
        margin-right: 10px;
        svg {
          color: $colorBeigeBase;
        }
      }
      input {
        height: 20px;
        padding: 0 30px;
        border-radius: 3px;
        border: 0;
        font-size: 90%;
        background-color: $colorGrisBase;
        text-transform: uppercase;
        color: #999;
        font-weight: bold;
        @include ease-transition;
        opacity: 0.8;
        cursor: pointer;
        &:not(:disabled) {
          color: $colorBeigeBase;
          opacity: 1;
          &:hover {
            @include sombra(0 0 5px 0 #000);
          }
        }
      }
    }
  }
}
</style>
