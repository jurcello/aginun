<template>
  <div>
    <button type="button" class="btn btn-outline-danger" ref="deleteRoleButton">
      <i class="bi bi-trash-fill fs-5"></i>
    </button>
    <div class="d-none">
      <div ref="deletePopover" class="text-center">
        <h5>
          {{ $t("Are you sure you want to delete this role? ") }}
        </h5>
        <button type="button" class="btn btn-danger" @click="$emit('delete')">
          {{ $t("Delete") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Popover } from "bootstrap";

export default {
  name: "DeleteRoleButton",
  data() {
    return {
      deletePopover: null
    };
  },
  mounted() {
    this.deletePopover = new Popover(this.$refs.deleteRoleButton, {
      html: true,
      content: this.$refs.deletePopover,
      trigger: "focus",
      placement: "bottom"
    });
  },
  beforeDestroy() {
    this.deletePopover.dispose();
  }
};
</script>
