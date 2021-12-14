import i18n from "@/i18n/i18n";
import axios, { AxiosResponse } from "axios";
import qs from "qs";
import Vue from "vue";
import jwtDecode, { JwtPayload } from "jwt-decode";
import router from "@/router";

export const loginCookieKey = "loginToken";

export interface UserState {
  token: string;
  authorId: string;
}

export default {
  namespaced: true,
  state: {
    token: "",
    authorId: "",
  },
  getters: {
    loggedIn: (state) => !!state.token,
  },
  mutations: {
    setAuthorID(state, id) {
      state.authorId = id;
    },
    setToken(state, token) {
      state.token = token;
    },
    setTokenCookie(state, { token, lifetime }) {
      Vue.$cookies.set(loginCookieKey, token, lifetime);
    },
    logOut(state) {
      state.token = null;
      state.authorId = null;
      Vue.$cookies.remove(loginCookieKey);
    },
  },
  actions: {
    initializeFromCookie({ commit }) {
      const accesToken = Vue.$cookies.get(loginCookieKey);

      commit("setToken", accesToken);
      const { sub } = jwtDecode<JwtPayload>(accesToken);

      commit("setAuthorID", sub);
    },
    async login({ commit, dispatch }, { username, password }) {
      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      const params = {
        grant_type: "password",
        client_id: "volunteerplatform",
        username,
        password,
        // To check: do we need this?
        scope: "openid",
      };

      try {
        const { data } = await axios.post(
          process.env.VUE_APP_KEYSERVER_URL || "",
          qs.stringify(params),
          config
        );
        const { sub } = jwtDecode<JwtPayload>(data.access_token);

        commit("setAuthorID", sub);
        commit("setToken", data.access_token);
        commit("setTokenCookie", {
          token: data.access_token,
          lifetime: data.expires_in,
        });
        dispatch("alerts/displaySuccess", i18n.t("Logged in"), { root: true });
      } catch ({ response }) {
        return (
          ((response as AxiosResponse)?.data?.error_description as string) ||
          i18n.t("Login server unavailable")
        );
      }
    },
    logOut({ commit, dispatch }) {
      commit("logOut");

      if (router.currentRoute.name === "my-roles") {
        router.push("/roles");
        commit("roles/setMyRoles", [], { root: true });
      }

      dispatch("alerts/displaySuccess", i18n.t("Logged out"), { root: true });
    },
  },
};
