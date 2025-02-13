import rolesStore, {
  defaultFilters,
  FiltersState,
  RolesState,
} from "@/store/modules/roles";
import { apolloClient } from "@/plugins/vue-apollo";
import { ApolloQueryResult } from "apollo-client";
import i18n from "@/i18n/i18n";
import router from "@/router";
import { Role } from "@/models/role";
import { createTranslation } from "@/i18n/utils/create-translation";

jest.mock("lodash/throttle", () => jest.fn((fn) => fn));
jest.mock("@/router", () => ({
  push: jest.fn(),
  currentRoute: {
    path: "/",
  },
}));
jest.useFakeTimers();

describe("Roles Store", () => {
  const roles = [
    {
      id: 1,
      title: createTranslation({ en: "Role 1" }),
    },
    {
      id: 2,
      title: createTranslation({ en: "Role 2" }),
    },
  ];
  const mockState: Partial<RolesState> = {
    roles: roles as Role[],
  };
  const apolloQuerySpy = jest.spyOn(apolloClient, "query");
  const apolloMutateSpy = jest.spyOn(apolloClient, "mutate");

  describe("getters", () => {
    describe("isNewQuery", () => {
      it("returns true when paginationOffset is 0", () => {
        expect(
          rolesStore.getters.isNewQuery({
            paginationOffset: 0,
          })
        ).toBe(true);
      });

      it("returns false when paginationOffset is not 0", () => {
        expect(
          rolesStore.getters.isNewQuery({
            paginationOffset: 10,
          })
        ).toBe(false);
      });
    });

    describe("isUsingFilters", () => {
      it("returns false when using the default filters", () => {
        expect(
          rolesStore.getters.isNewQuery({
            selectedFilters: defaultFilters(),
          })
        ).toBe(false);
      });

      it("returns true when using workingCircles", () => {
        expect(
          rolesStore.getters.isUsingFilters({
            selectedFilters: {
              workingCircles: ["something"],
            },
          })
        ).toBe(true);
      });

      it("returns true when using localGroups", () => {
        expect(
          rolesStore.getters.isUsingFilters({
            selectedFilters: {
              localGroups: ["something"],
            },
          })
        ).toBe(true);
      });

      it("returns true when using timeCommitment", () => {
        expect(
          rolesStore.getters.isUsingFilters({
            selectedFilters: {
              timeCommitment: [2],
            },
          })
        ).toBe(true);
      });

      it("returns true when using search", () => {
        expect(
          rolesStore.getters.isUsingFilters({
            selectedFilters: {
              search: "something",
            },
          })
        ).toBe(true);
      });
    });
  });

  describe("mutations", () => {
    describe("addRole", () => {
      it("adds a new role to the state", () => {
        const state = {
          roles: [
            {
              id: 1,
              title: createTranslation({ en: "Role 1" }),
            },
          ],
        };
        const newRole = {
          id: 2,
          title: createTranslation({ en: "Role 2" }),
        };

        rolesStore.mutations.addRole(state, newRole);
        expect(state.roles[0]).toBe(newRole);
      });
    });

    describe("addRoles", () => {
      it("adds roles to the state", () => {
        const state = {
          roles: [],
        };

        rolesStore.mutations.addRoles(state, roles);
        expect(state.roles[0]).toBe(roles[0]);
        expect(state.roles[1]).toBe(roles[1]);
      });
    });

    describe("editRole", () => {
      it("edits a role in the state", () => {
        const state = {
          roles: [...roles],
        };
        const editedRole = {
          id: 1,
          title: createTranslation({ en: "Role 1 edited" }),
        };

        rolesStore.mutations.editRole(state, editedRole);
        expect(state.roles[0]).toBe(editedRole);
      });
    });

    describe("setRoles", () => {
      it("sets the roles state", () => {
        const state: Partial<RolesState> = {};

        rolesStore.mutations.setRoles(state, roles);
        expect(state.roles).toBe(roles);
      });
    });

    describe("setLoadingState", () => {
      it("sets the isLoadingRoles state", () => {
        const state: Partial<RolesState> = {};

        rolesStore.mutations.setLoadingState(state, true);
        expect(state.isLoadingRoles).toBe(true);
      });
    });

    describe("clearRoles", () => {
      it("clears roles and paginationOffset from the state", () => {
        const state = {
          roles,
          paginationOffset: 10,
        };

        rolesStore.mutations.clearRoles(state);
        expect(state.roles).toEqual([]);
        expect(state.paginationOffset).toBe(0);
      });
    });

    describe("triggerReload", () => {
      it("toggles infiniteScrollId in the state", () => {
        const state = {
          infiniteScrollId: false,
        };

        rolesStore.mutations.triggerReload(state);
        expect(state.infiniteScrollId).toBe(true);
      });
    });

    describe("nextPagination", () => {
      it("increases paginationOffset in the state based on paginationLimit", () => {
        const state = {
          paginationOffset: 0,
          paginationLimit: 20,
        };

        rolesStore.mutations.nextPagination(state);
        expect(state.paginationOffset).toBe(20);
      });
    });

    describe("setDefaultFilters", () => {
      it("sets the default filters", () => {
        const state = {
          selectedFilters: {},
        };

        rolesStore.mutations.setDefaultFilters(state);
        expect(state.selectedFilters).toEqual(defaultFilters());
      });
    });

    describe("setFilter", () => {
      it("sets a filter in the state", () => {
        const state: Partial<RolesState> = {
          selectedFilters: defaultFilters(),
        };
        const newFilter = {
          filterType: "search",
          filterValue: "newSearch",
        };

        rolesStore.mutations.setFilter(state, newFilter);
        expect(
          (state.selectedFilters as FiltersState)[newFilter.filterType]
        ).toBe(newFilter.filterValue);
      });
    });
  });

  describe("actions", () => {
    const commit = jest.fn();

    describe("createRole", () => {
      it("calls apolloClient.mutate with the role to create", async () => {
        apolloMutateSpy.mockReturnValue(
          Promise.resolve({
            data: {
              insert_role: {
                returning: [{}, {}],
              },
            },
          })
        );
        const dispatch = jest.fn(() => Promise.resolve());
        const rootState = {
          user: {
            authorId: "123",
          },
        };
        const newRole = {
          id: 3,
          title: createTranslation({ en: "Role 3" }),
        };

        await rolesStore.actions.createRole({ dispatch, rootState }, newRole);
        expect(apolloMutateSpy).toBeCalled();
        expect(dispatch).toBeCalledWith(
          "alerts/displaySuccess",
          i18n.t("Role created"),
          { root: true }
        );
      });
    });

    describe("updateRole", () => {
      it("calls apolloClient.mutate with the role to update", async () => {
        apolloMutateSpy.mockReturnValue(
          Promise.resolve({
            data: {
              update_role: {
                returning: [{}, {}],
              },
            },
          })
        );
        const dispatch = jest.fn(() => Promise.resolve());
        const updatedRole = {
          id: 3,
          title: createTranslation({ en: "Role 3" }),
        };

        await rolesStore.actions.updateRole({ dispatch }, updatedRole);
        expect(apolloMutateSpy).toBeCalled();
        expect(dispatch).toBeCalledWith(
          "alerts/displaySuccess",
          i18n.t("Role updated"),
          {
            root: true,
          }
        );
      });
    });

    describe("fillRole", () => {
      it("calls apolloClient.mutate with the role to update", async () => {
        const dispatch = jest.fn(() => Promise.resolve());

        await rolesStore.actions.fillRole({ dispatch }, 1);
        expect(apolloMutateSpy).toBeCalled();
      });
    });

    describe("deleteRole", () => {
      it("calls apolloClient.mutate with the role to delete", async () => {
        const dispatch = jest.fn(() => Promise.resolve());

        await rolesStore.actions.deleteRole({ dispatch }, 1);
        expect(apolloMutateSpy).toBeCalled();
      });
    });

    describe("loadRoles", () => {
      const dispatch = jest.fn(() => Promise.resolve());
      const defaultPayload = {
        state: {
          selectedFilters: {
            localGroups: [],
            workingCircles: [],
            timeCommitment: [1, 30],
          },
        },
        getters: {},
        commit,
        rootState: {
          groups: {
            localGroups: [],
            workingCircles: [],
          },
        },
        rootGetters: {
          "groups/localGroupIds": null,
          "groups/workingCircleIds": null,
        },
        dispatch,
      };
      const defaultScrollState = {
        complete: jest.fn(),
        loaded: jest.fn(),
      };

      apolloQuerySpy.mockReturnValue(
        Promise.resolve({
          data: { rolesSearch: mockState.roles },
        } as ApolloQueryResult<unknown>)
      );

      it("commits setLoadingState to true", async () => {
        await rolesStore.actions.loadRoles(defaultPayload, defaultScrollState);
        expect(commit).toBeCalledWith("setLoadingState", true);
      });

      it("commits setLoadingState to false after the query", async () => {
        await rolesStore.actions.loadRoles(defaultPayload, defaultScrollState);
        expect(apolloQuerySpy).toBeCalled();
        expect(commit).toBeCalledWith("setLoadingState", false);
      });

      it("loads group data if it doesn't exist", async () => {
        await rolesStore.actions.loadRoles(defaultPayload, defaultScrollState);
        expect(dispatch).toBeCalledWith(
          "groups/loadGroups",
          {},
          { root: true }
        );
      });

      it("commits setRoles when it's a new query", async () => {
        await rolesStore.actions.loadRoles(
          {
            ...defaultPayload,
            getters: {
              isNewQuery: true,
            },
          },
          defaultScrollState
        );
        expect(commit).toBeCalledWith("setRoles", roles);
      });

      it("commits addRoles when it's not a new query", async () => {
        await rolesStore.actions.loadRoles(defaultPayload, defaultScrollState);
        expect(commit).toBeCalledWith("addRoles", roles);
      });

      it("commits nextPagination when there are new roles", async () => {
        await rolesStore.actions.loadRoles(defaultPayload, defaultScrollState);
        expect(defaultScrollState.loaded).toBeCalled();
        expect(commit).toBeCalledWith("nextPagination");
      });

      it("calls scrollState.complete when we queried the last roles", async () => {
        await rolesStore.actions.loadRoles(
          {
            ...defaultPayload,
            state: {
              ...defaultPayload.state,
              paginationLimit: 5,
            },
          },
          defaultScrollState
        );
        expect(defaultScrollState.complete).toBeCalled();
      });

      it("calls scrollState.complete when there aren't new roles", async () => {
        apolloQuerySpy.mockReturnValue(
          Promise.resolve({
            data: { rolesSearch: [] },
          } as ApolloQueryResult<unknown>)
        );
        await rolesStore.actions.loadRoles(defaultPayload, defaultScrollState);
        expect(defaultScrollState.complete).toBeCalled();
      });
    });

    describe("reloadRoles", () => {
      it("commits clearRoles and triggerReload", () => {
        rolesStore.actions.reloadRoles({ commit });
        expect(commit).toBeCalledWith("clearRoles");
        jest.runAllTimers();
        expect(commit).toBeCalledWith("triggerReload");
      });
    });

    describe("setFilter", () => {
      it("commits clearRoles and triggerReload", () => {
        const dispatch = jest.fn(() => Promise.resolve());
        const payload = { filterType: "search", filterValue: "newSearch" };

        rolesStore.actions.setFilter({ commit, dispatch }, payload);
        expect(commit).toBeCalledWith("setLoadingState", true);
        expect(commit).toBeCalledWith("setFilter", payload);
        expect(router.push).toBeCalledWith(
          `/?${payload.filterType}=${payload.filterValue}`
        );
        expect(dispatch).toBeCalledWith("reloadRoles");
      });
    });

    describe("setDefaultFilters", () => {
      it("commits the default filters and dispatches reloadRoles", () => {
        const dispatch = jest.fn(() => Promise.resolve());

        rolesStore.actions.setDefaultFilters({ commit, dispatch });
        expect(commit).toBeCalledWith("setLoadingState", true);
        expect(commit).toBeCalledWith("setDefaultFilters");
        expect(dispatch).toBeCalledWith("reloadRoles");
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
