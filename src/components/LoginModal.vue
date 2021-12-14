<template>
  <div
    ref="loginModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="login-modal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-body text-center">
          <h2>{{ $t("Member login") }}</h2>
          <p>
            {{
              $t(
                "Log in to post new vacancies or edit existing ones. Don't have an account yet?"
              )
            }}
            <a
              :href="mattermostContact"
              target="_blank"
              rel="noopener noreferrer"
              >{{ $t("Contact us") }}</a
            >
          </p>
          <validation-observer v-slot="{ invalid }" ref="login_form">
            <form @submit.prevent="handleSubmit">
              <validation-provider
                v-slot="{ errors }"
                name="username"
                rules="required"
              >
                <div class="form-floating mb-3">
                  <input
                    v-model="username"
                    type="text"
                    id="username"
                    class="form-control"
                    :class="{ 'is-invalid': errors.length }"
                    :placeholder="$t('Username')"
                  />
                  <label for="username"> {{ $t("Username") }}</label>
                  <div
                    class="invalid-feedback text-start"
                    :class="{ 'd-block': errors.length }"
                  >
                    {{ errors[0] }}
                  </div>
                </div>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="password"
                rules="required"
              >
                <div class="form-floating mb-4">
                  <input
                    v-model="password"
                    type="password"
                    id="password"
                    class="form-control"
                    :class="{ 'is-invalid': errors.length }"
                    :placeholder="$t('Password')"
                  />
                  <label for="password"> {{ $t("Password") }}</label>
                  <div
                    class="invalid-feedback text-start"
                    :class="{ 'd-block': errors.length }"
                  >
                    {{ errors[0] }}
                  </div>
                </div>
              </validation-provider>
              <div class="d-flex justify-content-end">
                <button
                  class="btn btn-outline-secondary w-25"
                  type="button"
                  :disabled="serverLoading"
                  @click="loginModal.toggle()"
                >
                  {{ $t("Cancel") }}
                </button>
                <button
                  class="btn btn-secondary ms-2 w-25"
                  type="submit"
                  :disabled="invalid || serverLoading"
                >
                  <pulse-loader
                    v-if="serverLoading"
                    color="white"
                    class="d-flex justify-content-center"
                    :size="10"
                  />
                  <template v-else>{{ $t("Log in") }}</template>
                </button>
              </div>
            </form>
          </validation-observer>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { PulseLoader } from "@saeris/vue-spinners";
import { mattermostContact } from "@/constants/contacts";
import { isProduction } from "@/utils/isProduction";
import { Modal } from "bootstrap";

export default Vue.extend({
  name: "LoginModal",
  data() {
    return {
      loginModal: null as unknown as Modal,
      mattermostContact,
      username: !isProduction() ? "kaj-dev" : "",
      password: !isProduction() ? "test" : "",
      serverError: "",
      serverLoading: false,
    };
  },
  components: {
    ValidationProvider,
    ValidationObserver,
    PulseLoader,
  },
  methods: {
    ...mapActions("user", ["login"]),
    ...mapActions("alerts", ["displayError"]),
    resetForm() {
      this.username = !isProduction() ? "kaj-dev" : "";
      this.password = !isProduction() ? "test" : "";
      this.serverLoading = false;
      this.serverError = "";
      (
        this.$refs.login_form as InstanceType<typeof ValidationProvider>
      ).reset();
    },
    async handleSubmit() {
      const { username, password } = this;

      this.serverLoading = true;
      this.serverError = await this.login({
        username,
        password,
      });
      this.serverLoading = false;

      if (this.serverError) {
        this.displayError(this.serverError);

        return;
      }

      this.resetForm();
      this.loginModal.hide();
    },
  },
  mounted() {
    this.loginModal = new Modal(this.$refs.loginModal as Element);
    this.loginModal.toggle();

    (this.$refs.loginModal as Element).addEventListener(
      "hidden.bs.modal",
      () => {
        this.$emit("closed");
      }
    );
  },
  beforeDestroy() {
    this.loginModal.dispose();
  },
});
</script>
