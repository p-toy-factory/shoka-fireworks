import { expect, test } from "@playwright/test";
import { messages } from "../src/i18n";

test.beforeEach(async ({ page }) => {
	await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
	await page.route("https://fonts.gstatic.com/**", (route) => route.abort());
});

test("copies the install command and the current palette example", async ({
	page,
}) => {
	await page.addInitScript(() => {
		const copied: string[] = [];
		Object.defineProperty(window, "clipboardWrites", { value: copied });
		Object.defineProperty(navigator, "clipboard", {
			configurable: true,
			value: {
				writeText: async (text: string) => {
					copied.push(text);
				},
			},
		});
	});
	await page.goto("/");

	await page.getByRole("button", { name: "Copy command", exact: true }).click();
	await expect(page.locator("#install-copy-status")).toHaveText(
		"Copied to clipboard.",
	);
	await expect
		.poll(() =>
			page.evaluate(() => Reflect.get(window, "clipboardWrites") as string[]),
		)
		.toEqual(["npm install shoka-fireworks"]);

	await page.getByLabel("Color 01", { exact: true }).fill("#123456");
	const snippet = await page.locator("#snippet").textContent();
	expect(snippet).toContain("#123456");
	await page.getByRole("button", { name: "Copy example", exact: true }).click();
	await expect(page.locator("#copy-status")).toHaveText("Copied to clipboard.");
	await expect
		.poll(() =>
			page.evaluate(() => Reflect.get(window, "clipboardWrites") as string[]),
		)
		.toEqual(["npm install shoka-fireworks", snippet]);

	await page.getByLabel("Color 01", { exact: true }).fill("#654321");
	await expect(page.locator("#copy-status")).toBeEmpty();
	await expect(page.locator("#snippet")).toContainText("#654321");
});

for (const target of [
	{
		button: "Copy command",
		code: "#install-command",
		status: "#install-copy-status",
	},
	{ button: "Copy example", code: "#snippet", status: "#copy-status" },
]) {
	test(`${target.button} selects its code when clipboard permission is denied`, async ({
		page,
	}) => {
		await page.addInitScript(() => {
			const attempted: string[] = [];
			Object.defineProperty(window, "clipboardWrites", { value: attempted });
			Object.defineProperty(navigator, "clipboard", {
				configurable: true,
				value: {
					writeText: async (text: string) => {
						attempted.push(text);
						throw new DOMException("Permission denied", "NotAllowedError");
					},
				},
			});
		});
		await page.goto("/");
		if (target.code === "#snippet") {
			await page.getByLabel("Color 01", { exact: true }).fill("#abcdef");
		}
		const code = await page.locator(target.code).textContent();
		await page
			.getByRole("button", { name: target.button, exact: true })
			.click();
		await expect(page.locator(target.status)).toHaveText(
			messages.en.runtime.clipboardUnavailable,
		);
		await expect
			.poll(() =>
				page.evaluate(() => Reflect.get(window, "clipboardWrites") as string[]),
			)
			.toEqual([code]);
		await expect
			.poll(() => page.evaluate(() => window.getSelection()?.toString()))
			.toBe(code);
	});
}
