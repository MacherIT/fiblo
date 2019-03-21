<template lang="pug">
  .proyectos
    .seccion-filtros
      .filtro.nombre
        input(
          type="text"
          placeholder="NOMBRE / EMPRENDEDORES"
          v-model="filters.nombreEmp.val")
        font-awesome-icon(icon="search")
      .filtro.provincia
        select(v-model="provincia")
          option(selected, value="") -- Provincia --
          option(
            v-for="provincia in provincias"
            :key="provincia.id"
            :value="provincia") {{provincia.nombre}}
      .filtro.ciudad
        select(v-model="filters.ciudad.val", :disabled="!provincia")
          option(selected, value="") -- Ciudad --
          option(
            v-for="ciudad in provincia.ciudades"
            :key="ciudad.id"
            :value="ciudad.id")
              | {{ciudad.nombre}}
      .filtro.categoria
        select(v-model="filters.categoria.val")
          option(selected, value="") -- Categoria --
          option(
            v-for="categoria in categorias"
            :key="categoria.id"
            :value="categoria.id") {{categoria.nombre}}
      .filtro.progreso
        select(v-model="filters.progreso.val")
          option(selected, value="") -- Progreso --
          option(value="0,25") Entre 0% y 25%
          option(value="25,50") Entre 25% y 50%
          option(value="50,75") Entre 50% y 75%
          option(value="75,100") Entre 75% y 100%
      .filtro.duracion
        select(v-model="filters.duracion.val")
          option(selected, value="") -- Finaliza --
          option(
            v-for="duracion in duraciones"
            :key="duracion"
            :value="duracion") Hasta dentro de {{duracion}} días.
      .filtro.closed
        select(v-model="filters.open.val")
          option(selected, value="", disabled) -- Estado --
          option(value="todos") Todos
          option(value="abierto") Abierto
          option(value="cerrado") Cerrado
      .montos
        span Montos:
        .filtro.monto
          input(
            type="number"
            placeholder="$ MIN"
            v-model="filters.monto.val")
        .filtro.monto-supera-max
          input(
            type="number"
            placeholder="$ MAX"
            v-model="filters.montoSuperaMax.val")
    .seccion-lista
      .no-hay-proyectos(v-if="proyectos.length === 0 && loaded")
        span Todavía no hay proyectos
      router-link.proyecto(
        :to="'/proyectos/' + proyecto.id"
        v-for="proyecto in proyectosVisibles"
        :key="proyecto.id"
        :class="{cerrado: proyecto.closedRound}")
        .logo-ciudad
          .logo
            font-awesome-icon(
              v-if="!proyecto.logo"
              icon="rocket")
              //- Logo fiblo
            img(
              v-if="proyecto.logo"
              :src="proyecto.logo")
          .ciudad
            span {{proyecto.ciudad.ciudad.nombre}}
          .provincia
            span {{proyecto.ciudad.provincia.nombre}}
          .fecha-fin
            span {{moment(proyecto.fechaFin).format('DD/MM/YYYY')}}
        .datos
          .nombre
            span {{proyecto.nombre}}
          .descripcion
            span "{{stripHtml(proyecto.descripcion) | limitStr(30)}}"
          .monto
            span {{((proyecto.montoRecaudado * valorCambio) * 100 / proyecto.monto).toFixed(2)}}%
            span.de de
            span ${{proyecto.monto.toFixed(2)}}
        .categoria(
          :style="'background-color: ' + proyecto.categoria.color")
          span(
            :style="'color: ' + proyecto.categoria.colorTexto") {{proyecto.categoria.nombre}}
    router-link.new-project(to="/proyectos/new")
      font-awesome-icon(icon="plus")
</template>

<script>
import { mapActions } from 'vuex';
import moment from 'moment';

import provincias from '@/assets/data/ciudades-argentinas.json';

import fiblo from '@/services/fiblo';
import marketcap from '@/services/marketcap';

let valorCambio = 0;

