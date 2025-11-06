import { MONTHS_EN, MONTHS_RU } from "@/constants/months";
import { WEEKDAYS_EN, WEEKDAYS_RU } from "@/constants/weekdays";

export const LOCALES = {
  en: {
    months: MONTHS_EN,
    weekDays: WEEKDAYS_EN,
  },
  ru: {
    months: MONTHS_RU,
    weekDays: WEEKDAYS_RU
  },
} as const;

export type LocaleKey = keyof typeof LOCALES;
export type LocaleData = typeof LOCALES[LocaleKey];