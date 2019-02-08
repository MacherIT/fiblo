<template lang="pug">
  .proyecto-show
    .info-general(v-if="proyecto")
      .categoria
        span {{proyecto.categoria.nombre}}
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
      .nombre
        span {{proyecto.nombre}}
      .descripcion
        span "{{'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' | limitStr(30)}}"
      .monto
        span {{(montoRecaudado * 100 / proyecto.monto).toFixed(2)}}%
        span.de de
        span ${{(valorCambio * proyecto.monto).toFixed(2)}}
    .cuerpo
      .tabs
        .tab.info(v-if="tabActiva === 'info'")
          .descripcion
            .titulo
              span Descripción
            .redes-sociales
              a.red.facebook(href="#", target="_blank")
                font-awesome-icon(:icon="['fab', 'facebook-f']")
              a.red.instagram(href="#", target="_blank")
                font-awesome-icon(:icon="['fab', 'instagram']")
              a.red.twitter(href="#", target="_blank")
                font-awesome-icon(:icon="['fab', 'twitter']")
              a.red.link(href="#", target="_blank")
                font-awesome-icon(icon="link")
            .contenido
              p Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          .propuesta
            .titulo
              span Propuesta
            .contenido
              p Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          .emprendedores
            .titulo
              span Emprendedores
            .lista
              ul
                li(
                  v-for="(emprendedor, index) in proyecto.emprendedores"
                  :key="index")
                  span {{emprendedor.nombre}}
        .tab.acciones(v-if="tabActiva === 'acciones'")
          .lista-acciones
            .no-hay-contribuciones(v-if="contribuciones.length === 0")
              span Todavía no hay contribuciones
            ul(v-if="contribuciones.length > 0")
              li(
                v-for="(contribucion, index) in contribuciones"
                :key="index")
                span {{contribucion}}
        .tab.participar(v-if="tabActiva === 'participar'")
          .compra-acciones
            .mismo-usuario(v-if="proyecto.usuario_id === usuario.id")
              span Un usuario no puede aportar a su propio proyecto
            form(@submit.prevent="comprarAccion", novalidate, v-if="proyecto.usuario_id !== usuario.id")
              .campo
                input(
                  type="number"
                  placeholder="2 ETH"
                  v-model="montoAccionETH"
                  @change="adjustMontos('ETH')"
                  :disabled="!projectValidity || !beneficiaryValidity")
                span ETH
              .campo
                input(
                  type="number"
                  placeholder="8.000 ARS"
                  v-model="montoAccionARS"
                  @change="adjustMontos('ARS')"
                  :disabled="!projectValidity || !beneficiaryValidity")
                span $
              .campo
                input(
                  type="number"
                  placeholder="200 acc"
                  v-model="montoAccionACC"
                  @change="adjustMontos('ACC')"
                  :disabled="!projectValidity || !beneficiaryValidity")
                span acc
              .subm
                button(
                  type="submit"
                  :disabled="!montoAccionETH || montoAccionETH <= 0 || sent")
                  font-awesome-icon(icon="play")
              .proyecto-invalido
                span(v-if="!projectValidity || !beneficiaryValidity") Proyecto todavía inválido
        .tab.dev(v-if="tabActiva === 'dev'")
          span projectValidity: {{projectValidity}}
          span beneficiaryValidity: {{beneficiaryValidity}}
          .sets
            button(@click="setProjectValidity") Set project validity
            button(@click="setBeneficiaryValidity") Set beneficiary validity
      .tab-menu
        .tab-item.info(
          :class="{active: tabActiva === 'info'}"
          @click="setTabActiva('info')")
          span Info
        .separador
        .tab-item.acciones(
          :class="{active: tabActiva === 'acciones'}"
          @click="setTabActiva('acciones')")
          span Acciones
        .separador
        .tab-item.participar(
          :class="{active: tabActiva === 'participar'}"
          @click="setTabActiva('participar')")
          span Participar
        .separador
        .tab-item.dev(
          :class="{active: tabActiva === 'dev'}"
          @click="setTabActiva('dev')")
          span Dev
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import fiblo from '@/services/fiblo';

const VALOR_ACCION = 50;

