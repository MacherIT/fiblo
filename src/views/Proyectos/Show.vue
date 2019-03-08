<template lang="pug">
  .proyecto-show
    .info-general(v-if="proyecto")
      .categoria(
        :style="'background-color: ' + proyecto.categoria.color")
        span(
          :style="'color: ' + proyecto.categoria.colorTexto") {{proyecto.categoria.nombre}}
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
        span "{{proyecto.descripcion | limitStr(30)}}"
      .monto
        span {{((montoRecaudado * valorCambio) * 100 / proyecto.monto).toFixed(2)}}%
        span.de de
        span ${{proyecto.monto.toFixed(2)}}
      .fecha-fin
        span {{moment(proyecto.fechaFin).format('DD/MM/YYYY')}}
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
              p {{proyecto.descripcion}}
          .propuesta
            .titulo
              span Propuesta
            .contenido
              p {{proyecto.propuesta}}
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
            .no-hay-contribuciones(v-if="Object.keys(contribuciones).length === 0")
              span Todavía no hay contribuciones
            ul(v-if="Object.keys(contribuciones).length > 0")
              li(
                v-for="(contribucion, index) in orderByUser(contribuciones)"
                :key="index"
                :class="{propia: contribucion.user.id === usuario.id}")
                .avatar-section
                  .avatar
                    font-awesome-icon(
                      icon="user"
                      v-if="!contribucion.user.avatar")
                    img(
                      :src="contribucion.user.avatar"
                      v-if="contribucion.user.avatar")
                .datos
                  .nombre
                    span {{contribucion.user.nombre}}
                  .address
                    span(v-for="(address, index) in contribucion.from") {{address | limitStr(10)}}{{index !== contribucion.from.length - 1 ? ' / ' : ''}}
                  .monto
                    span Ξ {{(contribucion.monto).toFixed(2)}} ≈ $ {{(contribucion.monto * valorCambio).toFixed(2)}} ≈ ACC {{parseInt(contribucion.monto * valorCambio / valorAccion)}}
        .tab.participar(v-if="tabActiva === 'participar'")
          .compra-acciones
            .mismo-usuario(v-if="proyecto.usuario_id === usuario.id")
              span Un usuario no puede aportar a su propio proyecto
            form(@submit.prevent="comprarAccion", novalidate, v-if="proyecto.usuario_id !== usuario.id")
              .campo
                input(
                  type="number"
                  placeholder="2 Ξ"
                  v-model="montoAccionETH"
                  @change="adjustMontos('ETH')"
                  :disabled="!projectValidity || !beneficiaryValidity")
                span Ξ
              .campo
                input(
                  type="number"
                  placeholder="8.000 $"
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
              .aclaracion-acciones(v-if="projectValidity && beneficiaryValidity")
                span La cantidad de acciones real se computa una vez finalizada la ronda, el número indicado es estimativo y varía según la cotización del Ether.
              .proyecto-invalido
                span(v-if="!projectValidity || !beneficiaryValidity") Proyecto todavía inválido
        //- .tab.dev(v-if="tabActiva === 'dev'")
        //-   span projectValidity: {{projectValidity}}
        //-   span beneficiaryValidity: {{beneficiaryValidity}}
        //-   .sets
        //-     button(@click="setProjectValidity") Set project validity
        //-     button(@click="setBeneficiaryValidity") Set beneficiary validity
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
        //- .separador
        //- .tab-item.dev(
        //-   :class="{active: tabActiva === 'dev'}"
        //-   @click="setTabActiva('dev')")
        //-   span Dev
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import moment from 'moment';

import fiblo from '@/services/fiblo';
import marketcap from '@/services/marketcap';

export default {
  name: 'ShowProyecto',
  data() {
    return {
      moment,
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
      contribuciones: {},
      tabActiva: 'info',
      valorAccion: 0,
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
        this.valorAccion = this.proyecto.monto / this.proyecto.cantAcciones;
        this.setPageTitle(this.proyecto.nombre);
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
        if (error.status === 404) {
          this.$router.replace('/');
        }
      },
    );
    marketcap.getArs().then(
      monto => {
        this.valorCambio = monto;
      },
      error => {
        console.error(error);
        this.valorCambio = 4000;
      },
    );
  },
  methods: {
    ...mapActions('general', ['setPageTitle', 'setFlash']),
    adjustMontos(prop) {
      if (prop === 'ETH') {
        this.montoAccionARS = this.montoAccionETH * this.valorCambio;
        this.montoAccionACC = this.montoAccionARS / this.valorAccion;
      } else if (prop === 'ARS') {
        this.montoAccionETH = this.montoAccionARS / this.valorCambio;
        this.montoAccionACC = this.montoAccionARS / this.valorAccion;
      } else {
        this.montoAccionARS = this.montoAccionACC * this.valorAccion;
        this.montoAccionETH = this.montoAccionARS / this.valorCambio;
      }
    },
    getUserData() {
      Object.keys(this.contribuciones).map(uid => {
        if (Object.keys(this.contribuciones[uid].user).length === 1) {
          this.$http({
            method: 'GET',
            url: `/api/usuarios/${uid}/simple_data`,
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }).then(
            ({ data }) => {
              this.contribuciones[uid].user = { ...this.contribuciones[uid].user, ...data };
            },
            error => {
              console.error(error);
            },
          );
        }
      });
    },
    setTabActiva(tab) {
      this.tabActiva = tab;
    },
    getContribuciones(project_address) {
      fiblo.getContribuciones(project_address, (error, contribucion) => {
        if (error) {
          console.error(error);
        } else {
          if (!this.contribuciones[`${contribucion.args.uid.toNumber()}`]) {
            this.contribuciones[`${contribucion.args.uid.toNumber()}`] = {
              user: {
                id: contribucion.args.uid.toNumber(),
              },
              monto: 0,
              from: [],
            };
          }
          if (
            this.contribuciones[`${contribucion.args.uid.toNumber()}`].from.indexOf(
              contribucion.args.from,
            ) < 0
          ) {
            this.contribuciones[`${contribucion.args.uid.toNumber()}`].from.push(
              contribucion.args.from,
            );
          }
          this.contribuciones[`${contribucion.args.uid.toNumber()}`].monto += window.web3
            .fromWei(contribucion.args.amount)
            .toNumber();
          this.getUserData();
        }
      });
    },
    orderByUser(contribuciones) {
      const outArr = Object.keys(contribuciones).map(c => contribuciones[c]);
      outArr.sort((c1, c2) => (c1.user.id === this.usuario.id ? -1 : 1));
      return outArr;
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
              this.setFlash({
                tipo: 'error',
                mensaje: 'Ocurrió un error al transferir los fondos.',
              });
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
      span {
        text-transform: uppercase;
        font-size: 70%;
        color: $colorAzulBase;
      }
    }
    .provincia {
      margin-bottom: 20px;
      span {
        text-transform: uppercase;
        font-size: 70%;
        color: $colorAzulBase;
      }
    }
    .nombre {
      margin-bottom: 20px;
      span {
        text-transform: uppercase;
        font-size: 150%;
        color: $colorAzulOscuro;
        font-family: $fontKeepCalmMedium;
      }
    }
    .descripcion {
      span {
        font-size: 85%;
        color: $colorAzulMedio;
        text-transform: uppercase;
      }
    }
    .monto {
      margin-top: 15px;
      display: flex;
      flex-direction: column;
      span {
        font-size: 200%;
        color: $colorAzulOscuro;
        font-family: $fontKeepCalmMedium;
        margin: 4px 0;
        &.de {
          font-size: 130%;
          text-transform: uppercase;
          margin: 10px;
          font-family: $fontUbuntuLight;
        }
      }
    }
    .fecha-fin {
      margin-top: 20px;
      span {
        text-transform: uppercase;
        font-size: 150%;
        color: $colorAzulBase;
        font-family: $fontKeepCalmMedium;
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
              font-size: 125%;
              text-transform: uppercase;
              text-decoration: underline;
              color: #fff;
              font-family: $fontKeepCalmMedium;
              letter-spacing: 2px;
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
                font-size: 85%;
                letter-spacing: 1px;
                font-family: $fontUbuntuLight;
                line-height: 1.3;
              }
            }
          }
          .propuesta {
            .contenido {
              p {
                color: #fff;
                font-size: 85%;
                letter-spacing: 1px;
                font-family: $fontUbuntuLight;
                line-height: 1.3;
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
                overflow: hidden;
                &.propia {
                  &::after {
                    position: absolute;
                    right: -30px;
                    top: -30px;
                    content: 'Propia';
                    background-color: $colorPaletaC4;
                    @include minmaxwh(60px);
                    -webkit-transform: rotate(45deg);
                    transform: rotate(45deg);
                    display: flex;
                    justify-content: center;
                    align-items: flex-end;
                    font-size: 65%;
                    font-family: $fontKeepCalmMedium;
                    text-transform: uppercase;
                  }
                }
                &:not(:last-of-type) {
                  margin-bottom: 15px;
                  padding-bottom: 15px;
                  border-bottom: 2px solid #ccc;
                }
                .avatar-section {
                  height: 100%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 25%;
                  min-width: 25%;
                  .avatar {
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
                      font-size: 500%;
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
              .aclaracion-acciones,
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
          text-shadow: 1px 1px 0 #444;
          text-transform: uppercase;
          font-family: $fontUbuntuRegular;
          font-weight: bold;
          font-size: 90%;
          letter-spacing: 1px;
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
