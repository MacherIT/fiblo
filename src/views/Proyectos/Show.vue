<template lang="pug">
  .proyecto-show
    .categoria
      span(v-if="proyecto.categoria") CATEGORÍA: {{proyecto.categoria.nombre}}
    .ciudad
      span(
        v-if="ciudad && ciudad.provincia")
        | CIUDAD: {{ciudad.provincia.nombre}} - {{ciudad.ciudad.nombre}}
    .nombre
      span NOMBRE: {{proyecto.nombre}}
    .monto
      span MONTO: ${{proyecto.monto}}
    .monto-supera-max
      span MONTO-SUPERA-MAX: ${{proyecto.montoSuperaMax}}
    .sector
      span SECTOR ¯\_(°_°)_/¯ {{proyecto.sector}}
    .emprendedores
      span EMPRENDEDORES:
      ul
        li(
          v-for="(emprendedor, index) in proyecto.emprendedores"
          :key="index") {{emprendedor.nombre}}
    .pubdate
      span CREACIÓN: {{proyecto.createdAt | formatDate('DD/MM/YYYY hh:mm')}}
</template>

<script>
export default {
  name: 'ShowProyecto',
  data() {
    return {
      proyecto: {},
    };
  },
  computed: {
    ciudad() {
      return this.proyecto && this.proyecto.ciudad ? JSON.parse(this.proyecto.ciudad) : '';
    },
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
