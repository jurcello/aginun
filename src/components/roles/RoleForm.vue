<template>
  <ValidationObserver ref="form" v-slot="{ handleSubmit, invalid }">
    <p class="mb-2">
      {{ $t("Choose the languages for this role:") }}
    </p>
    <div class="mb-4">
      <input
        v-model="requiredLanguages"
        type="checkbox"
        class="btn-check"
        id="nl-toggle"
        value="nl"
        :disabled="!requiredLanguages[1] && requiredLanguages[0] === 'nl'"
      />
      <label
        class="btn btn-outline-primary btn-sm rounded-pill"
        for="nl-toggle"
      >
        🇳🇱{{ $t("Dutch") }}
      </label>
      <input
        v-model="requiredLanguages"
        type="checkbox"
        class="btn-check"
        id="en-toggle"
        value="en"
        :disabled="!requiredLanguages[1] && requiredLanguages[0] === 'en'"
      />
      <label
        class="btn btn-outline-primary btn-sm rounded-pill ms-2"
        for="en-toggle"
      >
        🇬🇧{{ $t("English") }}
      </label>
    </div>
    <form @submit.prevent="handleSubmit(onSubmit)" @keyup.enter.prevent>
      <MultiLanguageInput
        class="mb-4"
        rules="required|alpha_spaces|max:30"
        input-id="title"
        :label="$t('Title')"
        :required-languages="requiredLanguages"
        :value="role.title"
        @input="role.title = $event"
      />
      <MultiLanguageInput
        class="mb-4"
        rules="required|max:1000"
        input-id="responsibilities"
        type="textarea"
        :label="$t('Responsibilities')"
        :required-languages="requiredLanguages"
        :value="role.responsibilities"
        @input="role.responsibilities = $event"
      />
      <MultiLanguageInput
        class="mb-4"
        rules="max:1000"
        input-id="description"
        type="textarea"
        :label="$t('Description (optional)')"
        :required-languages="requiredLanguages"
        :value="role.description"
        @input="role.description = $event"
      />
      <MultiLanguageInput
        class="mb-4"
        rules="max:1000"
        input-id="requirements"
        type="textarea"
        :label="$t('Requirements (optional)')"
        :required-languages="requiredLanguages"
        :value="role.requirements"
        @input="role.requirements = $event"
      />
      <h5 class="mb-3">{{ $t("Role info") }}</h5>
      <div class="row g-3 mb-4">
        <div class="col-12 col-lg-6">
          <ValidationProvider
            v-slot="{ errors }"
            rules="required"
            tag="div"
            class="form-floating"
            name="local-group"
          >
            <select
              class="form-select"
              :class="{ 'is-invalid': errors.length }"
              id="local-group-select"
              v-model="role.localGroupId"
            >
              <option :value="undefined">
                {{ $t("Select a local group") }}
              </option>
              <option
                v-for="localGroup in localGroups"
                :key="localGroup.id"
                :value="localGroup.id"
              >
                {{ localGroup.title }}
              </option>
            </select>
            <label for="local-group-select">{{ $t("Local Group") }}</label>
            <div class="invalid-feedback" :class="{ 'd-block': errors.length }">
              {{ errors[0] }}
            </div>
          </ValidationProvider>
        </div>
        <div class="col-12 col-lg-6">
          <ValidationProvider
            v-slot="{ errors }"
            rules="required"
            tag="div"
            class="form-floating"
            name="working-circle"
          >
            <select
              class="form-select"
              :class="{ 'is-invalid': errors.length }"
              id="working-circle-select"
              v-model="role.workingCircleId"
            >
              <option :value="undefined">
                {{ $t("Select a local group") }}
              </option>
              <option
                v-for="workingCircle in workingCircles"
                :key="workingCircle.id"
                :value="workingCircle.id"
              >
                {{ workingCircle.title[$i18n.locale] }}
              </option>
            </select>
            <label for="working-circle-select">{{
              $t("Working circle")
            }}</label>
            <div class="invalid-feedback" :class="{ 'd-block': errors.length }">
              {{ errors[0] }}
            </div>
          </ValidationProvider>
        </div>
        <div class="col-12 col-lg-6">
          <ValidationProvider
            v-slot="{ errors }"
            rules="required"
            tag="div"
            class="form-floating"
            name="time-commitment"
          >
            <select
              class="form-select"
              id="time-commitment-select"
              :class="{ 'is-invalid': errors.length }"
              :value="role.timeCommitmentMin"
              @change="onTimeCommitmentChange($event.target.value)"
            >
              <option :value="undefined">
                {{ $t("Select a time commitment") }}
              </option>
              <option
                v-for="timeCommitment in timeCommitments"
                :key="timeCommitment.min"
                :value="timeCommitment.min"
              >
                {{ timeCommitment.min }} - {{ timeCommitment.max }}
                {{ $t("hours/week") }}
              </option>
            </select>
            <label for="time-commitment-select">{{
              $t("Time commitment")
            }}</label>
            <div class="invalid-feedback" :class="{ 'd-block': errors.length }">
              {{ errors[0] }}
            </div>
          </ValidationProvider>
        </div>
        <div class="col-12 col-lg-6">
          <DatePickerField
            :label="$t('Application deadline (optional)')"
            :date="role.dueDate"
            @input="role.dueDate = $event"
          />
        </div>
      </div>
      <h5 class="mb-3">{{ $t("Contact details") }}</h5>
      <div class="row g-3 mb-4">
        <div class="col-12 col-lg-6">
          <ValidationProvider
            tag="div"
            class="form-floating"
            name="email-address"
            mode="lazy"
            rules="required|email|max:50"
            v-slot="{ errors }"
          >
            <input
              v-model="role.email"
              type="email"
              autocomplete="off"
              class="form-control"
              :class="{ 'is-invalid': errors.length }"
              id="email-control"
              :placeholder="$t('Email')"
            />
            <label for="email-control">{{ $t("Email") }}</label>
            <div class="invalid-feedback" :class="{ 'd-block': errors.length }">
              {{ errors[0] }}
            </div>
          </ValidationProvider>
        </div>
        <div class="col-12 col-lg-6">
          <ValidationProvider
            tag="div"
            class="form-floating"
            mode="lazy"
            name="mattermost-id"
            rules="required|mattermost|max:50"
            v-slot="{ errors }"
          >
            <input
              v-model="role.mattermostId"
              autocomplete="off"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.length }"
              id="mattermost-id-control"
              :placeholder="$t('Mattermost id')"
            />
            <label for="mattermost-id-control">{{ $t("Mattermost id") }}</label>
            <div class="invalid-feedback" :class="{ 'd-block': errors.length }">
              {{ errors[0] }}
            </div>
          </ValidationProvider>
        </div>
        <div class="col-12 col-lg-6">
          <ValidationProvider
            tag="div"
            class="form-floating"
            name="phone-number"
            rules="phone|max:20"
            v-slot="{ errors }"
          >
            <input
              v-model="role.phone"
              autocomplete="off"
              type="tel"
              class="form-control"
              :class="{ 'is-invalid': errors.length }"
              id="phone-number-control"
              :placeholder="$t('Phone number (optional)')"
            />
            <label for="phone-number-control">{{
              $t("Phone number (optional)")
            }}</label>
            <div class="invalid-feedback" :class="{ 'd-block': errors.length }">
              {{ errors[0] }}
            </div>
          </ValidationProvider>
        </div>
      </div>
      <div class="d-flex justify-content-end">
        <button
          type="button"
          class="btn btn-outline-secondary w-25"
          @click="$emit('close')"
        >
          {{ $t("Cancel") }}
        </button>
        <div
          class="ms-2 w-25"
          ref="formInvalidTooltip"
          tabindex="0"
          data-bs-toggle="tooltip"
          :title="$t('Form is incomplete')"
        >
          <button
            class="btn btn-secondary w-100"
            type="submit"
            :disabled="isFormInvalid(invalid)"
          >
            {{ $t("Submit") }}
          </button>
        </div>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { extend, ValidationProvider, ValidationObserver } from "vee-validate";
