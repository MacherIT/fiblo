<template lang="pug">
  .cnv
    //- span {{validProjects}}
    .proyectos
      .proyecto(
        v-for="project in projects"
        :key="project.id"
        v-if="project.address")
        .nombre
          span {{project.nombre}}
        .validar
          button(@click="validar(project)") Validar
        .invalidar
          button(@click="invalidar(project)") Invalidar
        .state
          button(@click="isProjectValid(project)") Check
          //- span {{project}}
</template>

<script>
import fiblo from '@/services/fiblo';

export default {
  data() {
    return {
      projects: [],
      validProjects: [],
    };
  },
  mounted() {
    this.$http({
      method: 'GET',
      url: '/api/proyectos',
    }).then(
      ({ data }) => {
        this.projects = data;
        this.getProjectsValidation();
        this.getProjectsInvalidation();
        // this.projects.map(p => {
        //   if (p.address) {
        //     this.isProjectValid(p);
        //   }
        // });
      },
      error => {
        console.error(error);
      },
    );
  },
  methods: {
    // isValid(address) {
    //   const p = this.validProjects.find(p => p.project === address && p.valid);
    //   return p && p.valid;
    // },
    getProjectsValidation() {
      fiblo.isProjectValidWatch((error, event) => {
        // if (this.validProjects.indexOf(event.args.project) < 0) {
        //   this.validProjects.push(event.args.project);
        // }
      });
    },
    getProjectsInvalidation() {
      fiblo.isProjectInvalidWatch((error, event) => {
        // if (this.validProjects.indexOf(event.args.project) >= 0) {
        //   this.validProjects.splice(this.validProjects.indexOf(event.args.project), 1);
        // }
      });
    },
    isProjectValid(project) {
      fiblo.isProjectValid(project.address, (error, resp) => {
        if (error) {
          console.error(error);
        } else {
          project.valid = resp;
          // console.log(resp);
        }
      });
    },
    validar(project) {
      fiblo.addProject(project.address, (error, resp) => {
        if (error) {
          console.error(error);
        } else {
          // this.isProjectValid(project);
        }
      });
    },
    invalidar(project) {
      fiblo.removeProject(project.address, (error, resp) => {
        if (error) {
          console.error(error);
        } else {
          // console.log(resp);
          // this.isProjectValid(project);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
.cnv {
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
