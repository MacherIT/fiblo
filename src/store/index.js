import Vue from 'vue';
import Vuex from 'vuex';

import general from './general';
import usuarios from './usuarios';
import tour from './tour';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    general,
    usuarios,
    tour,
  },
});
