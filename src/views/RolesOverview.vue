<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col py-3 py-md-5 px-md-5 roles-list roles-list--with-sidebar">
        <router-view :key="$route.fullPath" />
        <div v-if="!!rolesSelectedLanguage.length" class="row g-3 g-md-4">
          <div
            v-for="role in rolesSelectedLanguage"
            :key="role.id"
            class="col-12 col-sm-6 col-md-12 col-lg-6 col-xl-4"
          >
            <router-link :to="`roles/view/${role.id}`">
              <div class="d-inline-block w-100">
                <role-card :role="role" />
              </div>
            </router-link>
          </div>
        </div>
        <div v-if="!roles.length && isLoadingRoles" class="text-center mt-5">
          <spinner-loader :text="$t('Loading roles')" />
        </div>
        <div v-if="!roles.length && !isLoadingRoles" class="text-center">
          <div v-if="isUsingFilters">
            <h3>{{ $t("No results") }}</h3>
            <p>{{ $t("Try removing some filters.") }}</p>
          </div>
          <div v-else>
            <p>{{ $t("There are currently no published roles.") }}</p>
          </div>
        </div>
        <infinite-loading :identifier="infiniteScrollId" @infinite="loadRoles">
          <template #spinner>
            <!-- show spinner without transition for loading additional roles -->
            <div v-if="!!roles.length" class="text-center mt-5">
              <spinner-loader :text="$t('Loading roles')" />
            </div>
            <span v-else />
          </template>
          <template #no-results>
            <span />
          </template>
          <template #no-more>
            <span />
          </template>
        </infinite-loading>
      </div>
      <div class="col-auto d-none d-md-block border-start">
        <div class="sticky-top filters-sidebar">
          <h4>
            {{ $t("Search for positions") }}
          </h4>
          <hr />
          <role-filters class="mx-1" inputPrefix="sidebar" />
        </div>
      </div>
    </div>
    <div
      class="offcanvas offcanvas-start"
      tabindex="-1"
      id="sidebar"
      aria-labelledby="sidebar"
    >
      <div class="offcanvas-header">
        <h4 class="offcanvas-title">{{ $t("Search for positions") }}</h4>
      </div>
      <hr class="my-0" />
      <div class="offcanvas-body">
        <role-filters inputPrefix="offcanvas" />
        <button
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebar"
          role="button"
          aria-controls="sidebar"
          class="btn btn-primary rounded-circle position-fixed bottom-0 mb-3"
        >
          <i class="bi bi-arrow-left-short fs-1"></i>
        </button>
      </div>
    </div>
    <button
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#sidebar"
      role="button"
      aria-controls="sidebar"
      class="btn btn-secondary d-md-none position-fixed bottom-0 end-0 mb-3 me-3"
    >
      {{ $t("Filter") }}
      <i class="bi bi-filter"></i>
    </button>
  </div>
</template>

<script>
import RoleCard from "@/components/roles/RoleCard.vue";
import RoleFilters from "@/components/roles/RoleFilters.vue";
import { mapState, mapActions, mapGetters } from "vuex";
import InfiniteLoading from "vue-infinite-loading";
import SpinnerLoader from "@/components/SpinnerLoader.vue";

export default {
  name: "RolesOverview",
  components: {
    RoleCard,
    RoleFilters,
    InfiniteLoading,
    SpinnerLoader,
  },
  computed: {
    ...mapState("roles", [
      "roles",
      "isLoadingRoles",
      "selectedFilters",
      "infiniteScrollId",
    ]),
    ...mapGetters({
      loggedIn: "user/loggedIn",
      isUsingFilters: "roles/isUsingFilters",
    }),
    rolesSelectedLanguage() {
      // roles that do have an empty string as title have not been filled in for that language.
      return this.roles.filter((role) => role.title[this.$i18n.locale]);
    },
  },
  methods: {
    ...mapActions("roles", ["loadRoles"]),
  },
};
</script>
