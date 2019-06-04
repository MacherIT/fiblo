<template lang="pug">
  .profile
    .presentacion
      PresentacionFiblo
    .usuario
      form(
        @submit.prevent="updateUsuario"
        novalidate)
        .avatar-campos
          .avatar
            .no-imagen(v-if="!myAvatar")
              span {{archivoInvalido ? 'Archivo inválido' : 'Seleccionar avatar'}}
            input(
              type="file"
              accept="image/*"
              name="avatar"
              @change="setAvatar")
            img(
              :src="myAvatarData ? myAvatarData : '/api/' + myAvatar"
              v-show="myAvatar")
          .campos
            .campo.email
              span Email
              .inputlike
                span {{usuario.email}}
            .campo.nombre
              span Nombre
              input(
                type="text",
                v-validate="'required'"
                v-model="myNombre"
                name="nombre"
                placeholder="Nombre")
        .subm
          .loading(v-if="sent")
            font-awesome-icon(icon="circle-notch", spin)
          input(
            type="submit"
            value="Guardar"
            :disabled="sent || !validForm")
      //- .address
      //-   span(v-if="!myAddress") Todavía no hay una dirección de Ethereum asociada a tu cuenta, ¿querés asociar esta dirección a la cuenta actual?
      //-   span(v-if="myAddress") Tu dirección asociada
      //-   .input-asoc
      //-     input(
      //-       type="text"
      //-       :value="myAddress ? myAddress : defaultAccount"
      //-       readonly
      //-       disabled)
      //-     button(
      //-       v-if="!myAddress"
      //-       @click="asociar") Asociar
      //-   .sent
      //-     .loading(v-if="sent")
      //-       font-awesome-icon(icon="circle-notch", spin)
      .cerrar-sesion
        button(@click="logout()") Cerrar sesión
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

import fiblo from "@/services/fiblo";

import PresentacionFiblo from "@/components/General/PresentacionFiblo";

