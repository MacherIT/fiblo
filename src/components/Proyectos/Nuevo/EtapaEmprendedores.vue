<template lang="pug">
  .etapa-emprendedores
    form(
      @submit.prevent="addEmprendedor"
      novalidate)
      .titulo
        span Añadir emprendedores
      .nuevo-emprendedor
        .campo.avatar
          span Foto
          .holder
            .icon
              font-awesome-icon(icon="user")
              //- img(
              //-   src="@/assets/images/avatar.png")
            input(
              type="file"
              v-validate="''"
              data-vv-as="image"
              name="nombre"
              placeholder="Nombre")
        .campo
          span Nombre
          input(
            type="text"
            v-validate="'required'"
            name="nombre"
            v-model="nuevoEmprendedor.nombre"
            placeholder="Nombre")
        .campo
          span Apellido
          input(
            type="text"
            v-validate="'required'"
            name="apellido"
            v-model="nuevoEmprendedor.apellido"
            placeholder="Apellido")
        .campo
          span Rol
          input(
            type="text"
            v-validate="'required'"
            name="rol"
            v-model="nuevoEmprendedor.rol"
            placeholder="Rol")
        .add
          button(
            type="submit"
            :disabled="!validForm")
            font-awesome-icon(icon="plus")
    .lista-emprendedores
      .emprendedor(
        v-for="(emprendedor, index) in etapa.emprendedores"
        :key="emprendedor.nombre + emprendedor.apellido + emprendedor.rol")
        .atributo.avatar
          .holder
            font-awesome-icon(icon="user")
            //- img(
            //-   src="@/assets/images/avatar.png")
        .atributo.nombre
          span {{emprendedor.nombre}}
        .atributo.apellido
          span {{emprendedor.apellido}}
        .atributo.rol
          span {{emprendedor.rol}}
        .remove
          button(@click="removeEmprendedor(index)")
            font-awesome-icon(icon="times")
    .subm
      .loading(v-if="sent")
        font-awesome-icon(icon="circle-notch", spin)
      button(
        type="button"
        @click="setFields"
        :disabled="etapa.emprendedores.length <= 0") Siguiente
    BotonGenial(:go="go")
</template>

<script>
import BotonGenial from '@/components/General/BotonGenial';

export default {
  components: { BotonGenial },
  props: ['proyecto', 'set', 'setEtapaActiva'],
  data() {
    return {
      nuevoEmprendedor: {
        nombre: '',
        apellido: '',
        rol: '',
      },
      sent: false,
      etapa: {
        emprendedores:
          this.proyecto.emprendedores && this.proyecto.emprendedores.length > 0
            ? this.proyecto.emprendedores
            : [],
      },
    };
  },
  methods: {
    addEmprendedor() {
      this.etapa.emprendedores.push(this.nuevoEmprendedor);
      this.nuevoEmprendedor = {
        nombre: '',
        apellido: '',
        rol: '',
      };
    },
    setFields() {
      Object.keys(this.etapa).map(k => {
        this.set(k, this.etapa[k]);
      });
      this.setEtapaActiva(3);
    },
    go() {
      this.etapa = {
        emprendedores: [
          {
            nombre: 'Juan',
            apellido: 'Perez',
            rol: 'CEO',
          },
          {
            nombre: 'Pablo',
            apellido: 'Gomez',
            rol: 'CTO',
          },
          {
            nombre: 'Laura',
            apellido: 'Esquivel',
            rol: 'CFO',
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
.etapa-emprendedores {
  width: 100%;
  height: 100%;
  padding: 20px;
  form {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    .titulo {
      margin-bottom: 10px;
      span {
        color: #fff;
        text-transform: uppercase;
        font-family: $fontKeepCalmMedium;
        letter-spacing: 1px;
        font-size: 85%;
      }
    }
    .nuevo-emprendedor {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      .campo {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column;
        width: 32.333%;
        margin-right: 1%;
        &.avatar {
          width: 45px;
          align-items: center;
          .holder {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            @include minmaxwh(27px);
            border-radius: 50%;
            background-color: $colorPaletaC3;
            .icon {
              svg {
                color: $colorAzulClaro;
              }
            }
            input {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              z-index: 4;
              opacity: 0;
              cursor: pointer;
            }
          }
        }
        span {
          margin-bottom: 7px;
          color: #fff;
          text-transform: uppercase;
          font-family: $fontKeepCalmMedium;
          letter-spacing: 1px;
          font-size: 75%;
        }
        input {
          width: 100%;
          border: 0;
          border-radius: 5px;
          height: 27px;
          padding: 0 10px;
          font-family: $fontUbuntuRegular;
          font-size: 80%;
          &::placeholder {
            font-family: $fontUbuntuLight;
            text-transform: uppercase;
          }
        }
      }
      .add {
        @include minmaxwh(27px);
        button {
          width: 100%;
          height: 100%;
          border-radius: 3px;
          border: 0;
          font-size: 90%;
          background-color: $colorGrisBase;
          text-transform: uppercase;
          color: #999;
          font-weight: bold;
          @include ease-transition;
          opacity: 0.8;
          cursor: pointer;
          &:not(:disabled) {
            color: $colorBeigeBase;
            opacity: 1;
            &:hover {
              @include sombra(0 0 5px 0 #000);
            }
          }
        }
      }
    }
  }
  .lista-emprendedores {
    width: 100%;
    height: 100%;
    max-height: 270px;
    overflow: auto;
    margin: 20px 0;
    .emprendedor {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 45px;
      &:not(:last-of-type) {
        border-bottom: 1px solid #ccc;
      }
      .atributo {
        width: 32.33%;
        margin-right: 1%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        &.avatar {
          width: 45px;
          justify-content: center;
          .holder {
            align-items: center;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            @include minmaxwh(27px);
            border-radius: 50%;
            background-color: $colorPaletaC3;
            svg {
              color: $colorAzulClaro;
            }
          }
        }
        span {
          color: #fff;
          font-family: $fontUbuntuRegular;
        }
      }
      .remove {
        @include minmaxwh(27px);
        button {
          width: 100%;
          height: 100%;
          border-radius: 3px;
          border: 0;
          font-size: 90%;
          background-color: $colorGrisBase;
          text-transform: uppercase;
          color: #999;
          font-weight: bold;
          @include ease-transition;
          opacity: 0.8;
          cursor: pointer;
          &:not(:disabled) {
            color: $colorBeigeBase;
            opacity: 1;
            &:hover {
              @include sombra(0 0 5px 0 #000);
            }
          }
        }
      }
    }
  }
  .subm {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    .loading {
      margin-right: 10px;
      svg {
        color: $colorBeigeBase;
      }
    }
    button {
      height: 20px;
      padding: 0 30px;
      border-radius: 3px;
      border: 0;
      font-size: 90%;
      background-color: $colorGrisBase;
      text-transform: uppercase;
      color: #999;
      font-weight: bold;
      @include ease-transition;
      opacity: 0.8;
      cursor: pointer;
      &:not(:disabled) {
        color: $colorBeigeBase;
        opacity: 1;
        &:hover {
          @include sombra(0 0 5px 0 #000);
        }
      }
    }
  }
}
</style>
