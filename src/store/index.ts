import Vue from "vue";
import Vuex, { Store } from "vuex";
import alerts, { AlertsState } from "./modules/alerts";
import roles, { RolesState } from "./modules/roles";
import groups, { GroupsState } from "./modules/groups";
import errors from "./modules/errors";
import user, { UserState } from "./modules/user";

Vue.use(Vuex);

export interface RootState extends Store<unknown> {
  groups: GroupsState;
  alerts: AlertsState;
  roles: RolesState;
  errors: {
    serverError: boolean;
  };
  user: UserState;
}

export const store = new Store<RootState>({
  modules: {
    groups,
    alerts,
    roles,
    errors,
    user,
  },
  // Enable strict mode in development to get a warning
  // when mutating state outside of a mutation.
  // https://vuex.vuejs.org/guide/strict.html
  strict: process.env.NODE_ENV !== "production",
});
