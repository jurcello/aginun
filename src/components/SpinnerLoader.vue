<template>
  <div>
    <p v-if="text">
      {{ text }}
    </p>
    <ScaleLoader :loading="true" color="#14aa37" :radius="1" />
  </div>
</template>

<script>
import { ScaleLoader } from "@saeris/vue-spinners";

export default {
  name: "SpinnerLoader",
  components: {
    ScaleLoader,
  },
  props: {
    themeColor: {
      type: String,
      default: "shade",
    },
    text: {
      type: String,
      required: false,
      default: undefined,
    },
  },
};
</script>
