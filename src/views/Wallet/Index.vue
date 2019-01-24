<template lang="pug">
  .wallet
    form(@submit.prevent="setAddress", novalidate)
      input(
        type="text"
        placeholder="Wallet address"
        v-validate="'required'"
        v-model="address"
        readonly)
      input(
        type="submit"
        value="Guardar"
        :disabled="!validForm || sent")
      .loading(v-if="sent")
        font-awesome-icon(icon="circle-notch", spin)
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import fiblo from '@/services/fiblo';

export default {
  data() {
    return {
      address: '',
      sent: false,
    };
  },
  computed: {
    ...mapState('usuarios', ['token']),
    ...mapGetters('usuarios', ['usuario']),
  },
  mounted() {
    this.$http({
      method: 'GET',
      url: `/api/usuarios/${this.usuario.id}`,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    }).then(
      ({ data }) => {
        if (data.address) {
          this.address = data.address;
        }
      },
      error => {
        console.error(error);
      },
    );

    fiblo.getDefaultAccount((error, account) => {
      if (error) {
        console.error(error);
      } else if (account && this.address !== account) {
        this.address = account;
        this.setAddress(true);
      }
    });
  },
  methods: {
    setAddress(manual = false) {
      if (manual || (this.dirtyForm && this.validForm)) {
        this.sent = true;
        this.$http({
          method: 'PUT',
          url: `/api/usuarios/set_address`,
          body: {
            address: this.address,
          },
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }).then(
          ({ status }) => {
            console.log(status);
            this.sent = false;
          },
          error => {
            console.error(error);
          },
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
.wallet {
  @include default-form;
  input[readonly] {
    background-color: #ddd;
  }
}
</style>
