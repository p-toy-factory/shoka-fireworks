import { defineConfig } from "astro/config";

export default defineConfig({
	output: "static",
	trailingSlash: "ignore",
	i18n: {
		defaultLocale: "en",
		locales: [
			"en",
			{ path: "zh-CN", codes: ["zh-CN"] },
			{ path: "zh-TW", codes: ["zh-TW"] },
			"ja",
			"ko",
		],
		routing: { prefixDefaultLocale: false },
	},
	server: { host: "127.0.0.1", port: 4173 },
	vite: {
		build: { sourcemap: true },
		server: { strictPort: true },
		preview: { strictPort: true },
	},
});
