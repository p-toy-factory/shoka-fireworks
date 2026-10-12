import { expect, test } from "@playwright/test";
import { type Locale, languageNames, locales, messages } from "../src/i18n";

const localePath = (locale: Locale) => (locale === "en" ? "/" : `/${locale}/`);

async function waitForHeaderTransition(page: import("@playwright/test").Page) {
	await page.locator("header#top").evaluate(async (header) => {
		await Promise.all(
			header
				.getAnimations({ subtree: true })
				.map((animation) => animation.finished.catch(() => undefined)),
		);
	});
}

test.beforeEach(async ({ page }) => {
	await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) =>
		route.abort(),
	);
});

for (const locale of locales) {
	const text = messages[locale];
	const path = localePath(locale);

	test.describe(locale, () => {
		test("loads and refreshes localized content and section navigation", async ({
			page,
		}) => {
			if (locale !== "en") {
				const response = await page.goto(path.slice(0, -1));
				expect(response?.ok()).toBe(true);
				await expect(page.locator("html")).toHaveAttribute("lang", locale);
				await expect(page.locator(".color-text")).toHaveCount(4);
			}
			await page.goto(path);
			for (const refresh of [false, true]) {
				if (refresh) await page.reload();
				await expect(page.locator("html")).toHaveAttribute("lang", locale);
				await expect(page).toHaveTitle(text.meta.title);
				await expect(page.locator('meta[name="description"]')).toHaveAttribute(
					"content",
					text.meta.description,
				);
				await expect(page.getByRole("heading", { level: 1 })).toContainText(
					text.intro.lineOne,
				);
				await expect(page.locator("#snippet")).toContainText(
					"shouldPlayAnimation: () => !reducedMotion.matches",
				);
			}
			const navigation = page.getByRole("navigation", {
				name: text.nav.sections,
			});
			for (const [name, id] of [
				[text.nav.install, "installation"],
				[text.nav.playground, "playground"],
				[text.nav.example, "quick-start"],
				[text.nav.api, "api-reference"],
			]) {
				await navigation.getByRole("link", { name, exact: true }).click();
				await expect(page).toHaveURL(new RegExp(`${path}#${id}$`));
				await expect(page.locator(`#${id}`)).toBeInViewport();
			}
			expect(
				await page.evaluate(
					() => document.documentElement.scrollWidth <= innerWidth,
				),
			).toBe(true);
		});

		test("keeps section links in a compact sticky header on narrow screens", async ({
			page,
		}) => {
			const sectionLinks = [
				[text.nav.install, "installation"],
				[text.nav.playground, "playground"],
				[text.nav.example, "quick-start"],
				[text.nav.api, "api-reference"],
			] as const;
			const header = page.locator("header#top");
			const navigation = page.getByRole("navigation", {
				name: text.nav.sections,
			});

			for (const width of [320, 390]) {
				await page.setViewportSize({ width, height: 844 });
				await page.goto(path);
				await expect(header).toHaveCSS("position", "sticky");
				await expect(header.locator(".brand")).toBeVisible();
				await expect(header.locator(".language-picker")).toBeVisible();
				await expect(header.locator(".github-link")).toBeVisible();
				for (const [name] of sectionLinks) {
					await expect(
						navigation.getByRole("link", { name, exact: true }),
					).toBeVisible();
				}

				await page.evaluate(() => window.scrollTo(0, 200));
				await expect(header).toHaveAttribute("data-stuck", "");
				await expect(header.locator(".brand")).toBeHidden();
				await expect(header.locator(".language-picker")).toBeHidden();
				await expect(header.locator(".github-link")).toBeHidden();
				await expect(header).toHaveCSS("position", "sticky");
				expect(
					await header.evaluate(
						(element) => element.getBoundingClientRect().top,
					),
				).toBeCloseTo(0, 0);
				expect(
					await page.evaluate(
						() => document.documentElement.scrollWidth <= innerWidth,
					),
				).toBe(true);

				for (const [name, id] of sectionLinks) {
					const link = navigation.getByRole("link", { name, exact: true });
					await expect(link).toBeVisible();
					await link.click();
					await expect(page).toHaveURL(new RegExp(`${path}#${id}$`));
					await expect(page.locator(`#${id}`)).toBeInViewport();
					const positions = await page.evaluate((targetId) => {
						const stickyHeader = document.querySelector("header#top");
						const target = document.getElementById(targetId);
						if (!stickyHeader || !target) return null;
						return {
							headerBottom: stickyHeader.getBoundingClientRect().bottom,
							targetTop: target.getBoundingClientRect().top,
						};
					}, id);
					expect(positions).not.toBeNull();
					expect(positions?.targetTop).toBeGreaterThanOrEqual(
						positions?.headerBottom ?? 0,
					);
				}
			}
		});

		test("language links preserve the section and start a fresh palette", async ({
			page,
		}) => {
			await page.goto(`${path}#playground`);
			await page.evaluate(() => window.scrollTo(0, 0));
			await expect(page.locator("header#top")).not.toHaveAttribute(
				"data-stuck",
			);
			const destinations = [
				...locales.filter((target) => target !== locale),
				locale,
			];
			for (const target of destinations) {
				await page.locator(".color-text").first().fill("#123456");
				await expect(page.locator("#snippet")).toContainText("#123456");
				await page.evaluate(() => {
					document.documentElement.dataset.navigationMarker = "old-document";
				});
				// Editing scrolls the compact mobile header into its navigation-only state.
				await page.evaluate(() => window.scrollTo(0, 0));
				await expect(page.locator("header#top")).not.toHaveAttribute(
					"data-stuck",
				);
				await waitForHeaderTransition(page);
				await page.locator("summary.language-trigger").click();
				await page.locator(`a[data-locale="${target}"]`).click();
				await expect(page).toHaveURL(
					`${new URL(localePath(target), page.url())}#playground`,
				);
				await expect(page.locator("html")).toHaveAttribute("lang", target);
				await expect(page.locator("html")).not.toHaveAttribute(
					"data-navigation-marker",
				);
				await expect(page.locator(".color-text")).toHaveCount(4);
				await expect(page.locator("#snippet")).not.toContainText("colors:");
			}
		});

		test("opens the language picker with the keyboard and follows a language link", async ({
			page,
		}) => {
			await page.goto(path);
			const picker = page.locator("details.language-picker");
			const trigger = picker.locator("summary.language-trigger");
			const navigation = picker.getByRole("navigation", {
				name: text.nav.language,
			});
			await expect(trigger).toHaveAccessibleName(
				`${text.nav.language}: ${languageNames[locale]}`,
			);
			await expect(picker).not.toHaveAttribute("open");
			await expect(navigation).toBeHidden();
			await trigger.focus();
			await page.keyboard.press("Space");
			await expect(picker).toHaveAttribute("open", "");
			await expect(navigation).toBeVisible();
			await expect(navigation.getByRole("link")).toHaveCount(locales.length);
			await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1);
			await expect(
				navigation.locator(`a[data-locale="${locale}"]`),
			).toHaveAttribute("aria-current", "page");
			await page.keyboard.press("Tab");
			await expect(navigation.locator('a[data-locale="en"]')).toBeFocused();
			await page.keyboard.press("Enter");
			await expect(page).toHaveURL(new URL("/", page.url()).href);
			await expect(page.locator("html")).toHaveAttribute("lang", "en");
			await expect(picker).not.toHaveAttribute("open");
		});

		test("dismisses the language picker with Escape, an outside click and focus leaving", async ({
			page,
		}) => {
			await page.goto(path);
			const picker = page.locator("details.language-picker");
			const trigger = picker.locator("summary.language-trigger");
			await trigger.focus();
			await page.keyboard.press("Enter");
			await page.keyboard.press("Tab");
			await expect(picker.locator('a[data-locale="en"]')).toBeFocused();
			await page.keyboard.press("Escape");
			await expect(picker).not.toHaveAttribute("open");
			await expect(trigger).toBeFocused();

			await trigger.click();
			await expect(picker).toHaveAttribute("open", "");
			await page.getByRole("heading", { level: 1 }).click();
			await expect(picker).not.toHaveAttribute("open");

			await page.evaluate(() => window.scrollTo(0, 0));
			await expect(page.locator("header#top")).not.toHaveAttribute(
				"data-stuck",
			);
			await waitForHeaderTransition(page);
			await trigger.focus();
			await page.keyboard.press("Enter");
			for (const target of locales) {
				await page.keyboard.press("Tab");
				await expect(
					picker.locator(`a[data-locale="${target}"]`),
				).toBeFocused();
				await expect(picker).toHaveAttribute("open", "");
			}
			await page.keyboard.press("Tab");
			await expect(picker).not.toHaveAttribute("open");
		});

		test("localizes palette validation and keeps editing, adding and resetting functional", async ({
			page,
		}) => {
			await page.goto(path);
			const colors = page.locator(".color-text");
			const input = colors.first();
			const snippet = page.locator("#snippet");
			const initial = await snippet.textContent();
			await expect(input).toHaveAccessibleName(
				text.runtime.colorLabel.replace("{number}", "01"),
			);
			await input.fill("not-a-color");
			await expect(input).toHaveAttribute("aria-invalid", "true");
			await expect(input).toHaveAccessibleDescription(
				text.runtime.invalidColor,
			);
			await expect(snippet).toHaveText(initial ?? "");
			await input.fill("#abcdef");
			await expect(input).not.toHaveAttribute("aria-invalid");
			await expect(snippet).toContainText('"#abcdef"');
			await expect(snippet.locator("code .line").first()).toBeAttached();
			await expect(snippet.locator("code span[style]").first()).toBeAttached();
			await page.locator("#add").click();
			await expect(colors).toHaveCount(5);
			await expect(colors.last()).toBeFocused();
			await expect(colors.last()).toHaveAccessibleName(
				text.runtime.colorLabel.replace("{number}", "05"),
			);
			await page.locator("#reset").click();
			await expect(colors).toHaveCount(4);
			await expect(snippet).toHaveText(initial ?? "");
			await expect(snippet.locator("code .line").first()).toBeAttached();
		});

		for (const permission of ["granted", "denied"] as const) {
			test(`localizes clipboard feedback when permission is ${permission}`, async ({
				page,
			}) => {
				await page.addInitScript((deny) => {
					Object.defineProperty(navigator, "clipboard", {
						configurable: true,
						value: {
							writeText: async (value: string) => {
								Reflect.set(window, "lastCopiedText", value);
								if (deny) throw new DOMException("Denied", "NotAllowedError");
							},
						},
					});
				}, permission === "denied");
				await page.goto(path);
				await page.locator(".color-text").first().fill("#123456");
				for (const [button, code, status] of [
					[
						'[data-copy="install-command"]',
						"#install-command",
						"#install-copy-status",
					],
					["#copy", "#snippet", "#copy-status"],
				]) {
					const expected = await page.locator(code).textContent();
					await page.locator(button).click();
					await expect(page.locator(status)).toHaveText(
						permission === "granted"
							? text.runtime.copied
							: text.runtime.clipboardUnavailable,
					);
					await expect
						.poll(() =>
							page.evaluate(() => Reflect.get(window, "lastCopiedText")),
						)
						.toBe(expected);
					if (permission === "denied") {
						await expect
							.poll(() =>
								page.evaluate(() => window.getSelection()?.toString()),
							)
							.toBe(expected);
					}
				}
			});
		}

		test("localizes effect controls and respects live Reduced Motion changes", async ({
			page,
		}) => {
			await page.emulateMedia({ reducedMotion: "reduce" });
			await page.goto(path);
			const warning = page.locator("#motion-warning");
			const preview = page.locator("#preview");
			const toggle = page.locator("#toggle-effects");
			await expect(warning).toBeVisible();
			await expect(warning).toContainText(text.playground.warningTitle);
			await expect(warning).toContainText(text.playground.warning);
			await expect(preview).toHaveAttribute(
				"aria-describedby",
				"motion-warning",
			);
			await toggle.click();
			await expect(preview).toBeDisabled();
			await expect(page.locator("body > canvas")).toHaveCount(0);
			await expect(page.locator("#preview-status")).toHaveText(
				text.runtime.previewOffStatus,
			);
			await toggle.click();
			await expect(preview).toBeEnabled();
			await expect(page.locator("body > canvas")).toHaveCount(1);
			await expect(page.locator("#preview-status")).toHaveText(
				text.runtime.previewOnStatus,
			);
			await page.emulateMedia({ reducedMotion: "no-preference" });
			await expect(warning).toBeHidden();
			await expect(preview).not.toHaveAttribute("aria-describedby");
		});
	});

	test.describe(`${locale} server HTML`, () => {
		test.use({ javaScriptEnabled: false });
		test("renders documentation, language anchors and an initial example without JavaScript", async ({
			page,
		}) => {
			await page.goto(path);
			const header = page.locator("header#top");
			const sectionNavigation = page.getByRole("navigation", {
				name: text.nav.sections,
			});
			await expect(header).toHaveCSS("position", "sticky");
			await expect(sectionNavigation.getByRole("link")).toHaveCount(4);
			await expect(page.locator("html")).toHaveAttribute("lang", locale);
			await expect(page).toHaveTitle(text.meta.title);
			await expect(page.getByRole("heading", { level: 1 })).toContainText(
				text.intro.lineOne,
			);
			for (const id of [
				"installation",
				"playground",
				"quick-start",
				"api-reference",
			]) {
				await expect(page.locator(`#${id}`)).toContainText(/\S/);
			}
			await expect(page.locator("#install-command")).toHaveText(
				"npm install shoka-fireworks",
			);
			await expect(page.locator("#snippet")).toContainText(
				"shouldPlayAnimation: () => !reducedMotion.matches",
			);
			await sectionNavigation
				.getByRole("link", { name: text.nav.install, exact: true })
				.click();
			await expect(page.locator("#installation")).toBeInViewport();
			await expect(header.locator(".brand")).toBeVisible();
			await expect(header.locator(".language-picker")).toBeVisible();
			await expect(header.locator(".github-link")).toBeVisible();
			await expect(sectionNavigation.getByRole("link")).toHaveCount(4);
			await expect(
				page.locator("#snippet code span[style]").first(),
			).toBeAttached();
			const picker = page.locator("details.language-picker");
			const trigger = picker.locator("summary.language-trigger");
			await expect(picker).not.toHaveAttribute("open");
			await expect(picker.locator("nav.language-nav")).toBeHidden();
			await trigger.click();
			await expect(picker).toHaveAttribute("open", "");
			await expect(picker.locator("nav.language-nav")).toBeVisible();
			for (const target of locales) {
				await expect(
					page.locator(`a[data-locale="${target}"]`),
				).toHaveAttribute("href", localePath(target));
				await expect(page.locator(`a[data-locale="${target}"]`)).toBeVisible();
			}
			const target = locales.find((candidate) => candidate !== locale) ?? "en";
			await picker.locator(`a[data-locale="${target}"]`).click();
			await expect(page).toHaveURL(
				new URL(localePath(target), page.url()).href,
			);
			await expect(page.locator("html")).toHaveAttribute("lang", target);
			await expect(picker).not.toHaveAttribute("open");
		});
	});
}
