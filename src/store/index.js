import Vue from 'vue';
import Vuex from 'vuex';
// import createPersistedState from 'vuex-persistedstate' //数据持久
import global from './modules/global';
import user from './modules/user';
Vue.use(Vuex);

/**Default Module */
const store = new Vuex.Store({
  // plugins: [createPersistedState()],
  modules: {
    global,
    user
  }
});
export default store;
