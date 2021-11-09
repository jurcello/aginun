import { mount, createLocalVue } from "@vue/test-utils";
import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VueAxios from "vue-axios";
import Spinner from "@/components/Spinner.vue";
import FloatingTagsInput from "@/components/FloatingTagsInput.vue";
import IconLink from "@/components/IconLink.vue";
import DatePickerField from "@/components/roles/DatePickerField.vue";
import LanguageSelect from "@/components/LanguageSelect.vue";
import i18n from "@/i18n/i18n";

Vue.use(VueAxios, axios);

describe("Spinner", () => {
  const localVue = createLocalVue();

  localVue.use(Vuex);

  const mountFunction = (options) => mount(Spinner, { localVue, ...options });

  const spinnerSelector = "div > div > div";

  it("by default renders spinner and no text", () => {
    const wrapper = mountFunction();
    const spinnerTags = wrapper.findAll(spinnerSelector);
    expect(spinnerTags.length).toBeGreaterThan(0);
    expect(wrapper.find("p").exists()).toBeFalsy();
  });

  it("prop text is rendered", () => {
    const text = "text";
    const wrapper = mountFunction({ propsData: { text } });
    expect(wrapper.find("p").text()).toBe(text);
  });
});

describe("AutocompleteCustom", () => {
  const localVue = createLocalVue();

  const items = [
    { id: 1, title: "Enschede" },
    { id: 2, title: "Brabant" }
  ];

  const label = "Local group";

  const mountFunction = (options) =>
    mount(FloatingTagsInput, {
      localVue,
      propsData: {
        label,
        items,
        selectedItemsIds: [],
        itemText: "title",
        inputId: "id"
      },
      stubs: ["v-tags-input"],
      ...options
    });

  it("prop label is rendered", () => {
    const wrapper = mountFunction();
    expect(wrapper.find("label").text()).toBe(label);
  });

  it("prop selectedItemsIds validation works", () => {
    const { validator } = FloatingTagsInput.props.selectedItemsIds;

    expect(validator([1, 2])).toBeTruthy();
    expect(validator([1, 2.5])).toBeFalsy();
    expect(validator(["1", "2"])).toBeFalsy();
  });

  it("selected items are rendered", () => {
    const selectedItemsIds = items.map((item) => item.id);
    const wrapper = mountFunction({
      propsData: {
        label,
        items,
        selectedItemsIds,
        itemText: "title",
        inputId: "id"
      }
    });
    const renderedItems = wrapper.findAll("v-chip__content");
    for (let i = 0; i < renderedItems.length; i += 1) {
      expect(renderedItems.at(i).text()).toBe(items[i].title);
    }
  });
});

describe("IconLink", () => {
  const localVue = createLocalVue();

  const href = "https://organise.earth";
  const linkText = "@username";
  const label = "Mattermost";
  const icon = "mdi-message";

  const mountFunction = (options) =>
    mount(IconLink, {
      localVue,
      propsData: {
        href,
        linkText,
        label,
        icon
      },
      ...options
    });

  it("prop href validation works", () => {
    const { validator } = IconLink.props.href;

    expect(validator("https://organise.earth")).toBeTruthy();
    expect(validator("mailto:test@protonmail.com")).toBeTruthy();
    expect(validator("tel:+31625549011")).toBeTruthy();
    expect(validator("www.organise.earth")).toBeFalsy();
  });

  it("href prop is rendered", () => {
    const wrapper = mountFunction();
    expect(wrapper.find("a").attributes("href")).toBe(href);
  });

  it("linkText prop is rendered", () => {
    const wrapper = mountFunction();
    expect(wrapper.find("a").text()).toBe(linkText);
  });

  it("label prop is rendered", () => {
    const wrapper = mountFunction();
    expect(wrapper.find(".row div:first-child").text()).toBe(label);
  });

  it("prop icon is rendered", () => {
    const wrapper = mountFunction();
    expect(wrapper.find(`i.bi-${icon}`).exists()).toBeTruthy();
  });
});

// TODO: fix the failing tests
describe.skip("DatePickerField", () => {
  const localVue = createLocalVue();
  const label = "Application deadline";

  const mountFunction = (date) =>
    mount(DatePickerField, {
      localVue,
      propsData: {
        label,
        date
      }
    });

  it("prop label is rendered", () => {
    const wrapper = mountFunction();
    expect(wrapper.get("label").text()).toBe(label);
  });

  it("prop date is shown in DD/MM/YYYY format in the input field when passed", () => {
    const date = new Date().toISOString();
    const wrapper = mountFunction(date);
    const [year, month, day] = date.split("-");
    const formattedDate = `${day.substr(0, 2)}/${month.substr(0, 2)}/${year}`;
    expect(wrapper.get("#date-picker").element.value).toBe(formattedDate);
  });

  it("input field is empty when no date is passed as prop", () => {
    const wrapper = mountFunction();
    expect(wrapper.get("input").element.value).toBe("");
  });

  it("emits an update with the correct date", async () => {
    const wrapper = mountFunction();
    await wrapper.get("#date-picker").trigger("focus");
    await wrapper
      // the first date available is today
      .get(".is-today")
      .trigger("click");
    const emitted = wrapper.emitted().update[0][0];

    const expected = new Date();
    // the date we receive will always be at midnight,
    // so we need to set the expected date to match it
    expected.setUTCHours(0, 0, 0, 0);
    expect(emitted).toBe(expected.toISOString());
  });
});

describe("LanguageSelect", () => {
  let wrapper;
  let localVue;

  beforeAll(() => {
    localVue = createLocalVue();
    localVue.use(i18n);
    wrapper = mount(LanguageSelect, {
      i18n
    });
  });

  it("component is rendered", () => {
    expect(wrapper.get(".language-select").element.value).toBe("en");
  });
});
