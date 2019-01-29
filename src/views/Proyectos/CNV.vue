<template lang="pug">
  .cnv
    .beneficiaries
      .titulo
        span Beneficiarios
      .beneficiary(
        v-for="beneficiary in beneficiaries"
        :key="beneficiary.id"
        v-if="beneficiary.address")
        .nombre
          span {{beneficiary.nombre}}
        .validar
          button(@click="validarBeneficiary(beneficiary)") Validar
        .invalidar
          button(@click="invalidarBeneficiary(beneficiary)") Invalidar
        .state
          button(@click="isBeneficiaryValid(beneficiary)") Check
    .proyectos
      .titulo
        span Proyectos
      .proyecto(
        v-for="project in projects"
        :key="project.id"
        v-if="project.address")
        .nombre
          span {{project.nombre}}
        .validar
          button(@click="validarProyecto(project)") Validar
        .invalidar
          button(@click="invalidarProyecto(project)") Invalidar
        .state
          button(@click="isProjectValid(project)") Check
</template>

<script>
import fiblo from '@/services/fiblo';

export default {
  data() {
    return {
      projects: [],
      beneficiaries: [],
    };
  },
  mounted() {
    this.$http({
      method: 'GET',
      url: '/api/proyectos',
    }).then(
      ({ data }) => {
        this.projects = data;
      },
      error => {
        console.error(error);
      },
    );
    this.$http({
      method: 'GET',
      url: '/api/usuarios',
    }).then(
      ({ data }) => {
        this.beneficiaries = data;
      },
      error => {
        console.error(error);
      },
    );
  },
  methods: {
    isProjectValid(project) {
      fiblo.isProjectValid(project.address, (error, resp) => {
        if (error) {
          console.error(error);
        } else {
          project.valid = resp;
        }
      });
    },
    validarProyecto(project) {
      fiblo.addProject(project.address, (error, resp) => {
        if (error) {
          console.error(error);
        } else {
        }
      });
    },
    invalidarProyecto(project) {
      fiblo.removeProject(project.address, (error, resp) => {
        if (error) {
          console.error(error);
        } else {
        }
      });
    },
    isBeneficiaryValid(beneficiary) {
      fiblo.isBeneficiaryValid(beneficiary.address, (error, resp) => {
        if (error) {
          console.error(error);
        } else {
          beneficiary.valid = resp;
        }
      });
    },
    validarBeneficiary(beneficiary) {
      fiblo.addBeneficiary(beneficiary.address, (error, resp) => {
        if (error) {
          console.error(error);
        } else {
        }
      });
    },
    invalidarBeneficiary(beneficiary) {
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
  .beneficiaries {
    margin-bottom: 20px;
    .beneficiary {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      & > * {
        margin-right: 10px;
      }
    }
  }
  .proyectos {
    .proyecto {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      & > * {
        margin-right: 10px;
      }
    }
  }
}
</style>
