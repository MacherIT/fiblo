<template lang="pug">
  .proyectos
    .seccion-filtros
      .titulo
        span Filtros
      .filtros
        .campo-ciudades
          select(v-model="provincia")
            option(selected, value="") -- Provincia --
            option(
              v-for="provincia in provincias"
              :key="provincia.id"
              :value="provincia") {{provincia.nombre}}
          select(v-model="filters.ciudad.val", :disabled="!provincia")
            option(selected, value="") -- Ciudad --
            option(
              v-for="ciudad in provincia.ciudades"
              :key="ciudad.id"
              :value="ciudad.id")
                | {{ciudad.nombre}}
        .categoria
          select(v-model="filters.categoria.val")
            option(selected, value="") -- Categoria --
            option(
              v-for="categoria in categorias"
              :key="categoria.id"
              :value="categoria.id") {{categoria.nombre}}
        .nombre
          input(
            type="text"
            placeholder="NOMBRE / EMPRENDEDORES"
            v-model="filters.nombreEmp.val")
        .monto
          input(
            type="number"
            placeholder="MONTO MINIMO"
            v-model="filters.monto.val")
        .monto-supera-max
          input(
            type="number"
            placeholder="MONTO MÁXIMO"
            v-model="filters.montoSuperaMax.val")
        //- .pubdate
        //-   input(type="date", placeholder="FECHA DE PUBLICACIÓN")
    .seccion-lista
      .titulo
        span Proyectos
      .lista
        .proyecto
          .nombre
            strong CATEGORÍA
          .nombre
            strong NOMBRE
          .monto
            strong MONTO MINIMO
          .monto-supera-max
            strong MONTO MÁXIMO
          .pubdate
            strong FECHA DE PUBLICACIÓN
        router-link.proyecto(
          :to="{path: '/proyectos/' + proyecto.id}"
          v-for="proyecto in proyectosVisibles"
          :key="proyecto.id")
          .categoria
            span {{proyecto.categoria.nombre}}
          .nombre
            span {{proyecto.nombre}}
          .monto
            span ${{proyecto.monto}}
          .monto-supera-max
            span ${{proyecto.montoSuperaMax}}
          .pubdate
            span {{proyecto.createdAt | formatDate('DD/MM/YYYY hh:mm')}}
</template>

<script>
import provincias from '@/assets/data/ciudades-argentinas.json';

export default {
  name: 'ListaProyectos',
  data() {
    return {
      provincia: '',
      provincias,
      proyectos: [],
      categorias: [],
      filters: {
        ciudad: {
          fun(item) {
            return item.ciudad && JSON.parse(item.ciudad).ciudad.id === this.val;
          },
          val: '',
        },
        categoria: {
          fun(item) {
            return item.categoria_id === this.val;
          },
          val: '',
        },
        nombreEmp: {
          fun(item) {
            return (
              item.nombre.indexOf(this.val) >= 0 ||
              item.emprendedores.some(emp => emp.nombre.indexOf(this.val) >= 0)
            );
          },
          val: '',
        },
        monto: {
          fun(item) {
            return item.monto >= this.val;
          },
          val: '',
        },
        montoSuperaMax: {
          fun(item) {
            return item.montoSuperaMax <= this.val;
          },
          val: '',
        },
      },
    };
  },
  computed: {
    proyectosVisibles() {
      return this.proyectos.filter(proyecto =>
        Object.keys(this.filters).every(
          k => (this.filters[k].val ? this.filters[k].fun(proyecto) : true),
        ),
      );
    },
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
    this.$http({
      method: 'GET',
      url: '/api/categorias',
    }).then(
      ({ data }) => {
        this.categorias = data;
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
.proyectos {
  display: flex;
  .seccion-filtros {
    width: 30%;
    padding: 0 15px;
    margin-right: 15px;
    border-right: 1px solid #ccc;
    .filtros {
      display: flex;
      flex-direction: column;
      width: 100%;
      & > div {
        width: 25%;
        margin: 10px 0;
        width: 100%;
        input,
        select {
          background-color: #fff;
          border: 1px solid #ccc;
          padding: 5px;
          width: 100%;
        }
      }
    }
  }
  .seccion-lista {
    width: 70%;
    .lista {
      display: flex;
      flex-direction: column;
      .proyecto {
        display: flex;
        justify-content: space-around;
        align-content: center;
        padding: 8px 0;
        width: 100%;
        text-decoration: none;
        color: #000;
        text-transform: uppercase;
        background-color: #fff;
        @include ease-transition();
        & > div {
          width: 25%;
        }
        &:not(:last-of-type) {
          border-bottom: 1px solid #ccc;
        }
        &:hover {
          background-color: #ccc;
        }
      }
    }
  }
}
</style>
