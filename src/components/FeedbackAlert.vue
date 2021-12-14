<template>
  <div
    class="toast-container position-fixed p-3 top-0 start-50 translate-middle-x"
    aria-live="polite"
    aria-atomic="true"
  >
    <div
      class="toast align-items-center"
      :class="`bg-${isSuccess ? 'secondary' : 'danger'}`"
      ref="toast"
    >
      <div class="toast-body d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <i
            class="bi fs-3"
            :class="`bi-${isSuccess ? 'check-lg' : 'exclamation-circle'}`"
          ></i>
        </div>
        <h5 class="mb-0 text-center mx-2">
          {{ alert.message }}
        </h5>
        <button
          type="button"
          class="btn-close btn-close-white"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { Toast } from "bootstrap";
import { AlertType } from "@/store/modules/alerts";

export default Vue.extend({
  name: "FeedbackAlert",
  data: () => ({
    toast: null as unknown as Toast,
  }),
  mounted() {
    this.toast = new Toast(this.$refs.toast as Element);
  },
  computed: {
    ...mapState("alerts", ["alert"]),
    isSuccess() {
      return this.alert.type === AlertType.Success;
    },
  },
  beforeDestroy() {
    this.toast?.dispose();
  },
  watch: {
    alert() {
      Vue.nextTick(() => {
        this.toast?.show();
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.toast-container {
  z-index: $zindex-tooltip;
}
</style>
