<template lang="pug">
  .presentacion-fiblo
    a.logo(href="/")
      img(src="@/assets/images/logo-texto-celeste.png")
    .explicacion
      p Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    .redes-sociales
      .red
        a(href="#", target="_blank")
          font-awesome-icon(:icon="['fab', 'facebook-f']")
      .red
        a(href="#", target="_blank")
          font-awesome-icon(:icon="['fab', 'twitter']")
      .red
        a(href="#", target="_blank")
          font-awesome-icon(:icon="['fab', 'instagram']")
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
.presentacion-fiblo {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px;
  margin-right: 15px;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 10%;
    width: 2px;
    height: 80%;
    background-color: #aaa;
  }
  .logo {
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .explicacion {
    width: 100%;
    margin: 10px 0;
    p {
      margin: 0;
      color: #fff;
      font-family: $fontUbuntuRegular;
    }
  }
  .redes-sociales {
    display: flex;
    justify-content: center;
    align-items: center;
    .red {
      margin: 0 7px;
      display: flex;
      justify-content: center;
      align-items: center;
      @include minmaxwh(30px);
      background-color: $colorGrisBase;
      border-radius: 50%;
      @include ease-transition;
      &:hover {
        background-color: $colorAzulClaro;
        svg {
          color: #fff;
        }
      }
      svg {
        font-size: 120%;
        color: $colorAzulBase;
        @include ease-transition;
      }
    }
  }
}
</style>
