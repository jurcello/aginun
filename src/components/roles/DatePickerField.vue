<template>
  <date-picker
    v-model="model"
    trim-weeks
    :min-date="new Date().toISOString()"
    :popover="{ visibility: 'focus' }"
    :model-config="{ type: 'string' }"
    :select-attribute="selectAttribute"
    @input="$emit('input', $event)"
  >
    <template v-slot="{ inputValue, inputEvents }">
      <div class="form-floating">
        <input
          autocomplete="off"
          type="text"
          class="form-control"
          id="date-picker"
          :placeholder="label"
          :value="inputValue"
          v-on="inputEvents"
        />
        <label for="date-picker">
          {{ label }}
        </label>
      </div>
    </template>
  </date-picker>
</template>

<script>
import DatePicker from "v-calendar/lib/components/date-picker.umd";

export default {
  name: "DatePickerField",
  components: {
    DatePicker,
  },
  props: {
    date: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      model: this.date || null,
      selectAttribute: {
        highlight: {
          style: {
            background: "#14aa7d",
          },
          contentStyle: {
            color: "#fff",
          },
        },
      },
    };
  },
};
</script>
