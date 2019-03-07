<template lang="pug">
  .etapa-propuesta
    form(
      @submit.prevent="setFields"
      novalidate)
      .campo
        span Descripción del proyecto
        ckeditor(
          :editor="editor"
          name="descripcion"
          placeholder='Descripción del proyecto'
          v-validate="'required'"
          v-model="etapa.descripcion"
          tag-name="textarea")
      .campo
        span Propuesta para los accionistas
        ckeditor(
          :editor="editor"
          name="propuesta"
          placeholder='Propuesta para los accionistas'
          v-validate="'required'"
          v-model="etapa.propuesta"
          tag-name="textarea")
      .subm
        .loading(v-if="sent")
          font-awesome-icon(icon="circle-notch", spin)
        input(
          type="submit"
          value="Siguiente"
          :disabled="!validForm || sent")
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
  props: ['proyecto', 'set', 'setEtapaActiva'],
  data() {
    return {
      editor: ClassicEditor,
      sent: false,
      etapa: {
        descripcion: this.proyecto.descripcion ? this.proyecto.descripcion : '',
        propuesta: this.proyecto.propuesta ? this.proyecto.propuesta : '',
      },
    };
  },
  methods: {
    setFields() {
      Object.keys(this.etapa).map(k => {
        this.set(k, this.etapa[k]);
      });
      this.setEtapaActiva(2);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
.etapa-propuesta {
  width: 100%;
  height: 100%;
  form {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;
    padding: 20px;
    .campo {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
      width: 100%;
      margin-bottom: 15px;
      span {
        margin-bottom: 7px;
        color: #fff;
        text-transform: uppercase;
        font-family: $fontKeepCalmMedium;
        letter-spacing: 1px;
        font-size: 85%;
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
