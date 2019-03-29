<template lang="pug">
  .tour.fadeIn
    svg(
      width='100%'
      height='100%')
      rect(
        x='0'
        y='0'
        width='100%'
        height='100%'
        mask='url(#hole)')
      mask#hole
        rect(
          x='0'
          y='0'
          width='100%'
          height='100%'
          fill='#fffc')
        rect#diff-participar.fadeIn(
          v-show="etapa === 0"
          fill='black')
    .textos(
      :class="'etapa' + etapa")
      .texto.etapa0(
        v-show="etapa === 0")
        span Acá vas a poder comprar acciones de un proyecto en particular...
    //- button.boton.saltar(
    //-   @click="saltar")
    //-   span Saltar
    //- button.boton.anterior(
    //-   :disabled="etapa <= 0"
    //-   @click="setAnterior")
    //-   span Anterior
    button.boton.siguiente(
      @click="setSiguiente")
      span {{etapa < 0 ? 'Siguiente' : 'Entendido'}}
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      etapa: 0,
    };
  },
  mounted() {
    this.setDiffs();
    window.addEventListener('resize', this.setDiffs);
  },
  methods: {
    ...mapActions('tour', ['finishComprar']),
    saltar() {
      this.finishComprar();
    },
    setSiguiente() {
      if (this.etapa < 0) {
        this.etapa += 1;
      } else {
        this.finishComprar();
      }
    },
    setAnterior() {
      if (this.etapa > 0) {
        this.etapa -= 1;
      }
    },
    setDiffs() {
      const diffParicipar = document.querySelector('#root-app .tour svg #diff-participar');
      const participar = document
        .querySelector('#root-app .proyecto-show .cuerpo .tabs .tab.participar')
        .getBoundingClientRect();
      diffParicipar.setAttribute('x', participar.x - 10);
      diffParicipar.setAttribute('y', participar.y - 10);
      diffParicipar.setAttribute('width', participar.width + 20);
      diffParicipar.setAttribute('height', participar.height + 20);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
.tour {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  .textos {
    position: absolute;
    width: 200px;
    min-height: 80px;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $colorAzulBase;
    border-radius: 5px;
    @include sombra(0 0 2px 0 #000);
    &.etapa0 {
      left: auto;
      right: 25px;
      top: auto;
    }
    .texto {
      text-align: center;
      width: 80%;
      margin: auto;
      span {
        font-family: $fontUbuntuRegular;
        color: #fff;
      }
    }
  }
  button.boton {
    position: absolute;
    background-color: $colorAzulBase;
    bottom: 20px;
    @include sombra(0 0 3px 0 #000);
    border-radius: 5px;
    border: 0;
    @include ease-transition;
    height: 40px;
    padding: 0 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    @include grayscale(0.8);
    outline: 0;
    &.saltar {
      left: 20px;
    }
    &.anterior {
      right: 150px;
    }
    &.siguiente {
      right: 20px;
    }
    &:not(:disabled) {
      @include grayscale(0);
      cursor: pointer;
      &:hover {
        background-color: $colorAzulOscuro;
      }
    }
    span {
      font-family: $fontUbuntuLight;
      color: #fff;
      text-transform: uppercase;
      font-size: 90%;
    }
  }
}
</style>
