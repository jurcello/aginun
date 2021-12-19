<template>
  <div>
    <router-view :key="$route.fullPath" />
    <div v-if="!!myRoles.length" class="roles-list">
      <div class="container">
        <div class="row pt-3 pt-md-5">
          <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-3">
            <button
              type="button"
              class="btn btn-primary w-100 h-100"
              @click="newRoleModal.show()"
            >
              <i class="bi bi-plus" style="font-size: 4rem; line-height: 1"></i>
              <h4>{{ $t("Create new role") }}</h4>
            </button>
          </div>
          <div
            v-for="role in myRoles"
            :key="role.id"
            class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-3"
          >
            <router-link :to="`my-roles/view/${role.id}`">
              <div class="d-inline-block w-100">
                <RoleCard :role="role" />
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!myRoles.length && isLoadingRoles" class="text-center">
      <SpinnerLoader :text="$t('Loading roles')" />
    </div>
    <div v-if="!myRoles.length && !isLoadingRoles" class="text-center">
      <img src="@/assets/images/two-birds.svg" class="w-25 mb-3" />
      <p>{{ $t("You haven't added any roles yet.") }}</p>
      <button
        type="button"
        class="btn btn-primary d-inline-flex align-items-center"
        @click="newRoleModal.show()"
      >
        {{ $t("Create new role") }}
      </button>
    </div>
    <div
      ref="newRoleModal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="new-role-modal"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">{{ $t("New role") }}</h2>
          </div>
          <div class="modal-body">
            <RoleForm @close="newRoleModal.hide()" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RoleCard from "@/components/roles/RoleCard.vue";
import { mapState } from "vuex";
import RoleForm from "@/components/roles/RoleForm.vue";
import SpinnerLoader from "@/components/SpinnerLoader.vue";
import { Modal } from "bootstrap";

export default {
  name: "MyRoles",
  components: {
    RoleCard,
    RoleForm,
    SpinnerLoader,
  },
  data() {
    return {
      newRoleModal: undefined,
    };
  },
  computed: {
    ...mapState("roles", ["myRoles", "isLoadingRoles"]),
  },
  mounted() {
    this.newRoleModal = new Modal(this.$refs.newRoleModal);
  },
  beforeDestroy() {
    this.newRoleModal.dispose();
  },
};
</script>
