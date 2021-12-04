export interface AlertsState {
  alertOn: boolean;
  alert: unknown;
}

export enum AlertType {
  Success = "success",
  Error = "error",
}

export default {
  namespaced: true,
  state: {
    alertOn: false,
    alert: {},
  },
  mutations: {
    setAlert(state, alert) {
      state.alert = alert;
      state.alertOn = true;
    },
    disableAlert(state) {
      state.alertOn = false;
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
