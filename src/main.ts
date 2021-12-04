import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import { apolloProvider } from "./plugins/vue-apollo";
import i18n from "./i18n/i18n";
import { loadLanguageAsync } from "@/i18n/utils/load-language-async";
import { loginCookieKey } from "./store/modules/user";
import VueCookies from "vue-cookies";
import VueCompositionAPI from "@vue/composition-api";
import VoerroTagsInput from "@voerro/vue-tagsinput/src/main";
import "@/styles/app.scss";

Vue.component("v-tags-input", VoerroTagsInput);

Vue.config.productionTip = false;

Vue.use(VueCookies);

// We need this for the @vueform/slider component
Vue.use(VueCompositionAPI);

new Vue({
  router,
  store,
  apolloProvider,
  i18n,
  render: (h) => h(App),
  created: async () => {
    if (Vue.$cookies.isKey(loginCookieKey)) {
      store.dispatch("user/initializeFromCookie");
    }
    await loadLanguageAsync(navigator.language.split("-")[0]);
  },
}).$mount("#app");
