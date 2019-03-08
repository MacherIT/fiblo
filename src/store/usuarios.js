import usuarioService from '@/services/usuario';

const hasTokenExpired = token => {
  const outObj = { loggedIn: true, token };

  if (new Date(JSON.parse(window.atob(token.split('.')[1])).exp * 1000) < new Date()) {
    // Token outdated
    outObj.loggedIn = false;
    outObj.token = null;

    usuarioService.logout();
  }

  return outObj;
};

export default {
  namespaced: true,
  state: localStorage.getItem('@fibloST:usuario')
    ? hasTokenExpired(localStorage.getItem('@fibloST:usuario'))
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
    login({ commit }, { email, password, callback }) {
      usuarioService.login(email, password, (error, res) => {
        if (error) {
          callback(error, null);
        } else {
          commit('loginSuccess', res.data.token);
          callback(null, res);
        }
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
