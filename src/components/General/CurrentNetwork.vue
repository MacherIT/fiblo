<template lang="pug">
  .current-network
    img(
      src="@/assets/images/rsk-icon-color.png")
    span https://public-node.testnet.rsk.co:443
</template>

<script>
export default {};
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
    align-items: center;
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
  }
}
</style>