export default {
  name: 'ShowProyecto',
  data() {
    return {
      proyecto: false,
      contrato: {},
      projectValidity: false,
      beneficiaryValidity: false,
      sent: false,
      montoRecaudado: 0,
      montoAccionETH: '',
      montoAccionARS: '',
      montoAccionACC: '',
      valorCambio: 1,
      contribuciones: [],
      tabActiva: 'info',
    };
  },
  computed: {
    ...mapState('usuarios', ['token']),
    ...mapGetters('usuarios', ['usuario']),
    ciudad() {
      // return this.proyecto && this.proyecto.ciudad ? JSON.parse(this.proyecto.ciudad) : '';
      return '';
    },
  },
  mounted() {
    this.$http({
      method: 'GET',
      url: `/api/proyectos/${this.$route.params.id}`,
    }).then(
      ({ data }) => {
        this.proyecto = data;
        this.getMontoRecaudado();
        this.getContribuciones(this.proyecto.address);
        fiblo.projectValiditySet(this.proyecto.address, (error, res) => {
          if (error) {
            console.error(error);
          } else {
            this.projectValidity = res;
          }
        });
        fiblo.beneficiaryValiditySet(this.proyecto.address, (error, res) => {
          if (error) {
            console.error(error);
          } else {
            this.beneficiaryValidity = res;
          }
        });
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
  methods: {
    adjustMontos(prop) {
      if (prop === 'ETH') {
        this.montoAccionARS = this.montoAccionETH * this.valorCambio;
        this.montoAccionACC = (this.montoAccionETH * this.valorCambio) / VALOR_ACCION;
      } else if (prop === 'ARS') {
        this.montoAccionETH = this.montoAccionARS / this.valorCambio;
        this.montoAccionACC = this.montoAccionARS / this.valorCambio / VALOR_ACCION;
      } else {
        this.montoAccionARS = this.montoAccionACC * VALOR_ACCION;
        this.montoAccionETH = (this.montoAccionACC * VALOR_ACCION) / this.valorCambio;
      }
    },
    setTabActiva(tab) {
      this.tabActiva = tab;
    },
    getContribuciones(project_address) {
      fiblo.getContribuciones(project_address, (error, contribucion) => {
        if (error) {
          console.error(error);
        } else {
          this.contribuciones.push({
            uid: contribucion.args.uid.toNumber(),
            monto: window.web3.fromWei(contribucion.args.amount).toNumber(),
          });
        }
      });
    },
    comprarAccion() {
      if (parseFloat(this.montoAccionETH) > 0) {
        this.sent = true;
        fiblo.receiveFunds(
          this.proyecto.address,
          this.usuario.id,
          this.montoAccionETH,
          (error, tx) => {
            if (error) {
              console.error(error);
            } else {
              this.getMontoRecaudado();
              this.sent = false;
            }
          },
        );
      } else {
        this.$validator.validateAll();
      }
    },
    getMontoRecaudado() {
      fiblo.getMontoRecaudado(this.proyecto.address, (error, monto) => {
        if (error) {
          console.error(error);
        } else {
          this.montoRecaudado = monto;
        }
      });
    },
    setProjectValidity() {
      fiblo.setProjectValidity(this.proyecto.address, (error, res) => {
        console.log(res);
      });
    },
    setBeneficiaryValidity() {
      fiblo.setBeneficiaryValidity(this.proyecto.address, (error, res) => {
        console.log(res);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
.proyecto-show {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  position: relative;
  .info-general {
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
    .categoria {
      position: absolute;
      top: 0;
      background-color: #fff;
      height: 20px;
      width: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 0 0 7px 7px;
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
    .logo {
      @include minmaxwh(70px);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background-color: #fff;
      @include sombra(0 0 2px 0 #222);
      margin-bottom: 15px;
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
      margin-bottom: 7px;
      span {
        text-transform: uppercase;
        font-size: 95%;
        color: $colorAzulBase;
      }
    }
    .provincia {
      margin-bottom: 20px;
      span {
        text-transform: uppercase;
        font-size: 95%;
        color: $colorAzulBase;
      }
    }
    .nombre {
      margin-bottom: 20px;
      span {
        text-transform: uppercase;
        font-weight: bold;
        font-size: 150%;
        color: $colorAzulOscuro;
      }
    }
    .descripcion {
      span {
        font-size: 100%;
        color: $colorAzulOscuro;
      }
    }
    .monto {
      margin-top: 15px;
      display: flex;
      flex-direction: column;
      span {
        font-size: 200%;
        color: $colorAzulOscuro;
        font-weight: bold;
        margin: 4px 0;
        &.de {
          font-size: 130%;
          text-transform: uppercase;
          font-weight: lighter;
        }
      }
    }
  }
  .cuerpo {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .tabs {
      width: 100%;
      height: 90%;
      .tab {
        width: 100%;
        height: 100%;
        padding: 30px;
        overflow: auto;
        &.info {
          .titulo {
            margin: 15px 0;
            span {
              font-size: 150%;
              text-transform: uppercase;
              text-decoration: underline;
              color: #fff;
            }
          }
          .descripcion {
            .redes-sociales {
              display: flex;
              a.red {
                @include minmaxwh(30px);
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #fff;
                margin-right: 15px;
                border-radius: 50%;
                cursor: pointer;
                @include ease-transition;
                &:hover {
                  background-color: $colorAzulClaro;
                  svg {
                    color: #fff;
                  }
                }
                svg {
                  color: $colorAzulBase;
                  font-size: 120%;
                }
              }
            }
            .contenido {
              p {
                color: #fff;
              }
            }
          }
          .propuesta {
            .contenido {
              p {
                color: #fff;
              }
            }
          }
          .emprendedores {
            .lista {
              ul {
                li {
                  color: #fff;
                  span {
                  }
                }
              }
            }
          }
        }
        &.acciones {
          .lista-acciones {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-direction: column;
            .no-hay-contribuciones {
              span {
                color: #ccc;
              }
            }
            ul {
              li {
                span {
                }
              }
            }
          }
        }
        &.participar {
          .compra-acciones {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-direction: column;
            height: 100%;
            .mismo-usuario {
              span {
                color: #ccc;
              }
            }
            form {
              display: flex;
              justify-content: center;
              align-items: flex-start;
              flex-direction: column;
              position: relative;
              width: 100%;
              height: 100%;
              .campo {
                height: 33.333%;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                input {
                  height: 35px;
                  padding: 0 10px;
                  width: 200px;
                  margin-right: 7px;
                }
                span {
                  font-size: 125%;
                  color: #fff;
                }
              }
              .subm {
                position: absolute;
                right: 20px;
                button {
                  @include minmaxwh(80px);
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  background-color: $colorGrisBase;
                  border: 0;
                  border-radius: 50%;
                  @include ease-transition;
                  cursor: pointer;
                  &:disabled {
                    opacity: 0.5;
                    @include grayscale(1);
                  }
                  &:hover {
                    @include sombra(0 0 10px 0 #000);
                  }
                  svg {
                    color: $colorPaletaC9;
                    font-size: 180%;
                  }
                }
              }
              .proyecto-invalido {
                span {
                  color: #ccc;
                }
              }
            }
          }
        }
        &.dev {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          span {
            margin: 15px 0;
            color: #fff;
          }
          .sets {
            button {
            }
          }
        }
      }
    }
    .tab-menu {
      height: 10%;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      background-color: $colorAzulMedio;
      @include sombra(0 0 2px 0 #333);
      .tab-item {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        @include ease-transition;
        cursor: pointer;
        &.dev {
          max-width: 50px;
        }
        &:hover:not(.active) {
          background-color: rgba($colorAzulClaro, 0.6);
        }
        &.active {
          @include sombra(0 0 2px 0 #333);
          padding-bottom: 5px;
          background-color: $colorAzulClaro;
          position: relative;
          &::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 5px;
            top: -5px;
            left: 0;
            background-color: $colorAzulClaro;
            display: block;
          }
        }
        span {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          text-shadow: 1px 1px 0 #333;
          text-transform: uppercase;
        }
      }
      .separador {
        width: 1px;
        min-width: 1px;
        height: 80%;
        background-color: $colorAzulBase;
        display: block;
      }
    }
  }
}
</style>
