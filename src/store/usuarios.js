import usuarioService from '@/services/usuario';

export default {
  namespaced: true,
  state: localStorage.getItem('@fibloST:usuario')
    ? { loggedIn: true, token: localStorage.getItem('@fibloST:usuario') }
    : { loggedIn: false, token: null },
  actions: {
    login({ commit }, { email, password }) {
      usuarioService
        .login(email, password)
        .then(({ data }) => {
          commit('loginSuccess', data.token);
        })
        .catch(error => {
          commit('loginFailure', error);
        });
    },
    logout({ commit }) {
      usuarioService.logout();
      commit('logout');
    },
  },
  mutations: {
    loginSuccess(state, token) {
      console.log('login success');
      state.loggedIn = true;
      state.token = token;
    },
    loginFailure(state) {
      console.log('login failure');
      state.loggedIn = false;
      state.token = null;
    },
    logout(state) {
      console.log('logout success');
      state.loggedIn = false;
      state.token = null;
    },
  },
};
