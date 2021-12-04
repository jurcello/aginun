<template>
  <div aria-live="polite" aria-atomic="true" class="position-relative">
    <div
      class="toast-container position-absolute p-3 top-0 start-50 translate-middle-x z-index-sticky"
    >
      <div
        class="toast align-items-center"
        :class="`bg-${isSuccess ? 'secondary' : 'danger'}`"
        ref="toast"
      >
        <div class="toast-body text-white d-flex justify-content-between">
          <h5 class="mb-0 text-center w-100">
            {{ alert.message }}
            <i
              class="bi ms-1"
              :class="`bi-${isSuccess ? 'check-lg' : 'exclamation-circle'}`"
            ></i>
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="disableAlert"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapMutations } from "vuex";
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
    ...mapState("alerts", ["alert", "alertOn"]),
    isSuccess() {
      return this.alert.type === AlertType.Success;
    },
  },
  methods: {
    ...mapMutations("alerts", ["disableAlert"]),
  },
  beforeDestroy() {
    this.toast?.dispose();
  },
  watch: {
    alertOn(show) {
      const action = show ? "show" : "hide";
      this.toast[action]();
    },
  },
});
</script>
