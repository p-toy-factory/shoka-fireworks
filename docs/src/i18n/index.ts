import { en } from "./en";
import { ja } from "./ja";
import { ko } from "./ko";
import { zhCN } from "./zh-CN";
import { zhTW } from "./zh-TW";

export const locales = ["en", "zh-CN", "zh-TW", "ja", "ko"] as const;
export type Locale = (typeof locales)[number];
export type { Messages } from "./en";

export const messages: Record<Locale, typeof en> = {
	en,
	"zh-CN": zhCN,
	"zh-TW": zhTW,
	ja,
	ko,
};

export const languageNames: Record<Locale, string> = {
	en: "English",
	"zh-CN": "简体中文",
	"zh-TW": "繁體中文",
	ja: "日本語",
	ko: "한국어",
};

export function localePath(locale: Locale): string {
	return locale === "en" ? "/" : `/${locale}/`;
}
