<template>
  <div>
    <h5>{{ label }}</h5>
    <validation-provider
      v-if="requiredLanguages.includes('nl')"
      ref="nlForm"
      tag="div"
      class="form-floating my-between-3"
      :rules="rules"
      :name="`${inputId}-nl`"
      v-slot="{ errors }"
    >
      <input
        v-if="isTextField"
        autocomplete="off"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.length }"
        :id="`${inputId}-nl`"
        :placeholder="$t('Dutch')"
        :value="value.nl"
        @input="updateValue('nl', $event.target.value)"
      />
      <textarea
        v-else
        class="form-control"
        :class="{ 'is-invalid': errors.length }"
        :id="`${inputId}-nl`"
        :placeholder="$t('Dutch')"
        :value="value.nl"
        @input="updateValue('nl', $event.target.value)"
      ></textarea>
      <label :for="`${inputId}-nl`">🇳🇱{{ $t("Dutch") }}</label>
      <div class="invalid-feedback" :class="{ 'd-block': errors.length }">
        {{ errors[0] }}
      </div>
    </validation-provider>
    <validation-provider
      v-if="requiredLanguages.includes('en')"
      ref="enForm"
      tag="div"
      class="form-floating my-between-3"
      :rules="rules"
      :name="`${inputId}-en`"
      v-slot="{ errors }"
    >
      <input
        v-if="isTextField"
        autocomplete="off"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.length }"
        :id="`${inputId}-en`"
        :placeholder="$t('English')"
        :value="value.en"
        @input="updateValue('en', $event.target.value)"
      />
      <textarea
        v-else
        class="form-control"
        :class="{ 'is-invalid': errors.length }"
        :id="`${inputId}-en`"
        :placeholder="$t('English')"
        :value="value.en"
        @input="updateValue('en', $event.target.value)"
      ></textarea>
      <label :for="`${inputId}-en`">🇬🇧{{ $t("English") }}</label>
      <div class="invalid-feedback" :class="{ 'd-block': errors.length }">
        {{ errors[0] }}
      </div>
    </validation-provider>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { ValidationProvider } from "vee-validate";
import { Translation } from "@/i18n/models/translation";
import { createTranslation } from "@/i18n/utils/create-translation";

export default Vue.extend({
  name: "MultiLanguageInput",
  components: {
    ValidationProvider
  },
  computed: {
    isTextField() {
      return this.type === "text-field";
    }
  },
  props: {
    requiredLanguages: {
      type: Array,
      required: true
    },
    value: {
      type: Object as () => Translation,
      default: createTranslation()
    },
    label: {
      type: String,
      default: ""
    },
    inputId: {
      type: String,
      required: true
    },
    rules: {
      type: [String, Object],
      default: null
    },
    type: {
      type: String,
      default: "text-field"
    }
  },
  methods: {
    updateValue(key: string, value: string) {
      this.value[key] = value;
      this.$emit("input", this.value);
    }
  },
  watch: {
    value() {
      (this.$refs.nlForm as InstanceType<typeof ValidationProvider>)?.reset();
      (this.$refs.enForm as InstanceType<typeof ValidationProvider>)?.reset();
    }
  }
});
</script>
<style lang="scss" scoped>
textarea.form-control {
  height: 150px;
}
</style>
