import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:4173";

export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : 2,
	reporter: [["list"], ["html", { open: "never" }]],
	use: {
		baseURL,
		reducedMotion: "no-preference",
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
	},
	projects: [
		{ name: "chromium", use: { ...devices["Desktop Chrome"] } },
		{ name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
	],
	webServer: {
		// Keep Astro 7 in the foreground so Playwright owns the server lifecycle.
		command:
			"pnpm build && pnpm preview --host 127.0.0.1 --port 4173 --ignore-lock",
		url: baseURL,
		reuseExistingServer: false,
	},
});
