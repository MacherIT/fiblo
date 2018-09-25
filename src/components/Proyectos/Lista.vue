<template lang="pug">
  .proyectos-lista
    router-link.proyecto(
      :to="{path: '/proyectos/' + proyecto.id}"
      v-for="proyecto in proyectos"
      :key="proyecto.id")
      .nombre
        span {{proyecto.nombre}}
      .monto
        span {{proyecto.monto}}
      .pubdate
        span {{proyecto.createdAt | formatDate('DD/MM/YYYY hh:mm')}}
</template>

<script>
export default {
  name: 'ListaProyectos',
  data() {
    return {
      proyectos: [],
    };
  },
  mounted() {
    this.$http({
      method: 'GET',
      url: '/api/proyectos',
    }).then(
      ({ data }) => {
        this.proyectos = data;
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
.proyectos-lista {
  display: flex;
  flex-direction: column;
  margin: 15px;
  padding: 15px;
  .proyecto {
    display: flex;
    justify-content: space-around;
    align-content: center;
    padding: 8px;
    width: 100%;
    text-decoration: none;
    color: #000;
    text-transform: uppercase;
    background-color: #fff;
    @include ease-transition();
    &:not(:last-of-type) {
      border-bottom: 1px solid #ccc;
    }
    &:hover {
      background-color: #ccc;
    }
  }
}
</style>
