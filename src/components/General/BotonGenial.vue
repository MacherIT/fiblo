<template lang="pug">
  .boton-genial(@click="go")
    span Completar
</template>

<script>
export default {
  props: ['go'],
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
.boton-genial {
  position: fixed;
  right: 15px;
  top: 48%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $colorPaletaC7;
  border: 0;
  @include sombra(0 0 4px 0 #000);
  border-radius: 6px;
  height: 30px;
  padding: 0 10px;
  cursor: pointer;
  @include ease-transition(70ms);
  &:hover {
    background-color: $colorPaletaC6;
  }
  span {
    color: #fff;
    font-family: $fontKeepCalmMedium;
    text-transform: uppercase;
    font-size: 75%;
  }
}
</style>