import {
  required,
  alpha_spaces as alphaSpaces,
  max,
  email,
} from "vee-validate/dist/rules";
import DatePickerField from "@/components/roles/DatePickerField.vue";
import MultiLanguageInput from "@/components/roles/MultiLanguageInput.vue";
import { timeCommitments } from "@/constants/timeCommitments";
import i18n from "@/i18n/i18n";
import { createTranslation } from "@/i18n/utils/create-translation";
import { cloneDeep } from "lodash";
import { Tooltip } from "bootstrap";

extend("required", {
  ...required,
  message: i18n.t("This field is required."),
});
extend("email", {
  ...email,
  message: i18n.t("You must enter a valid email address."),
});
extend("alpha_spaces", {
  ...alphaSpaces,
  message: i18n.t("This field can only contain letters and spaces."),
});
extend("max", {
  ...max,
  message: (_, values) =>
    i18n.t("This field must be under {length} characters.", values),
});
extend("phone", {
  validate: (value) => {
    const phoneRegex = RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/);

    return phoneRegex.test(value);
  },
  message: i18n.t("You must enter a valid phone number"),
});
extend("mattermost", {
  validate: (value) => {
    const mattermostRegex = RegExp(/^@\S+$/);

    return mattermostRegex.test(value);
  },
  message: i18n.t("You must enter a valid Mattermost Id."),
});

