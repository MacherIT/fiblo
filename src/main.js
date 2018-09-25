// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueResource from 'vue-resource';
import VeeValidate from 'vee-validate';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import faSolid from '@fortawesome/fontawesome-free-solid';
import faBrands from '@fortawesome/fontawesome-free-brands';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import moment from 'moment';
import App from '@/App';
import router from '@/router';
import store from '@/store/index';

library.add(faCoffee, faSolid, faBrands);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(VueResource);
Vue.use(VeeValidate);

Vue.filter(
  'formatDate',
  (val, format) => (val ? (format ? moment(String(val)).format(format) : val) : ''),
);

Vue.config.productionTip = false;

/* eslint-disable no-new */
window.App = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
