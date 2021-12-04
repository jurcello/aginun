<template>
  <div class="card w-100">
    <div
      class="card-header"
      :style="{
        background: workingCirclesMap[role.workingCircleId].color,
      }"
    ></div>
    <div class="card-body">
      <h4 :if="role.title[$i18n.locale]">
        {{ role.title[$i18n.locale] }}
      </h4>
      <div class="row gx-1">
        <div class="col-6">
          <h5 class="mb-0">
            {{ role.timeCommitmentMin }} - {{ role.timeCommitmentMax }}
          </h5>
          <h6 class="mb-0">
            {{ $t("hours / week") }}
          </h6>
        </div>
        <div class="col-6 d-flex justify-content-end align-items-end">
          {{ localGroupsMap[role.localGroupId].title }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "RoleCard",
  computed: {
    ...mapGetters({
      localGroupsMap: "groups/localGroupsMap",
      workingCirclesMap: "groups/workingCirclesMap",
    }),
  },
  props: {
    role: {
      type: Object,
      required: true,
    },
  },
};
</script>
