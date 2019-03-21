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
    BotonGenial(:go="go")
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import BotonGenial from '@/components/General/BotonGenial';

export default {
  components: { BotonGenial },
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
    go() {
      this.etapa = {
        descripcion:
          'Las cactáceas son plantas de la familia de las suculentas. Son originarias de América pero también se encuentran en África y Madagascar. Son de tamaño mediano, grande o pequeño. En su interior contienen gran caudal de sábila como reserva de líquido dado que son plantas que se encuentran en climas desérticos (secos).',
        propuesta:
          'El combo se compone de una mesa de roble de 4 metros x 3,50 metros y 4 sillas de roble. La mesa tiene la opción extensible convirtiéndose en una mesa de 6 metros de largo. Tanto la mesa como las sillas presentan una capa de lustre para la protección de la madera y su mayor durabilidad. Además es posible la opción de comprar 2 o 4 sillas más en caso que el comprador así lo requiera.',
      };
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
