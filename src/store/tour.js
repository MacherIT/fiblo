const saveState = obj => {
  localStorage.setItem('@fibloST:tour', JSON.stringify(obj));
};

export default {
  namespaced: true,
  state: {
    tour: localStorage.getItem('@fibloST:tour')
      ? JSON.parse(localStorage.getItem('@fibloST:tour'))
      : {
        firstRun: false,
        main: false,
        proyectosIndex: false,
        proyectoNew: false,
        comprar: false,
        cnv: false,
      },
  },
  actions: {
    skiptTour({ commit }) {
      commit('skiptTour');
    },
    resetTour({ commit }) {
      commit('resetTour');
    },
    finishFirstRun({ commit }) {
      commit('finishFirstRun');
    },
    finishMain({ commit }) {
      commit('finishMain');
    },
    finishProyectosIndex({ commit }) {
      commit('finishProyectosIndex');
    },
    finishProyectoNew({ commit }) {
      commit('finishProyectoNew');
    },
    finishComprar({ commit }) {
      commit('finishComprar');
    },
    finishCNV({ commit }) {
      commit('finishCNV');
    },
  },
  mutations: {
    skiptTour(state) {
      state.tour = {
        firstRun: true,
        main: true,
        proyectosIndex: true,
        proyectoNew: true,
        comprar: true,
      };
      saveState(state.tour);
    },
    resetTour(state) {
      state.tour = {
        firstRun: false,
        main: false,
        proyectosIndex: false,
        proyectoNew: false,
        comprar: false,
      };
      saveState(state.tour);
    },
    finishFirstRun(state) {
      state.tour.firstRun = true;
      saveState(state.tour);
    },
    finishMain(state) {
      state.tour.main = true;
      saveState(state.tour);
    },
    finishProyectosIndex(state) {
      state.tour.proyectosIndex = true;
      saveState(state.tour);
    },
    finishProyectoNew(state) {
      state.tour.proyectoNew = true;
      saveState(state.tour);
    },
    finishComprar(state) {
      state.tour.comprar = true;
      saveState(state.tour);
    },
    finishCNV(state) {
      state.tour.cnv = true;
      saveState(state.tour);
    },
  },
};
