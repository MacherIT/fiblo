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
        rect#diff-main.fadeIn(
          v-show="etapa === 0"
          fill='black')
        rect#diff-beneficiarios.fadeIn(
          v-show="etapa === 1"
          fill='black')
        rect#diff-proyectos.fadeIn(
          v-show="etapa === 2"
          fill='black')
        rect#diff-validacion-interna.fadeIn(
          v-show="etapa === 3"
          fill='black')
        rect#diff-close-round.fadeIn(
          v-show="etapa === 4"
          fill='black')
    .textos(
      :class="'etapa' + etapa")
      .texto.etapa0(
        v-show="etapa === 0")
        span Esta es la sección de CNV/ADMIN, acá se pueden realizar cambios como lo haría la CNV o el administrador de Fiblo únicamente con un usuario especial de administración.
      .texto.etapa1(
        v-show="etapa === 1")
        span Esta es la lista de beneficiarios para validar dentro de la CNV
      .texto.etapa2(
        v-show="etapa === 2")
        span Esta es la lista de proyectos para validar dentro de la CNV
      .texto.etapa3(
        v-show="etapa === 3")
        span Con estos botones se realiza una verificación de validez de beneficiario y proyecto en la CNV y se actualiza el estado interno de los datos para permitir el inicio de compra de acciones.
      .texto.etapa4(
        v-show="etapa === 4")
        span Este botón verifica que se haya alcanzado el monto esperado a recaudar y/o la fecha límite para vender acciones y cierra el proyecto.
    button.boton.saltar(
      @click="saltar")
      span Saltar
    button.boton.anterior(
      :disabled="etapa <= 0"
      @click="setAnterior")
      span Anterior
    button.boton.siguiente(
      @click="setSiguiente")
      span {{etapa < 4 ? 'Siguiente' : 'Terminar'}}
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: ['setTabActiva'],
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
    ...mapActions('tour', ['finishCNV']),
    saltar() {
      this.finishCNV();
      this.setTabActiva(0);
    },
    setSiguiente() {
      if (this.etapa < 4) {
        this.etapa += 1;
        if (this.etapa > 2) {
          this.setTabActiva(1);
        }
        setTimeout(() => {
          this.setDiffs();
        }, 500);
      } else {
        this.finishCNV();
        this.setTabActiva(0);
      }
    },
    setAnterior() {
      if (this.etapa > 0) {
        this.etapa -= 1;
        if (this.etapa < 3) {
          this.setTabActiva(0);
        }
        setTimeout(() => {
          this.setDiffs();
        }, 500);
      }
    },
    setDiffs() {
      const diffMain = document.querySelector('#root-app .tour svg #diff-main');
      const main = document.querySelector('#root-app .main-box');
      if (main) {
        diffMain.setAttribute('x', main.getBoundingClientRect().x - 10);
        diffMain.setAttribute('y', main.getBoundingClientRect().y - 55);
        diffMain.setAttribute('width', main.getBoundingClientRect().width + 20);
        diffMain.setAttribute('height', main.getBoundingClientRect().height + 65);
      }

      const diffBeneficiarios = document.querySelector('#root-app .tour svg #diff-beneficiarios');
      const beneficiarios = document.querySelector(
        '#root-app .main-box .cnv .tabs .section.cnv .contenido.beneficiaries',
      );

      if (beneficiarios) {
        diffBeneficiarios.setAttribute('x', beneficiarios.getBoundingClientRect().x - 10);
        diffBeneficiarios.setAttribute('y', beneficiarios.getBoundingClientRect().y - 10);
        diffBeneficiarios.setAttribute('width', beneficiarios.getBoundingClientRect().width + 20);
        diffBeneficiarios.setAttribute('height', beneficiarios.getBoundingClientRect().height + 20);
      }

      const diffProyectos = document.querySelector('#root-app .tour svg #diff-proyectos');
      const proyectos = document.querySelector(
        '#root-app .main-box .cnv .tabs .section.cnv .contenido.proyectos',
      );

      if (proyectos) {
        diffProyectos.setAttribute('x', proyectos.getBoundingClientRect().x - 10);
        diffProyectos.setAttribute('y', proyectos.getBoundingClientRect().y - 10);
        diffProyectos.setAttribute('width', proyectos.getBoundingClientRect().width + 20);
        diffProyectos.setAttribute('height', proyectos.getBoundingClientRect().height + 20);
      }

      const diffValidacionInterna = document.querySelector(
        '#root-app .tour svg #diff-validacion-interna',
      );
      const botonValidar = document.querySelector(
        '#root-app .main-box .tabs .section.admin .contenido.proyectos .lista .item.proyecto .boton.validar',
      );

      const botonInvalidar = document.querySelector(
        '#root-app .main-box .tabs .section.admin .contenido.proyectos .lista .item.proyecto .boton.invalidar',
      );

      if (botonValidar && botonInvalidar) {
        diffValidacionInterna.setAttribute('x', botonValidar.getBoundingClientRect().x - 10);
        diffValidacionInterna.setAttribute('y', botonValidar.getBoundingClientRect().y - 10);
        diffValidacionInterna.setAttribute(
          'width',
          botonValidar.getBoundingClientRect().width +
            botonInvalidar.getBoundingClientRect().width +
            30,
        );
        diffValidacionInterna.setAttribute(
          'height',
          botonValidar.getBoundingClientRect().height + 20,
        );
      }

      const diffCloseRound = document.querySelector('#root-app .tour svg #diff-close-round');
      const closeRound = document.querySelector(
        '#root-app .main-box .tabs .section.admin .contenido.proyectos .lista .item.proyecto .boton.close-round',
      );

      if (closeRound) {
        diffCloseRound.setAttribute('x', closeRound.getBoundingClientRect().x - 10);
        diffCloseRound.setAttribute('y', closeRound.getBoundingClientRect().y - 10);
        diffCloseRound.setAttribute('width', closeRound.getBoundingClientRect().width + 20);
        diffCloseRound.setAttribute('height', closeRound.getBoundingClientRect().height + 20);
      }
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
      right: 25px;
      top: auto;
    }
    &.etapa1 {
      left: 25px;
      top: 15%;
    }
    &.etapa2 {
      left: 25px;
      bottom: 15%;
    }
    &.etapa3 {
      left: 15vw;
      top: auto;
      width: 250px;
    }
    &.etapa4 {
      left: 30vw;
      top: auto;
      width: 250px;
    }
    .texto {
      width: 90%;
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
