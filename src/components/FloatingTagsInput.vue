<template>
  <div class="floating-tags-input position-relative">
    <vue-tags-input
      v-model="tag"
      :placeholder="placeholder"
      :tags="selectedTags"
      :autocomplete-items="autocompleteItems"
      :add-only-from-autocomplete="true"
      :autocomplete-min-length="0"
      @tags-changed="onTagsUpdated"
    />
    <label class="position-absolute fw-bold">
      {{ label }}
    </label>
  </div>
</template>
<script>
import { isArrayValid } from "@/utils/validators";
import VueTagsInput from "@johmun/vue-tags-input";

export default {
  name: "FloatingTagsInput",
  components: {
    VueTagsInput,
  },
  data() {
    return {
      tag: "",
      selectedTags: this.getSelectedTags(this.selectedItemsIds),
    };
  },
  props: {
    items: {
      type: Array,
      required: true,
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
      validator: (items) => isArrayValid(items, Number.isInteger),
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: true,
    },
  },
  computed: {
    autocompleteItems() {
      return this.items
        .filter((item) =>
          item.title.toLowerCase().includes(this.tag.toLowerCase())
        )
        .map(({ title }) => ({ text: title }));
    },
  },
  methods: {
    onTagsUpdated(tags) {
      this.$emit(
        "change",
        tags.map(
          ({ text }) => this.items.find(({ title }) => title === text).id
        )
      );
    },
    getSelectedTags(selectedItemsIds) {
      return this.items
        .filter(({ id }) => selectedItemsIds.includes(id))
        .map(({ title }) => ({ text: title }));
    },
  },
  watch: {
    selectedItemsIds(selectedItemsIds) {
      this.selectedTags = this.getSelectedTags(selectedItemsIds);
    },
  },
};
</script>
