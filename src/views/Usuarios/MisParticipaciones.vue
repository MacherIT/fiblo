<template lang="pug">
  .mis-participaciones
    .suma-total
      .total.eth
        span Ξ {{totalParticipaciones.toFixed(2)}}
      .total.ars
        span $ {{(totalParticipaciones * valorCambio).toFixed(2)}}
      .total.acc
        span acc {{((totalParticipaciones * valorCambio) / valorAccion).toFixed(2)}}
      .total.de
        span de
      .total.proyectos
        span {{cantProyectos}} proyectos
    .lista-participaciones
      .no-hay-participaciones(v-if="Object.keys(proyectos).length === 0")
        span Todavía no participaste en ningún proyecto
      ul(v-if="Object.keys(proyectos).length > 0")
        li(
          v-for="(proyecto, key, index) in proyectos"
          :key="key"
          v-if="proyecto.misParticipaciones.length > 0")
          .logo-section
            .logo
              font-awesome-icon(
                icon="rocket"
                v-if="!proyecto.logo")
              img(
                :src="proyecto.logo"
                v-if="proyecto.logo")
          .datos
            .nombre
              span {{proyecto.nombre}}
            .address
              span {{proyecto.address | limitStr(10)}}
            .monto
              span Ξ {{(proyecto.totalMisParticipaciones).toFixed(2)}} ≈ $ {{(proyecto.totalMisParticipaciones * valorCambio).toFixed(2)}} ≈ ACC {{(proyecto.totalMisParticipaciones / valorAccion).toFixed(2)}}
</template>

<script>
import { mapGetters } from 'vuex';

import fiblo from '@/services/fiblo';

const VALOR_ACCION = 50;

export default {
  data() {
    return {
      proyectos: {},
      valorCambio: 0,
      valorAccion: VALOR_ACCION,
    };
  },
  computed: {
    ...mapGetters('usuarios', ['usuario']),
    totalParticipaciones() {
      return Object.keys(this.proyectos).reduce(
        (sumaProyectos, pid) =>
          sumaProyectos +
          this.proyectos[pid].misParticipaciones.reduce(
            (sumaLocal, participacion) =>
              sumaLocal + window.web3.fromWei(participacion.amount).toNumber(),
            0,
          ),
        0,
      );
    },
    cantProyectos() {
      return Object.keys(this.proyectos).filter(
        pid => this.proyectos[pid].misParticipaciones.length > 0,
      ).length;
    },
  },
  mounted() {
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

    this.$http({
      method: 'GET',
      url: '/api/proyectos',
    }).then(
      ({ data }) => {
        this.proyectos = data.reduce((output, p) => {
          output[p.id] = { ...p, misParticipaciones: [], totalMisParticipaciones: 0 };
          return output;
        }, {});
        data.map(p => {
          fiblo.getContribuciones(p.address, (error, tx) => {
            if (error) {
              console.error(error);
            } else {
              if (tx.args.uid.toNumber() === this.usuario.id) {
                this.proyectos[p.id].misParticipaciones.push(tx.args);
                this.proyectos[p.id].totalMisParticipaciones += window.web3
                  .fromWei(tx.args.amount)
                  .toNumber();
              }
            }
          });
        });
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
.mis-participaciones {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  position: relative;
  .suma-total {
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
    padding-top: 40px;
    text-align: center;
    position: relative;
    z-index: 3;
    .total {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 15px 0;
      &.de {
        span {
          font-family: $fontUbuntuLight;
        }
      }
      span {
        font-size: 150%;
        color: $colorAzulBase;
        font-family: $fontKeepCalmMedium;
      }
    }
  }
  .lista-participaciones {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    padding: 30px;
    width: 100%;
    .no-hay-participaciones {
      span {
        color: #ccc;
      }
    }
    ul {
      padding: 0;
      margin: 0;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
      li {
        list-style: none;
        width: 100%;
        height: auto;
        min-height: 100px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &:not(:last-of-type) {
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 2px solid #ccc;
        }
        .logo-section {
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 25%;
          min-width: 25%;
          .logo {
            @include minmaxwh(80px);
            background-color: $colorAzulClaro;
            @include sombra(1px 1px 2px 0 #000);
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            overflow: hidden;
            svg {
              color: #fff;
              font-size: 200%;
            }
            img {
              width: 90%;
              height: 90%;
              object-fit: contain;
            }
          }
        }
        .datos {
          width: 73%;
          min-width: 73%;
          .nombre {
            span {
              color: #fff;
              text-transform: uppercase;
              font-size: 110%;
              font-family: $fontKeepCalmMedium;
              letter-spacing: 1px;
            }
          }
          .address {
            span {
              color: #fff;
              font-family: $fontUbuntuLight;
              letter-spacing: 2px;
            }
          }
          .monto {
            margin-top: 15px;
            span {
              color: #fff;
              font-size: 160%;
              font-family: $fontUbuntuLight;
            }
          }
        }
      }
    }
  }
}
</style>
