<template lang="pug">
  .mis-participaciones
    .suma-total
      .total.eth
        span Ξ {{cantTotalETH.toFixed(2)}}
      .total.ars
        span $ {{(cantTotalETH * valorCambio).toFixed(2)}}
      .total.acc
        span {{parseInt(cantTotalAcciones)}} acc
      .total.de
        span de
      .total.proyectos
        span {{cantTotalProyectos}} proyectos
    .lista-participaciones
      .no-hay-participaciones(v-if="cantTotalProyectos === 0")
        span Todavía no participaste en ningún proyecto
      ul(v-if="cantTotalProyectos > 0")
        li(
          v-for="(proyecto, key, index) in proyectos"
          :key="key"
          v-if="proyecto.misParticipaciones.fromList.length > 0")
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
              span Ξ {{(proyecto.misParticipaciones.montoETH).toFixed(2)}} ≈ $ {{(proyecto.misParticipaciones.montoETH * valorCambio).toFixed(2)}} ≈ {{parseInt(proyecto.misParticipaciones.acciones)}} acc
          .boton-transferir-tokens(
            v-if="proyecto.closedRound && proyecto.misParticipaciones.fromList.indexOf(defaultAccount) >= 0")
            button(
              title="Transferir acciones"
              @click="showPopupTransferirTokens(proyecto.address)")
              font-awesome-icon(icon="exchange-alt")
            TransferirTokens(
              v-if="transferAddress === proyecto.address"
              :proyectoAddress="proyecto.address"
              :accionesActuales="parseInt(proyecto.misParticipaciones.acciones)"
              :showPopupTransferirTokens="showPopupTransferirTokens"
              :initMisParticipaciones="initMisParticipaciones")
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import TransferirTokens from '@/components/Proyectos/TranferirTokens';

import fiblo from '@/services/fiblo';
import marketcap from '@/services/marketcap';

const txs = [];

export default {
  components: {
    TransferirTokens,
  },
  data() {
    return {
      proyectos: {},
      valorCambio: 0,
      transferAddress: '',
      defaultAccount: '',
    };
  },
  computed: {
    ...mapGetters('usuarios', ['usuario']),
    cantTotalProyectos() {
      return Object.keys(this.proyectos).reduce(
        (acumulador, p) => (this.proyectos[p].participaEnProyecto ? acumulador + 1 : acumulador),
        0,
      );
    },
    cantTotalAcciones() {
      return Object.keys(this.proyectos).reduce(
        (acumulador, p) => acumulador + this.proyectos[p].misParticipaciones.acciones,
        0,
      );
    },
    cantTotalETH() {
      return Object.keys(this.proyectos).reduce(
        (acumulador, p) => acumulador + this.proyectos[p].misParticipaciones.montoETH,
        0,
      );
    },
  },
  mounted() {
    this.initMisParticipaciones();
    this.setPageTitle('Mis participaciones');
  },
  methods: {
    ...mapActions('general', ['setPageTitle']),
    showPopupTransferirTokens(address) {
      this.transferAddress = address;
    },
    initMisParticipaciones() {
      fiblo.getDefaultAccount((error, account) => {
        if (error) {
          console.error(error);
        } else {
          this.defaultAccount = account;
        }
      });

      marketcap.getArs().then(
        monto => {
          this.valorCambio = monto;
        },
        error => {
          console.error(error);
          this.valorCambio = 4000;
        },
      );

      this.$http({
        method: 'GET',
        url: '/api/proyectos',
      }).then(
        ({ data }) => {
          this.proyectos = data.reduce(
            (acumulador, p) => ({
              ...acumulador,
              [p.id]: {
                ...p,
                closedRound: false,
                participaEnProyecto: false,
                misParticipaciones: {
                  fromList: [],
                  montoETH: 0,
                  acciones: 0,
                },
              },
            }),
            {},
          );
          Object.keys(this.proyectos).map(pid => {
            const p = this.proyectos[pid];
            fiblo.isProjectClosed(p.address, (error, closed) => {
              if (error) {
                console.error(error);
              } else {
                p.closedRound = closed;
                fiblo.getContribuciones(p.address, (error, tx) => {
                  if (error) {
                    console.error(error);
                  } else {
                    if (tx.args.uid.toNumber() === this.usuario.id) {
                      if (p.misParticipaciones.fromList.indexOf(tx.args.from) < 0)
                        p.misParticipaciones.fromList.push(tx.args.from);
                      p.misParticipaciones.montoETH += web3.fromWei(tx.args.amount).toNumber();
                      p.participaEnProyecto = true;
                      if (!closed) {
                        p.misParticipaciones.acciones +=
                          (web3.fromWei(tx.args.amount).toNumber() *
                            this.valorCambio *
                            p.cantAcciones) /
                          p.monto;
                      } else {
                        fiblo.balanceOf(p.address, tx.args.from, (error, balance) => {
                          if (error) {
                            console.error(error);
                          } else {
                            p.misParticipaciones.acciones = web3.fromWei(balance).toNumber();
                          }
                        });
                      }
                    }
                  }
                });
              }
            });
          });
        },
        error => {
          console.error(error);
        },
      );
    },
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
        position: relative;
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
        .boton-transferir-tokens {
          position: absolute;
          right: 0;
          top: 0;
          button {
            @include minmaxwh(40px);
            border: 0;
            background-color: $colorAzulClaro;
            @include ease-transition;
            cursor: pointer;
            border-radius: 4px;
            @include sombra(0 0 2px 0 #333);
            position: relative;
            &:hover {
              background-color: $colorAzulMedio;
            }
            svg {
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>