export default {
  components: {
    PresentacionFiblo
  },
  data() {
    return {
      archivoInvalido: false,
      myAvatar: "",
      myAvatarData: "",
      myNombre: "",
      myAddress: [],
      defaultAccount: "",
      sent: false
    };
  },
  mounted() {
    this.setPageTitle("Mi perfil");
    this.$http({
      method: "GET",
      url: `/api/usuarios/${this.usuario.id}/simple_data`,
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).then(
      ({ data }) => {
        this.myAddress = data.address[0];
        this.myNombre = data.nombre;
        this.myAvatar = data.avatar;
      },
      error => {
        console.error(error);
      }
    );
    fiblo.getDefaultAccount((error, account) => {
      if (error) {
        console.error(error);
      } else {
        this.defaultAccount = account;
      }
    });
  },
  computed: {
    ...mapState("usuarios", ["token"]),
    ...mapGetters("usuarios", ["usuario"])
  },
  methods: {
    ...mapActions("usuarios", ["logout"]),
    ...mapActions("general", ["setPageTitle"]),
    updateUsuario() {
      this.sent = true;
      const saveUsuario = () => {
        console.log("aca");
        this.$http({
          method: "PUT",
          url: "/api/usuarios",
          body: Object.assign(
            {},
            { nombre: this.myNombre },
            this.myAvatar && { avatar: this.myAvatar }
          ),
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }).then(
          ({ status }) => {
            this.sent = false;
            if (status === 200) {
              window.location.reload();
            }
          },
          error => {
            console.error(error);
            this.sent = false;
          }
        );
      };
      if (this.myNombre) {
        if (
          this.myAvatar &&
          typeof this.myAvatar === "object" &&
          this.myAvatar.type &&
          new RegExp("image/*").test(this.myAvatar.type)
        ) {
          const formData = new FormData();
          formData.append("imagenes", this.myAvatar);
          this.$http({
            method: "POST",
            url: "/api/upload",
            body: formData,
            headers: {
              Authorization: `Bearer ${this.token}`
            }
          }).then(
            ({ data }) => {
              this.myAvatar = data[0].uri;
              saveUsuario();
            },
            error => {
              console.error(error);
            }
          );
        } else {
          saveUsuario();
        }
      }
    },
    setAvatar(ev) {
      this.archivoInvalido = false;
      if (ev.target.files && ev.target.files[0]) {
        if (new RegExp("image/*").test(ev.target.files[0].type)) {
          this.myAvatar = ev.target.files[0];
          const fileReader = new FileReader();
          fileReader.onload = () => {
            this.fields.nombre.dirty = true;
            this.myAvatarData = fileReader.result;
          };
          fileReader.readAsDataURL(ev.target.files[0]);
        } else {
          this.archivoInvalido = true;
        }
      } else {
        this.archivoInvalido = true;
      }
    },
    asociar() {
      if (this.defaultAccount && (!this.myAddress || !this.myAddress[0])) {
        this.$http({
          method: "PUT",
          url: "/api/usuarios/set_address",
          body: {
            address: this.defaultAccount
          },
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }).then(
          ({ status }) => {
            this.sent = false;
            if (status === 200) {
              this.myAddress = [this.defaultAccount];
              this.defaultAccount = "";
            }
          },
          error => {
            console.error(error);
            this.sent = false;
          }
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~Styles/config";
.profile {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  .presentacion {
    width: 50%;
    height: 100%;
  }
  .usuario {
    height: 100%;
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    form {
      width: 100%;
      padding: 0 15px;
      margin-bottom: 20px;
      .avatar-campos {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        margin-bottom: 7px;
        .avatar {
          @include minmaxwh(110px);
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
          margin-right: 15px;
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
        .campos {
          width: 100%;
          .campo {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            flex-direction: column;
            margin-bottom: 7px;
            & > span {
              margin-bottom: 7px;
              color: #fff;
              font-family: $fontKeepCalmMedium;
              text-transform: uppercase;
              font-size: 80%;
            }
            .inputlike,
            input {
              width: 100%;
              height: 30px;
              padding: 0 10px;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              background-color: #fff;
              border: 0;
              border-radius: 4px;
              color: #222;
              font-size: 95%;
            }
            .inputlike {
              background-color: #ddd;
              cursor: not-allowed;
              span {
                color: #555;
              }
            }
          }
        }
      }
      .subm {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .loading {
          margin-right: 7px;
          svg {
            color: #fff;
          }
        }
        input {
          border: 0;
          background-color: $colorAzulOscuro;
          border-radius: 4px;
          width: 80px;
          min-width: 80px;
          height: 25px;
          margin-left: 5px;
          color: #fff;
          @include ease-transition;
          opacity: 0.7;
          &:not(:disabled) {
            opacity: 1;
            cursor: pointer;
            &:hover {
              background-color: $colorAzulClaro;
            }
          }
        }
      }
    }
    .address {
      padding: 0 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100%;
      span {
        color: #fff;
        margin-bottom: 10px;
      }
      .input-asoc {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 30px;
        input {
          border: 0;
          background-color: #ddd;
          border-radius: 4px;
          width: 100%;
          height: 100%;
          padding: 0 10px;
          color: #555;
          cursor: not-allowed;
        }
        button {
          border: 0;
          background-color: $colorAzulOscuro;
          border-radius: 4px;
          width: 80px;
          min-width: 80px;
          height: 100%;
          margin-left: 5px;
          color: #fff;
          cursor: pointer;
          @include ease-transition;
          &:hover {
            background-color: $colorAzulClaro;
          }
        }
      }
      .sent {
        width: 100%;
        height: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        .loading {
          svg {
            color: #fff;
          }
        }
      }
    }
    .cerrar-sesion {
      button {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 30px;
        padding: 0 20px;
        border-radius: 6px;
        border: 0;
        font-size: 90%;
        background-color: $colorPaletaC6;
        text-transform: uppercase;
        font-weight: bold;
        @include ease-transition;
        cursor: pointer;
        color: #fff;
        opacity: 1;
        @include sombra(0 0 1px 0 #000);
        &:hover {
          background-color: $colorPaletaC7;
          @include sombra(0 0 3px 0 #000);
        }
      }
    }
  }
}
</style>
