import { expect, type Locator, test } from "@playwright/test";
import { localePath, locales, messages } from "../src/i18n";

async function expectTextSize(
	locator: Locator,
	fontSize: string,
	lineHeight: string,
) {
	const sizes = await locator.evaluateAll((elements) =>
		elements.map((element) => {
			const style = getComputedStyle(element);
			return [style.fontSize, style.lineHeight];
		}),
	);
	expect(sizes.length).toBeGreaterThan(0);
	expect(sizes).toEqual(sizes.map(() => [fontSize, lineHeight]));
}

test.beforeEach(async ({ page }) => {
	await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) =>
		route.abort(),
	);
	await page.addInitScript(() => {
		Object.defineProperty(navigator, "clipboard", {
			configurable: true,
			value: { writeText: async () => {} },
		});
	});
	await page.emulateMedia({ reducedMotion: "reduce" });
});

for (const locale of locales) {
	test(`${locale} keeps the typography hierarchy and preview readable`, async ({
		page,
	}, testInfo) => {
		const widths = testInfo.project.name === "chromium" ? [1280] : [320, 390];
		for (const width of widths) {
			await page.setViewportSize({ width, height: 844 });
			await page.goto(localePath(locale));
			await expect(page.locator(".color-text")).toHaveCount(4);

			// Check every step: the document-panel paragraph rule previously
			// overrode installation, usage and API labels and copy feedback.
			const labels = page.locator(".eyebrow");
			await expect(labels).toHaveCount(4);
			await expectTextSize(labels, "12px", "18px");
			expect(
				await labels.evaluateAll((elements) =>
					elements.map((element) => getComputedStyle(element).marginBottom),
				),
			).toEqual(["9px", "9px", "9px", "9px"]);
			await expect(page.locator("h2")).toHaveCount(4);
			await expectTextSize(page.locator("h2, h2 code"), "24px", "33.6px");
			await expect(page.locator("h3#preview-title")).toHaveText(
				messages[locale].playground.preview,
			);
			await expectTextSize(page.locator("h3, h3 code"), "18px", "27px");
			await expectTextSize(page.locator("body"), "14px", "24.5px");
			await expectTextSize(page.locator("pre"), "13px", "23.4px");
			await expectTextSize(
				page.locator(
					".palette .help, .preview-controls > span, .preview-hint, .preview-key, .live, #reset, #add, #copy, #toggle-effects",
				),
				"12px",
				"18px",
			);

			await page.locator('[data-copy="install-command"]').click();
			await page.locator("#copy").click();
			await page.locator("#toggle-effects").click();
			const statuses = page.locator(".copy-status");
			await expect(statuses).toHaveCount(3);
			for (const status of await statuses.all()) {
				await expect(status).toBeVisible();
				await expect(status).toHaveCSS("color", "rgb(187, 222, 214)");
			}
			await expectTextSize(statuses, "12px", "18px");
			await expect(page.locator("#motion-warning")).toBeVisible();
			await expect(page.locator("#motion-warning")).toContainText(
				messages[locale].playground.warning,
			);

			// Both enabled and disabled prompts must fit above the keyboard hint,
			// including translated text wrapped at the smallest viewport.
			for (const textScale of width === 390 ? [1, 2] : [1]) {
				if (textScale === 2) {
					// Fixed pixel typography needs actual text expansion, rather
					// than changing only the root font size or viewport zoom.
					await page
						.locator("header, header *, main *")
						.evaluateAll((elements) => {
							const sizes = elements.map((element) => {
								const style = getComputedStyle(element);
								return [style.fontSize, style.lineHeight];
							});
							for (const [index, element] of elements.entries()) {
								if (!(element instanceof HTMLElement)) continue;
								const [fontSize, lineHeight] = sizes[index];
								element.style.fontSize = `${Number.parseFloat(fontSize) * 2}px`;
								if (lineHeight !== "normal") {
									element.style.lineHeight = `${Number.parseFloat(lineHeight) * 2}px`;
								}
							}
						});
				}
				for (const enabled of [false, true]) {
					const toggle = page.locator("#toggle-effects");
					if ((await toggle.getAttribute("aria-pressed")) !== String(enabled)) {
						await toggle.click();
					}
					const boxes = await page.locator("#preview").evaluate((preview) => {
						const rect = (selector: string) => {
							const element = preview.querySelector(selector);
							if (!element)
								throw new Error(`Missing preview text: ${selector}`);
							return element.getBoundingClientRect().toJSON();
						};
						return {
							preview: preview.getBoundingClientRect().toJSON(),
							prompt: rect("#preview-prompt"),
							hint: rect(".preview-hint"),
							key: rect(".preview-key"),
						};
					});
					expect(boxes.prompt.bottom).toBeLessThanOrEqual(boxes.hint.top);
					expect(boxes.hint.bottom).toBeLessThanOrEqual(boxes.key.top);
					for (const text of [boxes.prompt, boxes.hint, boxes.key]) {
						expect(text.left).toBeGreaterThanOrEqual(boxes.preview.left);
						expect(text.right).toBeLessThanOrEqual(boxes.preview.right);
						expect(text.bottom).toBeLessThanOrEqual(boxes.preview.bottom);
					}
				}
			}
			expect(
				await page.evaluate(
					() => document.documentElement.scrollWidth <= innerWidth,
				),
			).toBe(true);
		}
	});
}
