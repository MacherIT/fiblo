<template lang="pug">
  .cnv
    TourCNV(
      :setTabActiva="setTabActiva"
      v-if="!tour.cnv && projects.length > 0 && beneficiaries.length > 0")
    .tabs
      .section.cnv(v-if="tabActiva === 0")
        .titulo
          span CNV
        .contenido.beneficiaries
          .titulo
            span Beneficiarios
          .lista
            .item.beneficiary(
              v-for="beneficiary in beneficiaries"
              :key="beneficiary.id"
              v-if="beneficiary.address")
              .nombre
                span {{beneficiary.nombre}}
              .boton.validar
                button(@click="cnvValidarBeneficiary(beneficiary)") Validar
              .boton.invalidar
                button(@click="cnvInvalidarBeneficiary(beneficiary)") Invalidar
              .state.is-beneficiary-valid(:class="{valid: beneficiary.valid}") b
        .contenido.proyectos
          .titulo
            span Proyectos
          .lista
            .item.proyecto(
              v-for="project in projects"
              :key="project.id"
              v-if="project.address")
              .nombre
                span {{project.nombre}}
              .boton.validar
                button(@click="cnvValidarProyecto(project)") Validar
              .boton.invalidar
                button(@click="cnvInvalidarProyecto(project)") Invalidar
              .state.is-project-valid(:class="{valid: project.valid}") p
      .section.admin(v-if="tabActiva === 1")
        .titulo
          span ADMIN
        .contenido.proyectos
          .titulo
            span Proyectos
          .lista
            .item.proyecto(
              v-for="project in projects"
              :key="project.id"
              v-if="project.address")
              .nombre
                span {{project.nombre}}
              .boton.validar
                button(@click="adminValidarProyecto(project)") Validar proyecto
              .boton.invalidar
                button(@click="adminValidarBeneficiary(project)") Validar beneficiario
              .boton.close-round
                button(@click="closeRound(project)") Close Round
              .state.is-project-valid(:class="{valid: project.selfValidatedByCNV}") v
              .state.is-beneficiary-valid(:class="{valid: project.beneficiaryValidatedByCNV}") b
              .state.is-project-closed(:class="{valid: !project.closedRound}") c
    .tab-menu
      .tab-button(
        @click="setTabActiva(0)"
        :class="{active: tabActiva === 0}")
        span CNV
      .tab-button(
        @click="setTabActiva(1)"
        :class="{active: tabActiva === 1}")
        span ADMIN
</template>

<script>
import { mapState } from 'vuex';

import TourCNV from '@/components/General/Tour/CNV';

import fiblo from '@/services/fiblo';

export default {
  components: {
    TourCNV,
  },
  data() {
    return {
      projects: [],
      beneficiaries: [],
      tabActiva: 0,
    };
  },
  computed: {
    ...mapState('tour', ['tour']),
    ...mapState('usuarios', ['token']),
  },
  mounted() {
    this.$http({
      method: 'GET',
      url: '/api/proyectos',
    }).then(
      ({ data }) => {
        this.projects = data.map(p => ({
          ...p,
          closedRound: false,
          valid: false,
          selfValidatedByCNV: false,
          beneficiaryValidatedByCNV: false,
        }));
        this.projects.map(p => {
          fiblo.isProjectClosed(p.address, (error, closed) => {
            if (error) {
              console.error(error);
            } else {
              p.closedRound = closed;
            }
          });
          fiblo.isProjectValid(p.address, (error, valid) => {
            if (error) {
              console.error(error);
            } else {
              p.valid = valid;
            }
          });
          fiblo.projectValiditySet(p.address, (error, valid) => {
            if (error) {
              console.error(error);
            } else {
              p.selfValidatedByCNV = valid;
            }
          });
          fiblo.beneficiaryValiditySet(p.address, (error, valid) => {
            if (error) {
              console.error(error);
            } else {
              p.beneficiaryValidatedByCNV = valid;
            }
          });
        });
      },
      error => {
        console.error(error);
      },
    );
    this.$http({
      method: 'GET',
      url: '/api/usuarios',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    }).then(
      ({ data }) => {
        console.log(data);
        this.beneficiaries = data.map(b => ({ ...b, valid: false }));
        this.beneficiaries.map(b => {
          fiblo.isBeneficiaryValid(b.address, (error, valid) => {
            if (error) {
              console.error(error);
            } else {
              b.valid = valid;
            }
          });
        });
      },
      error => {
        console.error(error);
      },
    );
  },
  methods: {
    setTabActiva(index) {
      this.tabActiva = index;
    },
    cnvValidarProyecto(project) {
      fiblo.addProject(project.address, (error, resp) => {
        if (error) {
          console.error(error);
        } else {
        }
      });
    },
    adminValidarProyecto(project) {
      console.log(project.address);
      fiblo.setProjectValidity(project.address, (error, resp) => {
        if (error) {
          console.error(error);
        } else {
        }
      });
    },
    cnvInvalidarProyecto(project) {
      fiblo.removeProject(project.address, (error, resp) => {
        if (error) {
          console.error(error);
        } else {
        }
      });
    },
    closeRound(project) {
      fiblo.closeRound(project.address, (error, resp) => {
        if (error) {
          console.error(error);
        } else {
        }
      });
    },
    cnvValidarBeneficiary(beneficiary) {
      fiblo.addBeneficiary(beneficiary.address, (error, resp) => {
        if (error) {
          console.error(error);
        } else {
        }
      });
    },
    adminValidarBeneficiary(project) {
      fiblo.setBeneficiaryValidity(project.address, (error, resp) => {
        if (error) {
          console.error(error);
        } else {
        }
      });
    },
    cnvInvalidarBeneficiary(beneficiary) {
      fiblo.removeBeneficiary(beneficiary.address, (error, resp) => {
        if (error) {
          console.error(error);
        } else {
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
.cnv {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .tabs {
    width: 100%;
    height: 90%;
    min-height: 90%;
    .state {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #000;
      font-size: 80%;
      @include minmaxwh(15px);
      border-radius: 50%;
      background-color: #f00;
      margin-left: 7px;
      &.valid {
        background-color: #0f0;
      }
    }
    .section {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
      overflow: auto;
      & > .titulo {
        margin: 15px 0;
        text-align: center;
        width: 100%;
        span {
          font-size: 150%;
          color: #fff;
          font-family: $fontKeepCalmMedium;
        }
      }
      .contenido {
        padding: 15px;
        .titulo {
          margin-bottom: 15px;
          span {
            text-decoration: underline;
            color: #fff;
            font-family: $fontKeepCalmMedium;
          }
        }
        .lista {
          .item {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .nombre {
              width: 200px;
              margin-right: 10px;
              span {
                text-decoration: none;
                color: #fff;
                white-space: pre-line;
              }
            }
            .boton {
              margin: 10px 5px;
              button {
                background-color: $colorAzulClaro;
                color: #fff;
                font-family: $fontKeepCalmMedium;
                text-transform: uppercase;
                font-size: 75%;
                border: 0;
                border-radius: 4px;
                height: 30px;
                width: 100px;
                display: flex;
                justify-content: center;
                align-items: center;
                @include ease-transition;
                cursor: pointer;
                &:hover {
                  background-color: $colorAzulMedio;
                }
              }
            }
          }
        }
      }
    }
  }
  .tab-menu {
    width: 100%;
    height: 10%;
    min-height: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $colorAzulMedio;
    .tab-button {
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
  }
}
</style>