const initialRoleState = () => ({
  title: createTranslation(),
  responsibilities: createTranslation(),
  description: createTranslation(),
  requirements: createTranslation(),
  localGroupId: undefined,
  workingCircleId: undefined,
  timeCommitmentMin: undefined,
  timeCommitmentMax: undefined,
  email: undefined,
  mattermostId: undefined,
  phone: undefined,
  dueDate: undefined,
});
const defaultLanguages = ["en", "nl"];

export default {
  name: "RoleForm",
  components: {
    ValidationProvider,
    ValidationObserver,
    DatePickerField,
    MultiLanguageInput,
  },
  props: {
    editRole: {
      default: null,
      type: Object,
    },
  },
  data: () => ({
    role: initialRoleState(),
    formInvalidTooltip: undefined,
    timeCommitments,
    requiredLanguages: defaultLanguages,
  }),
  computed: {
    ...mapState("groups", ["localGroups", "workingCircles"]),
  },
  watch: {
    editRole: {
      handler(editRole) {
        if (!editRole) {
          return;
        }

        const role = cloneDeep(editRole);

        // Delete this extra field we get from the query
        delete role.__typename;

        // Initialize the requiredLanguages array based on the role languages
        this.requiredLanguages = Object.entries(role.title)
          .map(([key, value]) => value && key)
          .filter(Boolean);
        this.role = role;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    ...mapActions("roles", ["updateRole", "createRole"]),
    // Workaround to listen to invalid changes in the form
    isFormInvalid(invalid) {
      if (this.formInvalidTooltip) {
        const action = invalid ? "disable" : "disable";

        this.formInvalidTooltip[action]();
      }

      return invalid;
    },
    onTimeCommitmentChange(timeCommitmentMin) {
      const min = parseInt(timeCommitmentMin, 10);

      this.role.timeCommitmentMin = min;
      this.role.timeCommitmentMax = timeCommitments.find(
        (timeCommitment) => timeCommitment.min === min
      ).max;
    },
    resetState() {
      this.role = initialRoleState();
      this.requiredLanguages = defaultLanguages;
    },
    async onSubmit() {
      const role = {
        ...this.role,
        title: this.parseTranslation(this.role.title),
        responsibilities: this.parseTranslation(this.role.responsibilities),
        description: this.parseTranslation(this.role.description),
        requirements: this.parseTranslation(this.role.requirements),
      };

      let error;

      if (this.editRole) {
        role.id = this.editRole.id;
        error = await this.updateRole(role);
      } else {
        error = await this.createRole(role);
      }

      if (!error) {
        this.$emit("close");
        this.resetState();
        this.$refs.form.reset();
      }
    },
    isEmpty: (text) => !text || text.length === 0 || !text.trim(),
    parseTranslation(translation) {
      return Object.entries(translation).reduce((result, [key, value]) => {
        result[key] = this.requiredLanguages.includes(key) ? value : "";

        return result;
      }, {});
    },
  },
  mounted() {
    this.formInvalidTooltip = new Tooltip(this.$refs.formInvalidTooltip);
  },
  beforeDestroy() {
    this.formInvalidTooltip.dispose();
  },
};
</script>
<style lang="scss" scoped>
.btn-check:disabled + .btn {
  opacity: 1;
}
</style>
