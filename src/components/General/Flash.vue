<template lang="pug">
  .flash(
    :class="[flash.tipo, flash.mensaje ? !hidding ? 'slideInUp' : 'slideOutDown' : 'hidden']")
    .close(@click="removeFlash")
      font-awesome-icon(icon="times")
    p {{flash.mensaje}}
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      hidding: false,
    };
  },
  computed: {
    ...mapState('general', ['flash']),
  },
  watch: {
    flash: {
      deep: true,
      handler(newVal, oldVal) {
        if (!oldVal || JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          if (newVal.timeout && parseInt(newVal.timeout) > 0) {
            setTimeout(this.removeFlash, parseInt(newVal.timeout));
          }
        }
      },
    },
  },
  methods: {
    ...mapActions('general', ['setFlash']),
    removeFlash() {
      this.hidding = true;
      setTimeout(() => {
        this.setFlash({});
        this.hidding = false;
      }, 1200);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
.flash {
  position: fixed;
  left: 50px;
  bottom: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 30px;
  background-color: $colorAzulClaro;
  max-width: 400px;
  z-index: 100;
  @include sombra(0 0 3px 0 #000);
  &.hidden {
    opacity: 0;
    z-index: -100;
    left: -100%;
    top: -100%;
  }
  &.error {
    background-color: #cf2121;
  }
  &.exito {
    background-color: #419f41;
  }
  .close {
    position: absolute;
    right: 12px;
    top: 10px;
    cursor: pointer;
    svg {
      color: #fff;
    }
  }
  p {
    margin: 0;
    white-space: pre-line;
    color: #fff;
  }
}
</style>
