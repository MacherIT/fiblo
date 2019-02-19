<template lang="pug">
  section.page-home
    h1 Home
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Home',
  mounted() {
    this.setPageTitle('Home');
  },
  methods: {
    ...mapActions('general', ['setPageTitle']),
  },
};
</script>

<style lang="scss" scoped>
@import '~Styles/_config.scss';
</style>
