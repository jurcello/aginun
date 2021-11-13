<template>
  <select
    class="form-select language-select border-white"
    :aria-label="$t('Language select')"
    v-model="$i18n.locale"
  >
    <option v-for="locale in locales" :key="locale.code" :value="locale.code">
      {{ locale.label }}
    </option>
  </select>
</template>

<script lang="ts">
import Vue from "vue";
import { loadLanguageAsync } from "@/i18n/utils/load-language-async";

export default Vue.extend({
  name: "LanguageSelect",
  data() {
    return {
      locales: [
        {
          code: "en",
          label: this.$t("English")
        },
        {
          code: "nl",
          label: this.$t("Dutch")
        }
      ]
    };
  },
  methods: {
    async setSelected(lang) {
      await loadLanguageAsync(lang);
    }
  }
});
</script>
<style lang="scss" scoped>
.language-select {
  width: 110px;
}
</style>
