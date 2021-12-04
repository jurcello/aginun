<template>
  <div class="row">
    <div class="col-12 col-md-6">
      <i class="bi" :class="`bi-${icon}`"></i>
      {{ label }}
    </div>
    <div class="col-12 col-md-6">
      <a :href="href" target="_blank"> {{ linkText }}</a>
    </div>
  </div>
</template>

<script>
import { hrefValidator } from "@/utils/validators";

export default {
  name: "IconLink",
  props: {
    href: {
      required: true,
      type: String,
      validator: hrefValidator,
    },
    icon: {
      required: true,
      type: String,
    },
    linkText: {
      required: true,
      type: String,
    },
    label: {
      required: false,
      default: "",
      type: String,
    },
  },
};
</script>
