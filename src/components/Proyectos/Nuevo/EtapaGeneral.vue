<template lang="pug">
  .etapa-general
    //- .no-beneficiary-address(v-if="!etapa.beneficiary_address")
    //-   p
    //-     | No hay ninguna billetera de Ethereum asociada a tu cuenta, podes asociar una billetera desde la sección de
    //-     router-link(to="/usuarios") usuario
    
    //- v-if="etapa.beneficiary_address"
    
    form(
      @submit.prevent="setFields"
      novalidate
      name="formulario")
      .logo-nombre-categoria
        .logo
          .no-imagen(v-if="!etapa.logo")
            span {{archivoInvalido ? 'Archivo inválido' : 'Seleccionar logo'}}
          input(
            type="file"
            accept="image/*"
            name="logo"
            @change="setLogo")
          img(v-show="etapa.logo")
        .nombre-categoria
          .campo
            span Nombre del proyecto
            input(
              type="text"
              v-validate="'required'"
              name="nombre"
              v-model="etapa.nombre"
              placeholder="Nombre")
          .campo
            span Categoría
            select(
              name="categoria"
              v-model="etapa.categoria_id"
              v-validate="'required'")
              option(
                selected
                value=""
                disabled) -- Seleccionar categoría --
              option(
                v-for="categoria in categorias"
                :key="categoria.id"
                :value="categoria.id") {{categoria.nombre}}
      .half
        .campo
          span Provincia
          select(v-model="provincia")
            option(
              selected
              value=""
              disabled="") -- Provincia --
            option(
              v-for="provincia in provincias"
              :key="provincia.id"
              :value="provincia") {{provincia.nombre}}
        .campo
          span Ciudad
          select(
            v-model="etapa.ciudad"
            :disabled="!provincia")
            option(
              selected
              value=""
              disabled="") -- Ciudad --
            option(
              v-for="ciudad in provincia.ciudades"
              :key="ciudad.id"
              :value="{provincia: {id: provincia.id, nombre: provincia.nombre}, ciudad: ciudad}")
                | {{ciudad.nombre}}
      .campo
        span Domicilio
        input(
          type="text"
          placeholder="Domicilio"
          v-validate="'required'"
          name="domicilio"
          v-model="etapa.domicilio")
      .campo
        span Email
        input(
          type="text"
          placeholder="Email"
          v-validate="'required|email'"
          name="email"
          v-model="etapa.email")
      .campo
        span Se podrá invertir hasta el:
        input(
          type="date"
          v-model="etapa.fechaFin"
          :min="fechaMin"
          name="fechaFin"
          :max="fechaMax")
      .subm
        .loading(v-if="sent")
          font-awesome-icon(icon="circle-notch", spin)
        input(
          type="submit"
          value="Siguiente"
          :disabled="!validForm || sent || !fechaFinValida")
    BotonGenial(:go="go")
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import moment from "moment";

import BotonGenial from "@/components/General/BotonGenial";

import provincias from "@/assets/data/ciudades-argentinas.json";

const CANT_MAX_DIAS_RONDA = 90;

let beneficiary_address;

