<template lang="pug">
  .etapa-general
    form(
      @submit.prevent="setFields"
      novalidate)
      .campo
        span Nombre del proyecto
        input(
          type="text"
          v-validate="'required'"
          name="nombre"
          v-model="etapa.nombre"
          placeholder="Nombre")
      .campo
        span Categoría
        select(
          name="categoria"
          v-model="etapa.categoria_id"
          v-validate="'required'")
          option(
            selected
            value=""
            disabled) -- Seleccionar categoría --
          option(
            v-for="categoria in categorias"
            :key="categoria.id"
            :value="categoria.id") {{categoria.nombre}}
      .half
        .campo
          span Provincia
          select(v-model="provincia")
            option(
              selected
              value=""
              disabled="") -- Provincia --
            option(
              v-for="provincia in provincias"
              :key="provincia.id"
              :value="provincia") {{provincia.nombre}}
        .campo
          span Ciudad
          select(
            v-model="etapa.ciudad"
            :disabled="!provincia")
            option(
              selected
              value=""
              disabled="") -- Ciudad --
            option(
              v-for="ciudad in provincia.ciudades"
              :key="ciudad.id"
              :value="{provincia: {id: provincia.id, nombre: provincia.nombre}, ciudad: ciudad}")
                | {{ciudad.nombre}}
      .campo
        span Domicilio
        input(
          type="text"
          placeholder="Domicilio"
          v-validate="'required'"
          name="domicilio"
          v-model="etapa.domicilio")
      .campo
        span Email
        input(
          type="text"
          placeholder="Email"
          v-validate="'required|email'"
          name="email"
          v-model="etapa.email")
      .campo
        span Fecha de finalización
        input(
          type="date"
          v-model="etapa.fechaFin"
          name="fechaFin"
          :min="fechaMin"
          :max="fechaMax")
      .subm
        .loading(v-if="sent")
          font-awesome-icon(icon="circle-notch", spin)
        input(
          type="submit"
          value="Siguiente"
          :disabled="!validForm || sent || !fechaFinValida")
</template>

<script>
import { mapActions } from 'vuex';
import moment from 'moment';

import provincias from '@/assets/data/ciudades-argentinas.json';

const CANT_MAX_DIAS_RONDA = 90;

export default {
  props: ['proyecto', 'set', 'setEtapaActiva'],
  data() {
    return {
      fechaMin: moment(new Date()).format('YYYY-MM-DD'),
      fechaMax: moment(new Date())
        .add(CANT_MAX_DIAS_RONDA, 'days')
        .format('YYYY-MM-DD'),
      provincias,
      provincia:
        this.proyecto.ciudad && this.proyecto.ciudad.provincia
          ? this.proyecto.ciudad.provincia.id
          : '',
      categorias: [],
      sent: false,
      etapa: {
        nombre: this.proyecto.nombre ? this.proyecto.nombre : '',
        categoria_id: this.proyecto.categoria ? this.proyecto.categoria : '',
        ciudad:
          this.proyecto.ciudad && this.proyecto.ciudad.ciudad ? this.proyecto.ciudad.ciudad.id : '',
        domicilio: this.proyecto.domicilio ? this.proyecto.domicilio : '',
        email: this.proyecto.email ? this.proyecto.email : '',
        fechaFin: '',
      },
    };
  },
  mounted() {
    this.$http({
      method: 'GET',
      url: '/api/categorias',
    }).then(
      ({ data }) => {
        this.categorias = data;
      },
      error => {
        console.error(error);
      },
    );
  },
  computed: {
    fechaFinValida() {
      return (
        this.etapa.fechaFin &&
        moment(new Date(this.etapa.fechaFin)).isBetween(
          moment(new Date()).subtract(1, 'days'),
          moment(new Date()).add(CANT_MAX_DIAS_RONDA, 'days'),
        )
      );
    },
  },
  methods: {
    ...mapActions('general', ['setPageTitle']),
    setFields() {
      Object.keys(this.etapa).map(k => {
        this.set(k, this.etapa[k]);
      });
      this.setPageTitle(this.etapa.nombre);
      this.setEtapaActiva(1);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
.etapa-general {
  width: 100%;
  height: 100%;
  form {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    padding: 20px;
    .campo {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
      width: 100%;
      margin-bottom: 10px;
      span {
        margin-bottom: 7px;
        color: #fff;
        text-transform: uppercase;
        font-family: $fontKeepCalmMedium;
        letter-spacing: 1px;
        font-size: 75%;
      }
      input,
      select {
        width: 100%;
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
    }
    .half {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-bottom: 15px;
      .campo {
        width: 49%;
        margin-bottom: 0;
      }
    }
    .subm {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: 100%;
      margin-top: 5px;
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