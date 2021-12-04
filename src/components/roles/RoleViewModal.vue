<template>
  <div
    ref="roleViewModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="role-view-modal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div v-if="$apollo.loading" class="modal-body text-center">
          <pulse-loader />
        </div>
        <div v-else-if="!role" class="modal-body text-center">
          <h3 class="mb-0">
            {{ $t("Sorry, this role doesn't exist.") }}
          </h3>
        </div>
        <div
          v-else-if="!role.title[$i18n.locale]"
          class="modal-body text-center"
        >
          <h3 class="mb-0">
            {{
              $t("Sorry, this role isn't available for your selected language.")
            }}
          </h3>
        </div>
        <div v-else>
          <div class="modal-header px-md-4 pt-md-4 d-block">
            <div v-if="showRoleForm" class="d-flex justify-content-between">
              <h3 class="mb-0">
                {{ $t("Edit") }}
                {{ role.title[$i18n.locale] }}
              </h3>
              <button
                type="button"
                class="btn btn-close"
                :title="$t('Exit role editing')"
                @click="showRoleForm = false"
              ></button>
            </div>
            <div
              class="d-flex justify-content-between"
              :class="{ 'd-none': showRoleForm }"
            >
              <div>
                <h2 class="mb-0">{{ role.title[$i18n.locale] }}</h2>
                <p class="fs-6 mb-2">
                  {{ publishedOnText }}
                </p>
                <div>
                  <h5 class="mb-0 d-inline-block">
                    <i class="bi bi-clock-fill"></i>
                    {{ role.timeCommitmentMin }} -
                    {{ role.timeCommitmentMax }}
                  </h5>
                  {{ $t("hours/week") }}
                </div>
                <p class="mb-0">
                  <i class="bi bi-geo-alt-fill fs-5"></i>
                  {{
                    localGroupsMap[role.localGroupId] &&
                    localGroupsMap[role.localGroupId].title
                  }},
                  {{
                    workingCirclesMap[role.workingCircleId] &&
                    workingCirclesMap[role.workingCircleId].title[$i18n.locale]
                  }}
                </p>
              </div>
              <div
                v-if="!role.filledDate && loggedIn"
                class="d-flex flex-column flex-md-row"
              >
                <div class="mb-2 mb-md-0 me-md-2">
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="showRoleForm = true"
                  >
                    <i class="bi bi-pencil fs-5"></i>
                  </button>
                </div>
                <div>
                  <delete-role-button @delete="onDeleteRole" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-body px-md-4 pb-md-4">
            <role-form
              v-if="showRoleForm"
              :edit-role="role"
              @close="showRoleForm = false"
            />
            <template v-else-if="!role.filledDate">
              <h4>
                {{ $t("Responsibilities ") }}
              </h4>
              <p class="white-space-pre-line">
                {{ role.responsibilities[$i18n.locale] }}
              </p>
              <div class="row gx-5">
                <div
                  v-if="role.description && role.description[$i18n.locale]"
                  class="col-12 col-md-6"
                >
                  <h4>
                    {{ $t("Description ") }}
                  </h4>
                  <p class="white-space-pre-line">
                    {{ role.description[$i18n.locale] }}
                  </p>
                </div>
                <div
                  v-if="role.requirements && role.requirements[$i18n.locale]"
                  class="col-12 col-md-6"
                >
                  <h4>
                    {{ $t("Requirements ") }}
                  </h4>
                  <p class="white-space-pre-line">
                    {{ role.requirements[$i18n.locale] }}
                  </p>
                </div>
              </div>
              <div class="row justify-content-between">
                <div class="col-6 col-md-8">
                  <h4>{{ $t("Contacts") }}</h4>
                  <contact-links :role="role" />
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                  <img
                    src="@/assets/images/xr-join-rebellion-stamp.svg"
                    class="img-fluid"
                    :alt="$t('Join the rebellion')"
                  />
                </div>
              </div>
              <div class="mt-4">
                <a
                  :href="`mailto:${role.email}`"
                  target="_blank"
                  class="btn btn-primary px-4"
                  >{{ $t("Apply") }}</a
                >
                <button
                  v-if="loggedIn"
                  type="button"
                  class="btn btn-outline-secondary ms-2 px-4"
                  @click="onFillRole"
                >
                  <i class="bi bi-check-lg"></i>
                  {{ $t("Role filled") }}
                </button>
              </div>
            </template>
            <template v-else>
              <h2 class="text-secondary mt-2">
                {{ $t("This role has been filled.") }}
              </h2>
              <p class="mb-4">
                {{
                  $t(
                    "You can still use the contacts to ask about this role or other similar opportunities in this circle."
                  )
                }}
              </p>
              <contact-links :role="role" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ContactLinks from "@/components/roles/ContactLinks";
import { RoleQuery } from "@/GraphQL/roles";
import { mapActions, mapGetters } from "vuex";
import { Modal } from "bootstrap";
import { PulseLoader } from "@saeris/vue-spinners";
import RoleForm from "@/components/roles/RoleForm.vue";
import DeleteRoleButton from "@/components/roles/DeleteRoleButton.vue";

export default {
  name: "RoleViewModal",
  components: {
    PulseLoader,
    ContactLinks,
    RoleForm,
    DeleteRoleButton,
  },
  data() {
    return {
      roleViewModal: null,
      showRoleForm: false,
    };
  },
  apollo: {
    role: {
      query: RoleQuery,
      variables() {
        return {
          roleId: parseInt(this.$route.params.id, 10),
        };
      },
    },
  },
  computed: {
    ...mapGetters({
      loggedIn: "user/loggedIn",
      localGroupsMap: "groups/localGroupsMap",
      workingCirclesMap: "groups/workingCirclesMap",
    }),
    publishedOnText() {
      return this.$t("Published on {date}", {
        date: this.formatDate(this.role.createdDate),
      });
    },
  },
  mounted() {
    this.roleViewModal = new Modal(this.$refs.roleViewModal);
    this.roleViewModal.toggle();

    this.$refs.roleViewModal.addEventListener("hidden.bs.modal", () => {
      this.$router.push("/roles");
    });
  },
  beforeDestroy() {
    this.roleViewModal.dispose();
  },
  methods: {
    ...mapActions("roles", ["fillRole", "deleteRole"]),
    async onDeleteRole() {
      await this.deleteRole(this.role.id);

      this.roleViewModal.toggle();
    },
    async onFillRole() {
      const error = await this.fillRole(this.role.id);

      if (!error) {
        this.roleViewModal.toggle();
      }
    },
    formatDate(date) {
      const formattedDate = new Date(date);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return formattedDate.toLocaleDateString("en-GB", options);
    },
  },
};
</script>
<style lang="scss" scoped>
.white-space-pre-line {
  white-space: pre-line;
}
</style>
