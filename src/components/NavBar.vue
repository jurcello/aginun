<template>
  <div>
    <nav
      class="navbar navbar-expand-md navbar-dark bg-primary ps-1 pe-3 position-fixed w-100 z-index-sticky"
    >
      <router-link class="nav-link" to="/">
        <img width="45" src="@/assets/images/xr.svg" :alt="$t('Logo')" />
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
      <div class="collapse navbar-collapse text-center" ref="navbar">
        <ul class="navbar-nav align-items-center mb-2 mb-md-0 me-md-auto">
          <li
            v-for="navItem in navItems"
            :key="navItem.path"
            class="nav-item my-2 my-md-0 mx-md-2"
          >
            <router-link
              class="nav-link"
              active-class="active"
              :to="navItem.path"
              @click.native="navbar.hide()"
              >{{ navItem.label }}</router-link
            >
          </li>
        </ul>
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
          @click="logOut"
        >
          {{ $t("Logout") }}
        </button>
        <language-select class="mt-3 mt-md-0 mx-auto ms-md-2 me-md-0" />
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
  name: "NavBar",
  components: {
    LanguageSelect,
    LoginModal,
  },
  computed: {
    ...mapGetters({
      loggedIn: "user/loggedIn",
    }),
    navItems() {
      const items = [
        {
          path: "/roles",
          label: this.$t("Roles"),
        },
        {
          path: "/about",
          label: this.$t("About"),
        },
        {
          path: "/support",
          label: this.$t("Support"),
        },
      ];

      if (this.loggedIn) {
        items.splice(1, 0, {
          path: "/my-roles",
          label: this.$t("My Roles"),
        });
      }

      return items;
    },
  },
  data() {
    return {
      navbar: null,
      loginModalOpen: false,
    };
  },
  methods: {
    ...mapActions("user", ["logOut"]),
  },
  mounted() {
    this.navbar = new Collapse(this.$refs.navbar, {
      toggle: false,
    });
  },
};
</script>
