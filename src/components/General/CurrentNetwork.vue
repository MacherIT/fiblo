<template lang="pug">
  .current-network.fadeIn(
    :title="networks[currentNetwork].url"
    v-if="networks[currentNetwork].name")
    img(
      :src="networks[currentNetwork].logo")
    span {{networks[currentNetwork].name}}
</template>

<script>
import fiblo from "@/services/fiblo";

export default {
  data() {
    return {
      networks: {
        "1": {
          name: "Ethereum - MainNet",
          url: "https://api.infura.io/v1/jsonrpc/mainnet",
          logo: require("../../assets/images/network-logos/ethereum.png")
        },
        "3": {
          name: "Ethereum - Ropsten",
          url: "https://api.infura.io/v1/jsonrpc/ropsten",
          logo: require("../../assets/images/network-logos/ropsten.png")
        },
        "31": {
          name: "RSK - TestNet",
          url: "https://public-node.testnet.rsk.co:443",
          logo: require("../../assets/images/network-logos/rsk.png")
        },
        "5777": {
          name: "Ethereum - Ganache",
          url: "http://localhost:7545",
          logo: require("../../assets/images/network-logos/ganache.png")
        },
        "-1": {
          name: "",
          url: "",
          logo: ""
        }
      },
      currentNetwork: -1
    };
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
.current-network {
  position: fixed;
  left: 20px;
  bottom: 0;
  background-color: $colorPaletaC5;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 12px 20px;
  border-radius: 15px 15px 0 0;
  z-index: 5;
  -webkit-transform: translateY(55%);
  transform: translateY(55%);
  @include ease-transition;
  cursor: pointer;
  &:hover {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    span {
      padding-top: 25px;
    }
  }
  img {
    @include minmaxwh(65px);
    object-fit: contain;
    margin-right: 7px;
  }
  span {
    font-family: $fontUbuntuRegular;
    color: #fff;
    font-size: 100%;
    @include ease-transition;
  }
}
</style>