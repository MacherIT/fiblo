<template lang="pug">
  .proyectos-form-new
    .lista-etapas
      .etapa.general(
        :class="{active: etapaActiva === 0}"
        @click="setEtapaActiva(0)")
        .rombo
        .numero
          span 1
        .nombre
          span General
      .etapa.propuesta(
        :class="{active: etapaActiva === 1}"
        @click="setEtapaActiva(1)"
        :disabled="etapaActiva <= 0")
        .rombo
        .numero
          span 2
        .nombre
          span Propuesta
      .etapa.emprendedores(
        :class="{active: etapaActiva === 2}"
        @click="setEtapaActiva(2)"
        :disabled="etapaActiva <= 1")
        .rombo
        .numero
          span 3
        .nombre
          span Emp...ores
      .etapa.acciones(
        :class="{active: etapaActiva === 3}"
        @click="setEtapaActiva(3)"
        :disabled="etapaActiva <= 2")
        .rombo
        .numero
          span 4
        .nombre
          span Acciones
    .etapa-activa
      EtapaGeneral(
        :proyecto="proyecto"
        :set="set"
        :setEtapaActiva="setEtapaActiva"
        v-if="etapaActiva === 0")
      EtapaPropuesta(
        :proyecto="proyecto"
        :set="set"
        :setEtapaActiva="setEtapaActiva"
        v-if="etapaActiva === 1")
      EtapaEmprendedores(
        :proyecto="proyecto"
        :set="set"
        :setEtapaActiva="setEtapaActiva"
        v-if="etapaActiva === 2")
      EtapaAcciones(
        :proyecto="proyecto"
        :set="set"
        :setEtapaActiva="setEtapaActiva"
        v-if="etapaActiva === 3")
      EtapaFinal(
        :proyecto="proyecto"
        :setEtapaActiva="setEtapaActiva"
        v-if="etapaActiva === 4")
</template>

<script>
import { mapActions } from 'vuex';

import EtapaGeneral from '@/components/Proyectos/Nuevo/EtapaGeneral';
import EtapaPropuesta from '@/components/Proyectos/Nuevo/EtapaPropuesta';
import EtapaEmprendedores from '@/components/Proyectos/Nuevo/EtapaEmprendedores';
import EtapaAcciones from '@/components/Proyectos/Nuevo/EtapaAcciones';
import EtapaFinal from '@/components/Proyectos/Nuevo/EtapaFinal';

export default {
  name: 'ProyectosFormNew',
  components: {
    EtapaGeneral,
    EtapaPropuesta,
    EtapaEmprendedores,
    EtapaAcciones,
    EtapaFinal,
  },
  data() {
    return {
      sent: false,
      proyecto: {},
      etapaActiva: 0,
    };
  },
  mounted() {
    this.setPageTitle('Nuevo proyecto');
  },
  methods: {
    ...mapActions('general', ['setPageTitle']),
    set(field, value) {
      this.proyecto[field] = value;
    },
    setEtapaActiva(index) {
      this.etapaActiva = index;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/config';
.proyectos-form-new {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  position: relative;
  .lista-etapas {
    height: 100%;
    width: 30%;
    min-width: 30%;
    background-color: $colorGrisOscuro;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    @include sombra(0 0 10px 0 #000);
    padding: 15px;
    .etapa {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      @include minmaxwh(100px);
      position: relative;
      margin-bottom: 5px;
      cursor: pointer;
      &:hover {
        .rombo {
          @include grayscale(0.3);
        }
      }
      &.active {
        .rombo {
          @include grayscale(0);
          background-image: url('../../assets/images/rombo-celeste.png');
        }
      }
      .rombo {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 0;
        width: 100%;
        height: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        background-image: url('../../assets/images/rombo-azul.png');
        @include ease-transition;
        @include grayscale(0.7);
      }
      .numero {
        position: relative;
        z-index: 1;
        margin-bottom: 3px;
        span {
        }
      }
      .nombre {
        position: relative;
        z-index: 1;
        span {
          text-transform: uppercase;
          font-size: 70%;
          font-weight: bold;
        }
      }
    }
  }
  .etapa-activa {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
