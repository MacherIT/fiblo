import Vue from 'vue';
import Vuex from 'vuex';

import usuarios from './usuarios';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    usuarios,
  },
});
