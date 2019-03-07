<template lang="pug">
  .proyectos
    .mis-proyectos
      .no-hay-proyectos(v-if="proyectos.length === 0 && loaded")
        span Todavía no creaste ningún proyecto
      router-link.proyecto(
        :to="'/proyectos/' + proyecto.id"
        v-for="proyecto in proyectos"
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
          .fecha-fin
            span {{moment(proyecto.fechaFin).format('DD/MM/YYYY')}}
        .datos
          .nombre
            span {{proyecto.nombre}}
          .descripcion
            span "{{proyecto.descripcion | limitStr(30)}}"
          .monto
            span {{((proyecto.montoRecaudado * valorCambio) * 100 / proyecto.monto).toFixed(2)}}%
            span.de de
            span ${{proyecto.monto.toFixed(2)}}
        router-link.editar(:to="'/proyectos/' + proyecto.id + '/edit'")
          font-awesome-icon(icon="pencil-alt")
        .categoria(
          :style="'background-color: ' + proyecto.categoria.color")
          span(
            :style="'color: ' + proyecto.categoria.colorTexto") {{proyecto.categoria.nombre}}
    router-link.new-project(to="/proyectos/new")
      font-awesome-icon(icon="plus")
</template>

<script>
import { mapState, mapActions } from 'vuex';
import moment from 'moment';

import fiblo from '@/services/fiblo';
import marketcap from '@/services/marketcap';

let valorCambio = 0;

export default {
  name: 'ListaProyectos',
  data() {
    return {
      loaded: false,
      moment,
      valorCambio: 0,
      proyectos: [],
    };
  },
  computed: {
    ...mapState('usuarios', ['token']),
  },
  mounted() {
    this.$http({
      method: 'GET',
      url: '/api/proyectos/mine',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
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
        this.loaded = true;
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
    this.setPageTitle('Mis proyectos');
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
  .mis-proyectos {
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
      a.editar {
        position: absolute;
        right: 50px;
        @include minmaxwh(45px);
        border-radius: 50%;
        background-color: $colorAzulMedio;
        display: flex;
        justify-content: center;
        align-items: center;
        @include sombra(0 0 3px 0 #333);
        @include ease-transition;
        cursor: pointer;
        z-index: 5;
        &:hover {
          background-color: $colorAzulClaro;
        }
        svg {
          color: #fff;
          font-size: 120%;
          @include ease-transition;
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
