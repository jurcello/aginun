<template>
  <div
    class="form-floating floating-tags-input mb-3"
    :class="{
      'is-focused': isFocused,
      'with-tags': selectedTags.length
    }"
  >
    <v-tags-input
      placeholder=""
      v-model="selectedTags"
      :existing-tags="items"
      :input-id="inputId"
      :typeahead="true"
      :typeahead-activation-threshold="activationThreshold"
      :typeahead-hide-discard="true"
      :only-existing-tags="true"
      :text-field="itemText"
      id-field="id"
      typeahead-style="dropdown"
      @focus="onFocus"
      @blur="onBlur"
      @tags-updated="onTagsUpdated"
    />
    <label for="label">
      {{ label }}
    </label>
  </div>
</template>
<script>
import { isArrayValid } from "@/utils/validators";

export default {
  name: "FloatingTagsInput",
  data() {
    const selectedTags = this.items.filter(({ id }) =>
      this.selectedItemsIds.includes(id)
    );

    return {
      selectedTags,
      activationThreshold: 1,
      isFocused: false,
      // The number of initial updates depends on the selected tags.
      // See onTagsUpdated below.
      initialUpdates: selectedTags.length
    };
  },
  props: {
    inputId: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
      // TODO: handle validation with typescript types
      // validator: (items) => {
      //  const objectValidator = makeObjectValidator({
      //    id: "number",
      //    title: "string"
      //  });
      //  return isArrayValid(items, objectValidator);
      // }
    },
    selectedItemsIds: {
      type: Array,
      required: true,
      validator: (items) => isArrayValid(items, Number.isInteger)
    },
    label: {
      type: String,
      required: true
    },
    itemText: {
      type: String,
      required: true
    }
  },
  methods: {
    onBlur() {
      const inputValue = document.querySelector(`#${this.inputId}`).value;

      this.isFocused = Boolean(this.selectedTags.length || inputValue);
    },
    onFocus() {
      this.isFocused = true;
      this.activationThreshold = 0;
    },
    onTagsUpdated() {
      // @tagsUpdated is fired for each tag when they're initialized, this is
      // a workaround to prevent emitting updates for each of the initial tags.
      if (this.initialUpdates) {
        this.initialUpdates--;
        return;
      }

      this.$emit(
        "change",
        this.selectedTags.map(({ id }) => id)
      );
      this.onBlur();
    }
  }
};
</script>
