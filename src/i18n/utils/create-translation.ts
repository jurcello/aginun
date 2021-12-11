import { Translation } from "@/models/translation";

export function createTranslation(value: Partial<Translation> = {}) {
  return {
    en: "",
    nl: "",
    ...value,
  };
}
