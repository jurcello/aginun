<template>
  <div class="support-page">
    <div class="container mt-4 mt-md-5 mb-3">
      <div class="row justify-content-center text-center">
        <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
          <img
            src="@/assets/images/xr-logo-flora.svg"
            alt="XR logo flora"
            class="w-75"
          />
        </div>
        <div class="col-12 col-lg-8 mt-4 mt-md-5">
          <h2>{{ $t("Support") }}</h2>
          <i18n
            path="If you have any questions or need support, send a message to {mattermostContact} on Mattermost."
            tag="p"
          >
            <template v-slot:mattermostContact>
              <a :href="mattermostContact" target="_blank"
                >Volunteer Platform</a
              >
            </template>
          </i18n>
          <h2 class="mt-4 mt-md-5">{{ $t("Contact") }}</h2>
          <i18n
            path="For any more general questions, you can always contact us at {contactEmail}"
            class="mb-4 mb-md-5"
            tag="p"
          >
            <template v-slot:contactEmail>
              <a
                :href="`mailto:${contactEmail}`"
                target="_blank"
                rel="noopener noreferrer"
                >welcome@extinctionrebellion.com</a
              >
            </template>
          </i18n>
        </div>
      </div>
    </div>
    <footer class="bg-primary text-white py-3 px-5 mt-auto">
      <div class="d-flex align-items-center justify-content-center">
        <i class="bi bi-github me-3 fs-1 fs-md-2"></i>
        <i18n
          path="Want to contribute to our tech project? Check out our {githubPage}."
        >
          <template v-slot:githubPage>
            <a
              class="text-white d-none d-md-inline"
              href="https://github.com/xrnl/aginun"
              target="_blank"
              >{{ $t("Github Page") }}</a
            >
            <span class="text-white d-md-none">{{ $t("Github Page") }}</span>
          </template>
        </i18n>
      </div>
      <div class="text-center d-md-none mt-3">
        <a
          role="button"
          class="btn btn-outline-light"
          href="https://github.com/xrnl/aginun"
          target="_blank"
        >
          {{ $t("Go to Github") }}
        </a>
      </div>
    </footer>
  </div>
</template>

<script>
import { contactEmail, mattermostContact } from "@/constants/contacts";

export default {
  name: "SupportPage",
  data: () => ({
    contactEmail,
    mattermostContact,
  }),
};
</script>
<style lang="scss" scoped>
.support-page {
  // We need these styles to be able to push the footer at the bottom.
  // See https://getbootstrap.com/docs/5.1/examples/sticky-footer-navbar/
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - #{$navbar-height});

  @media (min-width: 768px) {
    min-height: calc(100vh - #{$navbar-height-md});
  }
}

.fs-md-2 {
  @media (min-width: 768px) {
    font-size: 2rem !important;
  }
}
</style>
