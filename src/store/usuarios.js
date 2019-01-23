import usuarioService from '@/services/usuario';

export default {
  namespaced: true,
  state: localStorage.getItem('@fibloST:usuario')
    ? { loggedIn: true, token: localStorage.getItem('@fibloST:usuario') }
    : { loggedIn: false, token: null },
  getters: {
    usuario(state) {
      let outObj = false;
      if (state.loggedIn) {
        const usuario = JSON.parse(window.atob(state.token.split('.')[1]));
        outObj = { id: usuario.id, email: usuario.email };
      }
      return outObj;
    },
  },
  actions: {
    login({ commit }, { email, password }) {
      usuarioService
        .login(email, password)
        .then(res => {
          commit('loginSuccess', res.data.token);
          return res;
        })
        .catch(error => {
          commit('loginFailure', error);
          console.error(error);
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
