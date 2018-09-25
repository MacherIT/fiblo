<template lang="pug">
  .proyecto-show
    .nombre
      span NOMBRE: {{proyecto.nombre}}
    .monto
      span MONTO: {{proyecto.monto}}
    .monto-supera-max
      span MONTO-SUPERA-MAX: {{proyecto.montoSuperaMax}}
    .sector
      span SECTOR: {{proyecto.sector}}
    .emprendedores
      span EMPRENDEDORES: {{proyecto.emprendedores}}
    .pubdate
      span PUBDATE: {{proyecto.createdAt | formatDate('DD/MM/YYYY hh:mm')}}
</template>

<script>
export default {
  name: 'ShowProyecto',
  data() {
    return {
      proyecto: {},
    };
  },
  mounted() {
    this.$http({
      method: 'GET',
      url: `/api/proyectos/${this.$route.params.id}`,
    }).then(
      ({ data }) => {
        this.proyecto = data;
      },
      error => {
        console.error(error);
      },
    );
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
.proyecto-show {
  margin: 15px;
  display: flex;
  flex-direction: column;
}
</style>
