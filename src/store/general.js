export default {
  namespaced: true,
  state: {
    pageTitle: 'Fiblo',
    flash: {},
  },
  getters: {},
  actions: {
    setPageTitle({ commit }, pageTitle) {
      commit('setPageTitle', pageTitle);
    },
    setFlash({ commit }, flash) {
      commit('setFlash', flash);
    },
  },
  mutations: {
    setPageTitle(state, pageTitle) {
      state.pageTitle = pageTitle;
    },
    setFlash(state, flash) {
      state.flash = flash;
    },
  },
};
