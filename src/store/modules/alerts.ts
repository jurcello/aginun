export interface AlertsState {
  alert: {
    message?: string;
    type?: AlertType;
  };
}

export enum AlertType {
  Success = "success",
  Error = "error",
}

export default {
  namespaced: true,
  state: {
    alert: {},
  },
  mutations: {
    setAlert(state, alert) {
      state.alert = alert;
    },
  },
  actions: {
    displaySuccess({ commit }, message) {
      commit("setAlert", {
        message,
        type: AlertType.Success,
      });
    },
    displayError({ commit }, message) {
      commit("setAlert", {
        message,
        type: AlertType.Error,
      });
    },
  },
};
