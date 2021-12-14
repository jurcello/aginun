import alertsStore, { AlertsState, AlertType } from "@/store/modules/alerts";

describe("Alerts Store", () => {
  describe("mutations", () => {
    describe("setAlert", () => {
      it("updates the alert state", () => {
        const state: AlertsState = {
          alert: {},
        };
        const alert = {
          message: "You succeeded",
          type: AlertType.Success,
        };

        alertsStore.mutations.setAlert(state, alert);
        expect(state.alert).toBe(alert);
      });
    });
  });

  describe("actions", () => {
    const commit = jest.fn();

    describe("displaySuccess", () => {
      it("commits setAlert using the provided message", () => {
        const message = "success!";

        alertsStore.actions.displaySuccess({ commit }, message);
        expect(commit).toBeCalledWith("setAlert", {
          message,
          type: AlertType.Success,
        });
      });
    });

    describe("displayError", () => {
      it("commits setAlert using the provided message", () => {
        const message = "error!";

        alertsStore.actions.displayError({ commit }, message);
        expect(commit).toBeCalledWith("setAlert", {
          message,
          type: AlertType.Error,
        });
      });
    });
  });
});