export default {
  components: { BotonGenial },
  props: ["proyecto", "set", "setEtapaActiva"],
  data() {
    return {
      archivoInvalido: false,
      // fechaMin: moment(new Date()).format('YYYY-MM-DD'),
      fechaMin: moment(new Date())
        .subtract(2, "days")
        .format("YYYY-MM-DD"),
      fechaMax: moment(new Date())
        .add(CANT_MAX_DIAS_RONDA, "days")
        .format("YYYY-MM-DD"),
      provincias,
      provincia:
        this.proyecto.ciudad && this.proyecto.ciudad.provincia
          ? this.proyecto.ciudad.provincia.id
          : "",
      categorias: [],
      sent: false,
      etapa: {
        // beneficiary_address: "",
        logo: false,
        nombre: this.proyecto.nombre ? this.proyecto.nombre : "",
        categoria_id: this.proyecto.categoria ? this.proyecto.categoria : "",
        ciudad:
          this.proyecto.ciudad && this.proyecto.ciudad.ciudad
            ? this.proyecto.ciudad.ciudad.id
            : "",
        domicilio: this.proyecto.domicilio ? this.proyecto.domicilio : "",
        email: this.proyecto.email ? this.proyecto.email : "",
        fechaFin: ""
      }
    };
  },
  mounted() {
    this.$http({
      method: "GET",
      url: "/api/categorias"
    }).then(
      ({ data }) => {
        this.categorias = data;
      },
      error => {
        console.error(error);
      }
    );
    // this.$http({
    //   method: "GET",
    //   url: `/api/usuarios/${this.usuario.id}/simple_data`,
    //   headers: {
    //     Authorization: `Bearer ${this.token}`
    //   }
    // }).then(
    //   ({ data }) => {
    //     beneficiary_address = data.address[0];
    //     this.etapa.beneficiary_address = data.address[0];
    //   },
    //   error => {
    //     console.error(error);
    //   }
    // );
  },
  computed: {
    ...mapState("usuarios", ["token"]),
    ...mapGetters("usuarios", ["usuario"]),
    fechaFinValida() {
      return (
        this.etapa.fechaFin &&
        moment(new Date(this.etapa.fechaFin)).isBetween(
          moment(new Date()).subtract(2, "days"),
          // moment(new Date()).subtract(1, 'days'),
          moment(new Date()).add(CANT_MAX_DIAS_RONDA, "days")
        )
      );
    }
  },
  methods: {
    ...mapActions("general", ["setPageTitle"]),
    setLogo(ev) {
      this.archivoInvalido = false;
      if (ev.target.files && ev.target.files[0]) {
        if (new RegExp("image/*").test(ev.target.files[0].type)) {
          this.etapa.logo = ev.target.files[0];
          const fileReader = new FileReader();
          fileReader.onload = () => {
            document.querySelector(
              "form .logo-nombre-categoria .logo img"
            ).src = fileReader.result;
          };
          fileReader.readAsDataURL(ev.target.files[0]);
        } else {
          this.archivoInvalido = true;
        }
      } else {
        this.archivoInvalido = true;
      }
    },
    setFields() {
      Object.keys(this.etapa).map(k => {
        this.set(k, this.etapa[k]);
      });
      this.setPageTitle(this.etapa.nombre);
      this.setEtapaActiva(1);
    },
    go() {
      this.provincia = this.provincias[0];
      this.etapa = {
        // beneficiary_address,
        logo: false,
        nombre: "Ejemplo",
        categoria_id: this.categorias[0].id,
        ciudad: {
          provincia: {
            id: this.provincias[0].id,
            nombre: this.provincias[0].nombre
          },
          ciudad: this.provincias[0].ciudades[0]
        },
        domicilio: "Calle 7 - 623 - Bariloche, Argentina",
        email: "proyecto-ejemplo@fiblo.com",
        fechaFin: moment(new Date())
          .add(30, "days")
          .format("YYYY-MM-DD")
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~Styles/_config.scss";
.etapa-general {
  width: 100%;
  height: auto;
  .no-beneficiary-address {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px;
    p {
      color: #fff;
      a {
        color: #fff;
        margin: 0 4px;
      }
    }
  }
  form {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    padding: 20px;
    .logo-nombre-categoria {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      width: 100%;
      margin-bottom: 15px;
      .logo {
        @include minmaxwh(120px);
        background-color: $colorAzulMedio;
        margin-right: 15px;
        border: 5px solid #fff;
        @include sombra(0 0 2px 0 #333);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;
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
          width: 90%;
          height: 90%;
          object-fit: cover;
        }
      }
      .nombre-categoria {
        width: 100%;
      }
    }
    .campo {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
      width: 100%;
      margin-bottom: 10px;
      span {
        margin-bottom: 7px;
        color: #fff;
        text-transform: uppercase;
        font-family: $fontKeepCalmMedium;
        letter-spacing: 1px;
        font-size: 75%;
      }
      input,
      select {
        width: 100%;
        border: 0;
        border-radius: 5px;
        height: 30px;
        padding: 0 10px;
        font-family: $fontUbuntuRegular;
        font-size: 80%;
        &::placeholder {
          font-family: $fontUbuntuLight;
          text-transform: uppercase;
        }
      }
    }
    .half {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-bottom: 15px;
      .campo {
        width: 49%;
        margin-bottom: 0;
      }
    }
    .subm {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: 100%;
      margin-top: 5px;
      .loading {
        margin-right: 10px;
        svg {
          color: $colorBeigeBase;
        }
      }
      input {
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
}
</style>
