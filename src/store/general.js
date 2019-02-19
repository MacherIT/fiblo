export default {
  namespaced: true,
  state: {
    pageTitle: 'Fiblo',
  },
  getters: {},
  actions: {
    setPageTitle({ commit }, pageTitle) {
      commit('setPageTitle', pageTitle);
    },
  },
  mutations: {
    setPageTitle(state, pageTitle) {
      state.pageTitle = pageTitle;
    },
  },
};