export default {
  name: 'ListaProyectos',
  data() {
    return {
      moment,
      valorCambio: 0,
      provincia: '',
      provincias,
      loaded: false,
      proyectos: [],
      categorias: [],
      duraciones: [10, 15, 30, 60, 90],
      filters: {
        open: {
          fun(item) {
            return this.val === 'todos'
              ? true
              : this.val === 'abierto'
              ? !item.closedRound
              : item.closedRound;
          },
          val: 'todos',
        },
        ciudad: {
          fun(item) {
            return item.ciudad && item.ciudad.ciudad.id === this.val;
          },
          val: '',
        },
        categoria: {
          fun(item) {
            return item.categoria_id === this.val;
          },
          val: '',
        },
        progreso: {
          fun(item) {
            return (
              (item.montoRecaudado * 100) / item.monto >= this.val.split(',')[0] &&
              (item.montoRecaudado * 100) / item.monto <= this.val.split(',')[1]
            );
          },
          val: '',
        },
        nombreEmp: {
          fun(item) {
            return (
              item.nombre.indexOf(this.val) >= 0 ||
              item.emprendedores.some(emp => emp.nombre.indexOf(this.val) >= 0)
            );
          },
          val: '',
        },
        monto: {
          fun(item) {
            return item.monto >= this.val;
          },
          val: '',
        },
        montoSuperaMax: {
          fun(item) {
            return item.monto <= this.val;
          },
          val: '',
        },
        duracion: {
          fun(item) {
            return (
              item.fechaFin &&
              moment(item.fechaFin).isBefore(moment().add(parseInt(this.val), 'days'))
            );
          },
          val: '',
        },
      },
    };
  },
  computed: {
    proyectosVisibles() {
      return this.proyectos.filter(proyecto =>
        Object.keys(this.filters).every(k =>
          this.filters[k].val ? this.filters[k].fun(proyecto) : true,
        ),
      );
    },
  },
  mounted() {
    this.$http({
      method: 'GET',
      url: '/api/proyectos',
    }).then(
      ({ data }) => {
        this.proyectos = data.map(p => ({
          ...p,
          closedRound: false,
          montoRecaudado: 0,
        }));
        this.proyectos.map(p => {
          fiblo.getMontoRecaudado(p.address, (error, monto) => {
            if (error) {
              console.error(error);
            } else {
              p.montoRecaudado = monto;
            }
          });
          fiblo.isProjectClosed(p.address, (error, closed) => {
            if (error) {
              console.error(error);
            } else {
              p.closedRound = closed;
            }
          });
        });
        this.loaded = true;
      },
      error => {
        console.error(error);
      },
    );
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
    marketcap.getArs().then(
      monto => {
        this.valorCambio = monto;
        valorCambio = monto;
      },
      error => {
        console.error(error);
        this.valorCambio = 4000;
        valorCambio = 4000;
      },
    );
    this.setPageTitle('Proyectos');
  },
  methods: {
    ...mapActions('general', ['setPageTitle']),
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
.proyectos {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  position: relative;
  .seccion-filtros {
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
    .filtro {
      width: 100%;
      margin-bottom: 20px;
      &.nombre {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        svg {
          position: absolute;
          right: 5px;
          opacity: 0.7;
        }
      }
      input,
      select {
        width: 100%;
        height: 30px;
        border: 0;
        background-color: #fff;
        padding: 0 7px;
        text-transform: uppercase;
        font-family: $fontUbuntuRegular;
        font-size: 80%;
        &::placeholder {
          font-family: $fontUbuntuLight;
        }
      }
    }
    .montos {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      & > span {
        width: 100%;
        margin-bottom: 7px;
      }
      .filtro {
        width: 49%;
      }
    }
  }
  .seccion-lista {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 15px;
    .no-hay-proyectos {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        color: #ccc;
      }
    }
    .proyecto {
      height: 140px;
      min-height: 140px;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      text-decoration: none;
      border-bottom: 2px solid #fff;
      position: relative;
      @include ease-transition;
      &.cerrado {
        position: relative;
        overflow: hidden;
        &::before {
          position: absolute;
          left: -50px;
          top: -50px;
          content: 'Cerrado';
          background-color: #f00;
          @include minmaxwh(90px);
          -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
          display: flex;
          justify-content: center;
          align-items: flex-end;
          font-size: 65%;
          font-family: $fontKeepCalmMedium;
          text-transform: uppercase;
          color: #fff;
        }
      }
      &:hover {
        background-color: rgba($colorAzulClaro, 0.3);
      }
      .logo-ciudad {
        width: 30%;
        height: 70%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-right: 10px;
        padding-right: 10px;
        border-right: 1px solid #fff;
        .logo {
          @include minmaxwh(60px);
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          background-color: $colorGrisBase;
          @include sombra(0 0 2px 0 #222);
          margin-bottom: 7px;
          svg {
            color: #666;
            font-size: 150%;
          }
          img {
            width: 90%;
            height: 90%;
            object-fit: contain;
          }
        }
        .ciudad {
          span {
            text-transform: uppercase;
            font-size: 75%;
            color: #fff;
            font-family: $fontKeepCalmMedium;
          }
        }
        .provincia {
          span {
            text-transform: uppercase;
            font-size: 75%;
            color: #fff;
            font-family: $fontKeepCalmMedium;
          }
        }
        .fecha-fin {
          margin-top: 5px;
          span {
            text-transform: uppercase;
            font-size: 75%;
            color: #fff;
            font-family: $fontKeepCalmMedium;
          }
        }
      }
      .datos {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 70%;
        text-align: center;
        .nombre {
          span {
            text-transform: uppercase;
            font-size: 110%;
            color: #fff;
            font-family: $fontKeepCalmMedium;
            letter-spacing: 1px;
          }
        }
        .descripcion {
          span {
            font-size: 80%;
            color: #ccc;
            text-transform: uppercase;
          }
        }
        .monto {
          margin-top: 15px;
          span {
            font-size: 150%;
            color: #fff;
            margin: 0 4px;
            font-family: $fontKeepCalmMedium;
            &.de {
              font-size: 110%;
              text-transform: uppercase;
              margin: 0 10px;
              font-family: $fontUbuntuLight;
            }
          }
        }
      }
      .categoria {
        position: absolute;
        right: -40px;
        -webkit-transform: rotate(-90deg);
        transform: rotate(-90deg);
        background-color: #fff;
        height: 20px;
        width: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 7px 7px 0 0;
        span {
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          text-transform: uppercase;
          font-size: 80%;
          color: #000;
        }
      }
    }
  }
  a.new-project {
    position: absolute;
    bottom: 15px;
    right: 15px;
    @include minmaxwh(50px);
    background-color: $colorAzulClaro;
    @include sombra(0 0 3px 0 #000);
    z-index: 5;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.7;
    @include ease-transition;
    &:hover {
      opacity: 1;
    }
    svg {
      color: #fff;
    }
  }
}
</style>
