import Vue from 'vue';
import Vuex from 'vuex';

import general from './general';
import usuarios from './usuarios';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    general,
    usuarios,
  },
});
