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
      .montos
        span Montos:
        .filtro.monto
          input(
            type="number"
            placeholder="MIN"
            v-model="filters.monto.val")
        .filtro.monto-supera-max
          input(
            type="number"
            placeholder="MAX"
            v-model="filters.montoSuperaMax.val")
    .seccion-lista
      router-link.proyecto(
        :to="'/proyectos/' + proyecto.id"
        v-for="proyecto in proyectosVisibles"
        :key="proyecto.id")
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
        .datos
          .nombre
            span {{proyecto.nombre}}
          .descripcion
            span "{{'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' | limitStr(30)}}"
          .monto
            span {{(proyecto.montoRecaudado * 100 / proyecto.monto).toFixed(2)}}%
            span.de de
            span ${{(valorCambio * proyecto.monto).toFixed(2)}}
        .categoria
          span {{proyecto.categoria.nombre}}
    router-link.new-project(to="/proyectos/new")
      font-awesome-icon(icon="plus")
</template>

<script>
import provincias from '@/assets/data/ciudades-argentinas.json';

import fiblo from '@/services/fiblo';

export default {
  name: 'ListaProyectos',
  data() {
    return {
      valorCambio: 0,
      provincia: '',
      provincias,
      proyectos: [],
      categorias: [],
      filters: {
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
            return item.montoSuperaMax <= this.val;
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
        this.proyectos = data.map(p => {
          p.montoRecaudado = 0;
          fiblo.getMontoRecaudado(p.address, (error, monto) => {
            if (error) {
              console.error(error);
            } else {
              p.montoRecaudado = monto;
            }
          });
          return p;
        });
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
    .proyecto {
      height: 130px;
      min-height: 130px;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      text-decoration: none;
      border-bottom: 2px solid #fff;
      position: relative;
      @include ease-transition;
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
