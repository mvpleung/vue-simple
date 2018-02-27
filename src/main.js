import Vue from 'vue';
import App from './App.vue';
import router from './router';
import MintUI from 'mint-ui';
import Axios from './axios';
import store from './store';
//校验组件 https://github.com/mvpleung/verify
import verify from 'verify-plugin';
//工具插件 https://github.com/mvpleung/vue-utils-plugin
import utils from 'vue-utils-plugin';
//支付插件 https://github.com/mvpleung/UniquePay
import UniquePay from 'unique-pay';
require('es6-promise').polyfill();
import './css/pageStyle.scss';

Vue.use(verify, {
  blur: true,
  msgbox: MintUI.Toast
});
Vue.use(utils);
Vue.use(UniquePay);

//install axios
let installAxios = () => {
  Vue.axios = Axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return Axios;
      }
    }
  });
};
installAxios();

Vue.use(MintUI);

Vue.config.errorHandler = function(err, vm, info) {
  console.error(info, '\n', err);
  MintUI.MessageBox(info, err.message);
};
window.Vue = Vue;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
