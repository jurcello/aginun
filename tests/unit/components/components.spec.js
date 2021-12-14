import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import SpinnerLoader from "@/components/SpinnerLoader.vue";
import FloatingTagsInput from "@/components/FloatingTagsInput.vue";
import IconLink from "@/components/IconLink.vue";
import LanguageSelect from "@/components/LanguageSelect.vue";
import i18n from "@/i18n/i18n";

describe("SpinnerLoader", () => {
  const localVue = createLocalVue();

  localVue.use(Vuex);

  const mountFunction = (options) =>
    mount(SpinnerLoader, { localVue, ...options });

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
    { id: 2, title: "Brabant" },
  ];

  const label = "Local group";

  const mountFunction = (options) =>
    mount(FloatingTagsInput, {
      localVue,
      propsData: {
        label,
        items,
        selectedItemsIds: [],
        placeholder: "placeholder",
      },
      stubs: ["vue-tags-input"],
      ...options,
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
        placeholder: "placeholder",
      },
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
        icon,
      },
      ...options,
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

describe("LanguageSelect", () => {
  let wrapper;
  let localVue;

  beforeAll(() => {
    localVue = createLocalVue();
    localVue.use(i18n);
    wrapper = mount(LanguageSelect, {
      i18n,
    });
  });

  it("component is rendered", () => {
    expect(wrapper.get(".language-select").element.value).toBe("en");
  });
});
