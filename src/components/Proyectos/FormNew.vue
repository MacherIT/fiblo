<template lang="pug">
  .proyectos-form-new
    p Crear un nuevo proyecto
    form(@submit.prevent="crearProyecto", novalidate)
      .secciones
        .campos-base
          input(
            type="text"
            placeholder="Nombre"
            v-validate="'required'"
            name="nombre"
            v-model="proyecto.nombre")
          input(
            type="text"
            placeholder="Domicilio"
            v-validate="'required'"
            name="domicilio"
            v-model="proyecto.domicilio")
          input(
            type="text"
            placeholder="Telefono"
            v-validate="'required|numeric'"
            name="telefono"
            v-model="proyecto.telefono")
          input(
            type="email"
            placeholder="Email"
            v-validate="'required|email'"
            name="email"
            v-model="proyecto.email")
          input(
            type="text"
            placeholder="Monto esperado en ARS ($xx.xx)"
            v-validate="{required: true, decimal: 2}"
            name="monto"
            v-model="proyecto.monto")
          input(
            type="text"
            placeholder="Monto maximo de supersuscripción en ARS ($xx.xx)"
            v-validate="{required: true, decimal: 2, valorMax: proyecto.monto}"
            name="monto"
            v-model="proyecto.montoSuperaMax")
          span {{proyecto.montoSuperaMax ? errors.first('monto') : ''}}
        .emprendedores
          .titulo
            span Lista de emprendedores
          input(
            type="text"
            placeholder="Nombre y apellido"
            v-model="nuevoEmprendedor")
          button(
            @click="addEmprendedor()"
            :disabled="!nuevoEmprendedor"
            type="button") Añadir
          .lista-emprendedores
            .emprendedor(
              v-for="emprendedor in proyecto.emprendedores"
              :key="emprendedor.nombre")
              .nombre
                span {{emprendedor.nombre}}
              .quitar(@click="removeEmprendedor(emprendedor.nombre)")
                font-awesome-icon(icon="times")
      input(
        type="submit"
        value="Crear proyecto!"
        :disabled="!validForm || sent || proyecto.emprendedores.length === 0")
      .loading(v-if="sent")
        font-awesome-icon(icon="circle-notch", spin)
</template>

<script>
import { mapState } from 'vuex';
import { Validator } from 'vee-validate';
import mixins from '@/mixins/mixins';

Validator.extend('valorMax', {
  getMessage: () => 'El valor de supersuscripción debe ser mayor o igual que el monto esperado',
  validate: (value, [monto]) => parseFloat(value, 10) >= parseFloat(monto, 10),
});

export default {
  name: 'ProyectosFormNew',
  mixins: [mixins.FormValidation],
  data() {
    return {
      sent: false,
      nuevoEmprendedor: '',
      proyecto: {
        nombre: '',
        domicilio: '',
        telefono: '',
        email: '',
        monto: '',
        montoSuperaMax: '',
        sector: '',
        emprendedores: [],
      },
    };
  },
  computed: {
    ...mapState('usuarios', ['token']),
  },
  methods: {
    addEmprendedor() {
      if (!this.proyecto.emprendedores.find(e => e.nombre === this.nuevoEmprendedor)) {
        this.proyecto.emprendedores.push({ nombre: this.nuevoEmprendedor });
      }
      this.nuevoEmprendedor = '';
    },
    removeEmprendedor(nombre) {
      let index = -1;
      this.proyecto.emprendedores.map((e, i) => {
        if (e.nombre === nombre) {
          index = i;
        }
      });
      this.proyecto.emprendedores.splice(index, 1);
    },
    crearProyecto() {
      if (this.dirtyForm && this.validForm && this.proyecto.emprendedores.length > 0) {
        this.sent = true;
        this.$http({
          method: 'POST',
          url: '/api/proyectos',
          body: this.proyecto,
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }).then(
          ({ status }) => {
            this.sent = false;
            console.log(status);
          },
          error => {
            this.sent = false;
            console.error(error);
          },
        );
      } else {
        this.$validator.validateAll();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/config';
.proyectos-form-new {
  @include default-form;
  form {
    .secciones {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      width: 100%;
      .campos-base,
      .emprendedores {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        width: 50%;
        margin: 5px;
      }
      .emprendedores {
        .titulo {
          margin-bottom: 10px;
        }
        button {
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 6px;
          width: 100%;
          margin-bottom: 10px;
          margin: 0;
          width: 100%;
          background-color: #eee;
          border: 0;
          &:not(:disabled) {
            cursor: pointer;
            &:hover {
              background-color: #999;
            }
          }
        }
        .lista-emprendedores {
          margin-top: 5px;
          max-height: 135px;
          width: 100%;
          overflow: auto;
          padding: 0 3px;
          .emprendedor {
            padding: 6px;
            @include sombra(0 1px 2px 0 #bbb);
            width: 100%;
            margin: 6px 0;
            border-radius: 5px;
            position: relative;
            display: flex;
            justify-content: flex-start;
            align-content: center;
            .quitar {
              position: absolute;
              right: 0;
              color: #f66;
              padding: 0 10px;
              cursor: pointer;
              &:hover {
                color: #f33;
              }
            }
          }
        }
      }
    }
  }
}
</style>
