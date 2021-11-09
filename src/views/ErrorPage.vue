<template>
  <div class="container mt-4 mt-md-5 mb-3 text-center">
    <h1 class="mb-4">
      {{ $t("DON'T PANIC.") }}
    </h1>
    <p>
      {{
        isDevMode
          ? $t("The application made a failed request to the server.")
          : $t("Something went wrong")
      }}
      😧
    </p>
    <i18n path="Please email {contactEmail} for help." tag="p">
      <template v-slot:contactEmail>
        <a :href="`mailto:${contactEmail}`" class="text-decoration-underline">{{
          contactEmail
        }}</a>
      </template>
    </i18n>
  </div>
</template>

<script>
import { contactEmail } from "@/constants/contacts";
import { isProduction } from "@/utils/isProduction";

export default {
  name: "ErrorPage",
  data: () => ({
    contactEmail,
    isDevMode: !isProduction()
  })
};
</script>
