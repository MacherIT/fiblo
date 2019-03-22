<template lang="pug">
  .etapa-emprendedores
    form(
      @submit.prevent="addEmprendedor"
      novalidate)
      .titulo
        span Añadir emprendedores
      .nuevo-emprendedor
        .columnas
          .columna.avatar
            .no-imagen(v-if="!nuevoEmprendedor.avatar")
              span {{archivoInvalido ? 'Archivo inválido' : 'Seleccionar avatar'}}
            input(
              type="file"
              accept="image/*"
              name="avatar"
              @change="setAvatar")
            img(v-show="nuevoEmprendedor.avatar")
          .columna.datos
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
          .columna.redes-sociales
            .campo
              span Facebook
              input(
                type="text"
                name="facebook"
                v-model="nuevoEmprendedor.facebook"
                placeholder="Facebook")
            .campo
              span Twitter
              input(
                type="text"
                name="twitter"
                v-model="nuevoEmprendedor.twitter"
                placeholder="Twitter")
            .campo
              span Linkedin
              input(
                type="text"
                name="linkedin"
                v-model="nuevoEmprendedor.linkedin"
                placeholder="Linkedin")
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
            font-awesome-icon(
              v-if="!emprendedor.avatar"
              icon="user")
            img(
              v-if="emprendedor.avatar"
              :src="emprendedor.avatar && typeof emprendedor.avatar === 'string' ? emprendedor.avatar : emprendedor.readAvatar ? emprendedor.readAvatar : ''")
        .atributo.nombre
          span {{emprendedor.nombre}}
        .atributo.apellido
          span {{emprendedor.apellido}}
        .atributo.rol
          span {{emprendedor.rol}}
        .atributo.redes-sociales
          a.red(
            :href="emprendedor.facebook || null"
            target="_blank"
            :class="{disabled: !emprendedor.facebook}")
            font-awesome-icon(:icon="['fab', 'facebook']")
          a.red(
            :href="emprendedor.twitter || null"
            target="_blank"
            :class="{disabled: !emprendedor.twitter}")
            font-awesome-icon(:icon="['fab', 'twitter']")
          a.red(
            :href="emprendedor.linkedin || null"
            target="_blank"
            :class="{disabled: !emprendedor.linkedin}")
            font-awesome-icon(:icon="['fab', 'linkedin']")
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
      archivoInvalido: false,
      nuevoEmprendedor: {
        readAvatar: '',
        avatar: false,
        nombre: '',
        apellido: '',
        rol: '',
        facebook: '',
        twitter: '',
        linkedin: '',
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
    setAvatar(ev) {
      this.archivoInvalido = false;
      if (ev.target.files && ev.target.files[0]) {
        if (new RegExp('image/*').test(ev.target.files[0].type)) {
          this.nuevoEmprendedor.avatar = ev.target.files[0];
          const fileReader = new FileReader();
          fileReader.onload = () => {
            document.querySelector('form .columnas .columna.avatar img').src = fileReader.result;
            this.nuevoEmprendedor.readAvatar = fileReader.result;
          };
          fileReader.readAsDataURL(ev.target.files[0]);
        } else {
          this.archivoInvalido = true;
        }
      } else {
        this.archivoInvalido = true;
      }
    },
    removeEmprendedor(index) {
      if (this.etapa.emprendedores[index]) {
        this.etapa.emprendedores.splice(index, 1);
      }
    },
    addEmprendedor() {
      this.etapa.emprendedores.push(this.nuevoEmprendedor);
      this.nuevoEmprendedor = {
        readAvatar: '',
        avatar: false,
        nombre: '',
        apellido: '',
        rol: '',
        facebook: '',
        twitter: '',
        linkedin: '',
      };
    },
    setFields() {
      this.etapa.emprendedores = this.etapa.emprendedores.map(e => ({ ...e, readAvatar: null }));
      Object.keys(this.etapa).map(k => {
        this.set(k, this.etapa[k]);
      });
      this.setEtapaActiva(3);
    },
    go() {
      this.etapa = {
        emprendedores: [
          {
            avatar: '/api/public/images/uploads/guy.jpg',
            nombre: 'Juan',
            apellido: 'Perez',
            rol: 'CEO',
            facebook: 'https://www.facebook.com/macherargentina/',
            linkedin: 'https://www.linkedin.com/company/macher-it/',
          },
          {
            nombre: 'Pablo',
            apellido: 'Gomez',
            rol: 'CTO',
            facebook: 'https://www.facebook.com/macherargentina/',
            twitter: 'https://twitter.com/machertec?lang=es',
            linkedin: 'https://www.linkedin.com/company/macher-it/',
          },
          {
            avatar: '/api/public/images/uploads/girl.jpg',
            nombre: 'Laura',
            apellido: 'Esquivel',
            rol: 'CFO',
            twitter: 'https://twitter.com/machertec?lang=es',
            linkedin: 'https://www.linkedin.com/company/macher-it/',
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
  height: auto;
  padding: 20px;
  // &::before,
  // &::after {
  //   content: '';
  //   height: 20px;
  //   width: 100%;
  //   display: block;
  // }
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
      align-items: center;
      flex-direction: column;
      width: 100%;
      .columnas {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin-bottom: 15px;
        .columna {
          width: 100%;
          margin-right: 10px;
          &.avatar {
            @include minmaxwh(120px);
            background-color: $colorAzulMedio;
            border: 5px solid #fff;
            @include sombra(0 0 2px 0 #333);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            position: relative;
            border-radius: 50%;
            overflow: hidden;
            .no-imagen {
              width: 80%;
              text-align: center;
              span {
                font-size: 90%;
                color: #eee;
                white-space: pre-line;
              }
            }
            input {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              opacity: 0;
              z-index: 5;
              cursor: pointer;
              border: 0;
              margin: 0;
            }
            img {
              width: 97%;
              height: 97%;
              object-fit: cover;
              border-radius: 50%;
            }
          }
          &.redes-sociales {
            margin-right: 0;
          }
          .campo {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            flex-direction: column;
            width: 100%;
            margin: 7px 0;
            span {
              margin-bottom: 3px;
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
        }
      }
      .add {
        height: 30px;
        width: 100%;
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
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 50%;
            }
          }
        }
        &.redes-sociales {
          display: flex;
          justify-content: space-around;
          align-items: center;
          width: 120px;
          .red {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #fff;
            @include minmaxwh(25px);
            cursor: pointer;
            border-radius: 50%;
            opacity: 0.6;
            @include ease-transition;
            &.disabled {
              cursor: not-allowed;
              svg {
                color: #888;
              }
            }
            &:hover:not(.disabled) {
              opacity: 1;
            }
            svg {
              color: #000;
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
