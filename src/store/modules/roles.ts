import { apolloClient } from "@/plugins/vue-apollo";
import throttle from "lodash/throttle";
import i18n from "@/i18n/i18n";
import { timeCommitmentRange } from "@/constants/timeCommitments";
import {
  CreateRoleMutation,
  RolesSearchQuery,
  MyRolesQuery,
  UpdateRoleMutation,
  DeleteRoleMutation,
  FillRoleMutation,
} from "@/GraphQL/roles";
import { cleanRoleInput } from "@/utils/cleanRoleInput";
import router from "@/router";
import { Role } from "@/models/role";

export interface FiltersState {
  search: string;
  localGroups: number[];
  workingCircles: number[];
  timeCommitment: number[];
}

export interface RolesState {
  roles: Role[];
  isLoadingRoles: boolean;
  paginationLimit: number;
  paginationOffset: number;
  infiniteScrollId: boolean;
  selectedFilters: FiltersState;
}

export const defaultFilters = (): FiltersState => ({
  search: "",
  localGroups: [],
  workingCircles: [],
  timeCommitment: [timeCommitmentRange.min, timeCommitmentRange.max],
});
export const FILTERS_KEYS = Object.keys(defaultFilters());

export default {
  namespaced: true,
  state: {
    roles: [],
    myRoles: [],
    isLoadingRoles: true,
    paginationLimit: 20, // number of roles loaded at a time. More are loaded on scroll down.
    paginationOffset: 0,
    infiniteScrollId: true, // when this variable changes new roles are loaded
    selectedFilters: defaultFilters(),
  },
  getters: {
    roles: (state) => state.roles,
    myRoles: (state) => state.myRoles,
    getByID: (state) => (id) => state.roles.find((role) => role.id === id),
    isNewQuery: (state) => state.paginationOffset === 0,
    isUsingFilters(state) {
      return Boolean(
        state.selectedFilters.workingCircles?.length ||
          state.selectedFilters.localGroups?.length ||
          state.selectedFilters.search ||
          state.selectedFilters.timeCommitment?.[0] !==
            timeCommitmentRange.min ||
          state.selectedFilters.timeCommitment?.[1] !== timeCommitmentRange.max
      );
    },
  },
  mutations: {
    addRole(state, newRole) {
      state.roles.unshift(newRole);
    },
    addRoles(state, newRoles) {
      state.roles.push(...newRoles);
    },
    addMyRoles(state, newRoles) {
      state.myRoles.push(...newRoles);
    },
    editRole(state, newRole) {
      const roleIndex = state.roles.findIndex((role) => role.id === newRole.id);

      state.roles[roleIndex] = newRole;
    },
    setRoles(state, roles) {
      state.roles = roles;
    },
    setMyRoles(state, roles) {
      state.myRoles = roles;
    },
    setLoadingState(state, isLoading) {
      state.isLoadingRoles = isLoading;
    },
    clearRoles(state) {
      state.roles = [];
      state.paginationOffset = 0;
    },
    triggerReload(state) {
      // InfiniteLoading component triggers @infinite method (loadRoles)
      // when infiniteScrollId value changes AND
      // user is scrolled at the bottom of the page
      // (achieved by clearing roles before updating infiniteScrollId)
      state.infiniteScrollId = !state.infiniteScrollId;
    },
    nextPagination(state) {
      state.paginationOffset += state.paginationLimit;
    },
    setDefaultFilters(state) {
      state.selectedFilters = defaultFilters();
    },
    setFilter(state, { filterType, filterValue }) {
      state.selectedFilters[filterType] = filterValue;
    },
  },
  actions: {
    async createRole({ dispatch, rootState }, newRole) {
      newRole.authorId = rootState.user.authorId;
      try {
        const response = await apolloClient.mutate({
          mutation: CreateRoleMutation,
          variables: { input: [cleanRoleInput(newRole)] },
        });

        if (!response.data.insert_role.returning.length) {
          throw new Error();
        }

        dispatch("loadRoles");
        dispatch("loadMyRoles");
        dispatch("alerts/displaySuccess", i18n.t("Role created"), {
          root: true,
        });
      } catch (e) {
        dispatch(
          "alerts/displayError",
          i18n.t("An error occured creating this role"),
          {
            root: true,
          }
        );

        return e;
      }
    },
    async updateRole({ dispatch }, newRole) {
      try {
        const response = await apolloClient.mutate({
          mutation: UpdateRoleMutation,
          variables: { id: newRole.id, input: cleanRoleInput(newRole) },
        });

        if (!response.data.update_role.returning.length) {
          throw new Error();
        }

        dispatch("loadRoles");
        dispatch("loadMyRoles");
        dispatch("alerts/displaySuccess", i18n.t("Role updated"), {
          root: true,
        });
      } catch (e) {
        dispatch(
          "alerts/displayError",
          i18n.t("An error occured updating this role"),
          {
            root: true,
          }
        );

        return e;
      }
    },
    async fillRole({ dispatch }, roleID) {
      try {
        const now = new Date(Date.now()).toISOString();

        await apolloClient.mutate({
          mutation: FillRoleMutation,
          variables: { id: roleID, filledDate: now },
        });
        dispatch("loadRoles");
        dispatch("loadMyRoles");
        dispatch("alerts/displaySuccess", i18n.t("Role filled"), {
          root: true,
        });
      } catch (e) {
        dispatch(
          "alerts/displayError",
          i18n.t("An error occured while updating this role"),
          {
            root: true,
          }
        );

        return e;
      }
    },
    async deleteRole({ dispatch }, roleID) {
      try {
        const response = await apolloClient.mutate({
          mutation: DeleteRoleMutation,
          variables: { id: roleID },
        });

        if (!response.data.delete_role.affected_rows) {
          throw new Error();
        }

        dispatch("loadRoles");
        dispatch("loadMyRoles");
        dispatch("alerts/displaySuccess", i18n.t("Role deleted"), {
          root: true,
        });
      } catch (e) {
        dispatch(
          "alerts/displayError",
          i18n.t("An error occured while deleting this role"),
          {
            root: true,
          }
        );

        return e;
      }
    },
    loadMyRoles: throttle(async function ({ commit, dispatch, rootState }) {
      commit("setLoadingState", true);

      // load group data if it doesn't exist yet. Necessary for the next block
      if (
        !rootState.groups.localGroups.length ||
        !rootState.groups.workingCircles.length
      ) {
        await dispatch("groups/loadGroups", {}, { root: true });
      }

      const { data } = await apolloClient.query({
        query: MyRolesQuery,
        variables: {
          authorId: rootState.user.authorId,
        },
      });

      commit("setMyRoles", data.roles);
      commit("setLoadingState", false);
    }, 500),
    // eslint-disable-next-line func-names
    loadRoles: throttle(async function (
      { state, getters, commit, rootState, rootGetters, dispatch },
      scrollState
    ) {
      commit("setLoadingState", true);

      // load group data if it doesn't exist yet. Necessary for the next block
      if (
        !rootState.groups.localGroups.length ||
        !rootState.groups.workingCircles.length
      ) {
        await dispatch("groups/loadGroups", {}, { root: true });
      }

      /*
      When no local group is selected, we search roles from all local groups. Same for working circles.
      TODO: A better solution is to have reactive queries which remove the working group or local circle `where`
      filter from the query if none have been selected.
      */
      const localGroupIds = state.selectedFilters.localGroups.length
        ? state.selectedFilters.localGroups
        : rootGetters["groups/localGroupIds"];
      const workingCircleIds = state.selectedFilters.workingCircles.length
        ? state.selectedFilters.workingCircles
        : rootGetters["groups/workingCircleIds"];

      const variables = {
        limit: state.paginationLimit,
        offset: state.paginationOffset,
        localGroupIds,
        workingCircleIds,
        timeCommitmentMin: state.selectedFilters.timeCommitment[0],
        timeCommitmentMax: state.selectedFilters.timeCommitment[1],
        search: `%${state.selectedFilters.search}%`,
        language: i18n.locale,
      };

      const { data } = await apolloClient.query({
        query: RolesSearchQuery,
        variables,
      });

      const newRoles = data.rolesSearch;

      if (getters.isNewQuery) {
        commit("setRoles", newRoles);
      } else {
        commit("addRoles", newRoles);
      }

      if (newRoles.length) {
        scrollState?.loaded();
        commit("nextPagination");

        if (newRoles.length < state.paginationLimit) {
          scrollState?.complete();
        }
      } else {
        scrollState?.complete();
      }

      commit("setLoadingState", false);
    },
    500),
    reloadRoles({ commit }) {
      commit("clearRoles");
      // timeout necessary because old roles must completely transition out
      // before InfiniteLoading component calls @infinite method
      setTimeout(() => {
        commit("triggerReload");
      }, 1000);
    },
    setFilter({ commit, dispatch }, payload) {
      commit("setLoadingState", true);
      commit("setFilter", payload);

      const params = new URLSearchParams(
        router.currentRoute.query as Record<string, string>
      );

      if (
        !payload.filterValue?.length ||
        (payload.filterType === "timeCommitment" &&
          payload.filterValue[0] === timeCommitmentRange.min &&
          payload.filterValue[1] === timeCommitmentRange.max)
      ) {
        params.delete(payload.filterType);
      } else {
        params.set(payload.filterType, payload.filterValue);
      }

      router.push(`${router.currentRoute.path}?${params.toString()}`);
      dispatch("reloadRoles");
    },
    setDefaultFilters({ commit, dispatch }) {
      commit("setLoadingState", true);
      commit("setDefaultFilters");
      dispatch("reloadRoles");
    },
  },
};
