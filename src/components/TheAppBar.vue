<template>
  <div>
    <nav
      class="navbar navbar-expand-md navbar-dark bg-primary ps-1 pe-3 position-fixed w-100 z-index-sticky"
    >
      <router-link class="nav-link navbar-brand" to="/">
        <img width="45" src="@/assets/images/xr.svg" :alt="$t('Logo')" />
        {{ $t("Vacancies") }}
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        aria-controls="navbar-collapse"
        :aria-label="$t('Toggle navbar')"
        @click="navbar.toggle()"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" ref="navbar">
        <ul class="navbar-nav align-items-center">
          <li
            v-for="navItem in navItems"
            :key="navItem.path"
            class="nav-item mx-1 my-2"
          >
            <router-link
              class="nav-link px-2"
              active-class="active"
              :to="navItem.path"
              @click.native="navbar.hide()"
              >{{ navItem.label }}</router-link
            >
          </li>
          <li class="nav-item my-2 mx-md-3">
            <button
              v-if="!loggedIn"
              type="button"
              class="btn btn-outline-light login-button px-3"
              @click="loginModalOpen = true"
            >
              {{ $t("Login") }}
            </button>
            <button
              v-else
              type="button"
              class="btn btn-outline-light login-button px-3"
              @click="logout"
            >
              {{ $t("Logout") }}
            </button>
          </li>
          <li class="nav-item my-3 my-md-0">
            <language-select />
          </li>
        </ul>
      </div>
    </nav>
    <login-modal v-if="loginModalOpen" @closed="loginModalOpen = false" />
  </div>
</template>

<script>
import LanguageSelect from "@/components/LanguageSelect.vue";
import LoginModal from "@/components/LoginModal.vue";
import { mapGetters } from "vuex";
import { Collapse } from "bootstrap";
import { mapActions } from "vuex";

export default {
  name: "TheAppBar",
  components: {
    LanguageSelect,
    LoginModal
  },
  computed: {
    ...mapGetters({
      loggedIn: "user/loggedIn"
    })
  },
  data() {
    return {
      navbar: null,
      loginModalOpen: false,
      navItems: [
        {
          path: "/roles",
          label: this.$t("Roles")
        },
        {
          path: "/about",
          label: this.$t("About")
        },
        {
          path: "/support",
          label: this.$t("Support")
        }
      ]
    };
  },
  methods: {
    ...mapActions("user", ["logout"])
  },
  mounted() {
    this.navbar = new Collapse(this.$refs.navbar, {
      toggle: false
    });
  }
};
</script>
