<template lang="pug">
  .tour.fadeIn
    .popup-contenido
      .titulo-logo
        .titulo
          span Bienvenido a Fiblo
        .logo
          img(src="@/assets/images/logo-texto-celeste.png")
      .texto-botones
        .red-actual
          strong Red actual: 
          span {{networks[currentNetwork].name}}
        .texto
          p
            | Bienvenido a Fiblo, una plataforma de financiamiento colectivo basada en Ethereum (Blockchain).
            |
            | A continuación vamos a realizar un tour para que puedas familiarizarte con la interfaz, para comenzar hacé click en 'INICIAR', si ya conocés la plataforma, podes hacer click en 'SALTAR' para comenzar a utilizarla directamente.
        .botones
          button.saltar(@click="skiptTour")
            span Saltar
          button.iniciar(@click="finishFirstRun")
            span Iniciar
</template>

<script>
import { mapActions } from "vuex";

import fiblo from "@/services/fiblo";

export default {
  data() {
    return {
      networks: {
        "1": {
          name: "Ethereum - MainNet",
          url: "https://api.infura.io/v1/jsonrpc/mainnet"
          // logo: require("../../assets/images/network-logos/ethereum.png")
        },
        "3": {
          name: "Ethereum - Ropsten",
          url: "https://api.infura.io/v1/jsonrpc/ropsten"
          // logo: require("../../assets/images/network-logos/ropsten.png")
        },
        "31": {
          name: "RSK - TestNet",
          url: "https://public-node.testnet.rsk.co:443"
          // logo: require("../../assets/images/network-logos/rsk.png")
        },
        "5777": {
          name: "Ethereum - Ganache",
          url: "http://localhost:7545"
          // logo: require("../../assets/images/network-logos/ganache.png")
        },
        "-1": {
          name: "",
          url: ""
          // logo: ""
        }
      },
      currentNetwork: -1
    };
  },
  methods: {
    ...mapActions("tour", ["finishFirstRun", "skiptTour"])
  },
  mounted() {
    fiblo.getNetworkVersion((error, netVer) => {
      if (error) {
        console.error(error);
        this.currentNetwork = -1;
      } else {
        if (this.networks[netVer]) this.currentNetwork = netVer;
      }
    });
  }
};
</script>

<style lang="scss" scoped>
@import "~Styles/_config.scss";
.tour {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(#000, 0.7);
  .popup-contenido {
    width: 50vw;
    height: 60vh;
    background-color: #eee;
    border-radius: 10px;
    @include sombra(0 0 10px 0 #000);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px 0;
    .titulo-logo {
      width: 50%;
      min-width: 50%;
      height: 100%;
      position: relative;
      padding: 0 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      &::after {
        content: "";
        position: absolute;
        right: 0;
        top: 0;
        width: 2px;
        height: 100%;
        background-color: #444;
      }
      .titulo {
        margin-bottom: 20px;
        span {
          text-transform: uppercase;
          font-family: $fontKeepCalmMedium;
          font-size: 150%;
        }
      }
      .logo {
        width: 100%;
        height: 150px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          object-fit: contain;
          width: 100%;
          height: 100%;
        }
      }
    }
    .texto-botones {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      padding: 0 25px;
      height: 100%;
      width: 50%;
      min-width: 50%;
      .texto {
        height: 100%;
        margin-top: 20px;
        p {
          white-space: pre-line;
        }
      }
      .botones {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        button {
          background-color: $colorAzulBase;
          @include sombra(0 0 3px 0 #000);
          border-radius: 5px;
          border: 0;
          @include ease-transition;
          height: 40px;
          padding: 0 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          outline: 0;
          cursor: pointer;
          &:hover {
            background-color: $colorAzulOscuro;
          }
          span {
            font-family: $fontUbuntuLight;
            color: #fff;
            text-transform: uppercase;
            font-size: 90%;
          }
        }
      }
    }
  }
}
</style>
