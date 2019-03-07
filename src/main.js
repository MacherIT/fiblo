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
import CKEditor from '@ckeditor/ckeditor5-vue';
import App from '@/App';
import router from '@/router';
import store from '@/store/index';
import FormPlugin from '@/plugins/FormPlugin';

library.add(faCoffee, faSolid, faBrands);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(CKEditor);

Vue.use(VueResource);
Vue.use(VeeValidate);
Vue.use(FormPlugin);

Vue.filter('formatDate', (val, format) =>
  (val ? (format ? moment(String(val)).format(format) : val) : ''),
);

Vue.filter('limitStr', (str, maxSize = 30) =>
  (str ? (str.length > maxSize ? `${str.substr(0, maxSize)}...` : str) : ''),
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
