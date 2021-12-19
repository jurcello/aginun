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
    <h5>{{ $t("Filter groups") }}</h5>
    <div class="mb-3">
      <FloatingTagsInput
        v-if="localGroups.length"
        :items="localGroups"
        :selected-items-ids="selectedFilters.localGroups"
        :label="$t('Local groups')"
        :placeholder="$t('Add group')"
        @change="updateFilter('localGroups', $event)"
      />
      <PulseLoader
        v-else
        class="d-flex justify-content-center my-4"
        color="#3860aa"
        :size="10"
      />
    </div>
    <div class="mb-3">
      <FloatingTagsInput
        v-if="workingCircleItems.length"
        :items="workingCircleItems"
        :selected-items-ids="selectedFilters.workingCircles"
        :label="$t('Working circles')"
        :placeholder="$t('Add circle')"
        @change="updateFilter('workingCircles', $event)"
      />
      <PulseLoader
        v-else
        class="d-flex justify-content-center my-4"
        color="#3860aa"
        :size="10"
      />
    </div>
    <div class="mb-5">
      <h5 class="mb-0">{{ $t("Time Commitment") }}</h5>
      <span class="text-muted">({{ $t("hours/week") }})</span>
    </div>
    <Slider
      class="mx-2 px-1"
      :classes="{ tooltip: 'slider-tooltip h6 mb-0' }"
      :value="selectedFilters.timeCommitment"
      :min="timeCommitmentRange.min"
      :max="timeCommitmentRange.max"
      @change="updateFilter('timeCommitment', $event)"
    />
    <div class="mt-4 mb-3 d-flex justify-content-center">
      <div :class="{ 'cursor-not-allowed': !isUsingFilters }">
        <button
          class="btn btn-outline-secondary"
          :disabled="!isUsingFilters"
          @click="clearFilters"
        >
          {{ $t("Clear filters") }}
          <i class="bi bi-trash"></i>
        </button>
      </div>
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
