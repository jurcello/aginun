<template>
  <div class="role-filters">
    <div class="form-floating mb-4">
      <input
        class="form-control"
        type="search"
        :id="`${inputPrefix}-search-by-title`"
        :value="selectedFilters.search"
        :placeholder="$t('Facilitator, Writer, Photographer...')"
        @input="updateFilter('search', $event.target.value || '')"
      />
      <label for="search-by-title">
        {{ $t("Search by role title") }}
      </label>
    </div>
    <h5 class="heading">{{ $t("Filter groups") }}</h5>
    <floating-tags-input
      v-if="localGroups.length"
      :items="localGroups"
      :selected-items-ids="selectedFilters.localGroups"
      :label="$t('Local group')"
      :input-id="`${inputPrefix}-local-group`"
      item-text="title"
      @change="updateFilter('localGroups', $event)"
    />
    <pulse-loader
      v-else
      class="d-flex justify-content-center my-4"
      :size="10"
    />
    <floating-tags-input
      v-if="workingCircleItems.length"
      class="mb-4"
      :items="workingCircleItems"
      :selected-items-ids="selectedFilters.workingCircles"
      :label="$t('Working circle')"
      :input-id="`${inputPrefix}-working-circle`"
      item-text="title"
      @change="updateFilter('workingCircles', $event)"
    />
    <pulse-loader
      v-else
      class="d-flex justify-content-center my-4"
      :size="10"
    />
    <h5 class="mb-5">{{ $t("Time Commitment") }}</h5>
    <slider
      class="mx-2 px-1"
      :classes="{ tooltip: 'slider-tooltip h6 mb-0' }"
      :value="selectedFilters.timeCommitment"
      :min="timeCommitmentRange.min"
      :max="timeCommitmentRange.max"
      @change="updateFilter('timeCommitment', $event)"
    />
    <div class="text-center mt-4 mb-3">
      <button
        class="btn btn-outline-secondary w-75"
        :disabled="!isUsingFilters"
        @click="clearFilters"
      >
        {{ $t("Clear filters") }}
        <i class="bi bi-trash"></i>
      </button>
    </div>
  </div>
</template>

<script>
import FloatingTagsInput from "@/components/FloatingTagsInput.vue";
import { mapState, mapActions, mapGetters } from "vuex";
import debounce from "lodash/debounce";
import { timeCommitmentRange } from "@/constants/timeCommitments";
import Slider from "@vueform/slider/dist/slider.vue2.js";
import { PulseLoader } from "@saeris/vue-spinners";

export default {
  name: "RoleFilters",
  components: {
    FloatingTagsInput,
    Slider,
    PulseLoader,
  },
  data: () => ({
    timeCommitmentRange,
  }),
  props: {
    inputPrefix: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState("groups", ["localGroups", "workingCircles"]),
    ...mapState("roles", ["selectedFilters"]),
    ...mapGetters({
      isUsingFilters: "roles/isUsingFilters",
    }),
    workingCircleItems() {
      return this.workingCircles.map(({ id, title }) => ({
        id,
        title: title[this.$i18n.locale],
      }));
    },
  },
  methods: {
    ...mapActions("roles", ["setFilter", "setDefaultFilters"]),
    clearFilters() {
      this.setDefaultFilters();
      this.$router.replace("/roles");
    },
    // We need to debounce to avoid updating too often (e.g. while typing the search)
    updateFilter: debounce(function (filterType, filterValue) {
      this.setFilter({ filterType, filterValue });
    }, 500),
  },
};
</script>
<style src="@vueform/slider/themes/default.css"></style>
