import { expect, test } from "@playwright/test";
import { DEFAULT_COLORS } from "../../src/default-colors";

test.beforeEach(async ({ page }) => {
	await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) =>
		route.abort(),
	);
	await page.goto("/");
});

test("renders the docs and navigates between sections without page overflow", async ({
	page,
}) => {
	await expect(page).toHaveTitle("Shoka Fireworks · Get started");
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(
		"Make a littlefirework magic.",
	);
	await expect(page.getByRole("textbox", { name: /^Color / })).toHaveCount(4);
	await expect(page.locator("#snippet")).toContainText(
		"shouldPlayAnimation: () => !reducedMotion.matches",
	);
	await expect(page.locator("#snippet")).not.toContainText("colors:");
	const navigation = page.getByRole("navigation", { name: "Page sections" });
	for (const [name, id] of [
		["Install", "installation"],
		["Playground", "playground"],
		["Example", "quick-start"],
		["API", "api-reference"],
	]) {
		await navigation.getByRole("link", { name, exact: true }).click();
		await expect(page).toHaveURL(new RegExp(`#${id}$`));
		await expect(page.locator(`#${id}`)).toBeInViewport();
	}
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= window.innerWidth,
		),
	).toBe(true);
});

test("uses the library default palette in the playground and API reference", async ({
	page,
}) => {
	const playgroundColors = await page
		.getByRole("textbox", { name: /^Color / })
		.evaluateAll((inputs) =>
			inputs.map((input) => (input as HTMLInputElement).value),
		);
	expect(playgroundColors).toEqual(DEFAULT_COLORS);

	const apiColors = await page
		.locator("#api-reference pre")
		.first()
		.innerText();
	expect(JSON.parse(apiColors)).toEqual(DEFAULT_COLORS);
});

test("keeps CSS color text, picker, opacity and example in sync", async ({
	page,
}) => {
	const input = page.getByRole("textbox", { name: "Color 01", exact: true });
	const picker = page.getByLabel("Pick color 1", { exact: true });
	const row = page.locator(".color-row").first();
	const opacity = row.getByRole("slider", { name: "Opacity" });
	await input.fill("rgba(12,34,56,.25)");
	await expect(picker).toHaveValue("#0c2238");
	await expect(opacity).toHaveValue("25");
	await expect(row.locator("output")).toHaveText("25%");
	await expect(page.locator("#snippet")).toContainText('"rgba(12,34,56,.25)"');

	await picker.fill("#123456");
	await expect(input).toHaveValue("rgba(18,52,86,0.25)");
	await opacity.focus();
	await opacity.press("Home");
	await expect(input).toHaveValue("rgba(18,52,86,0)");
	await expect(row.locator("output")).toHaveText("0%");
	await expect(page.locator("#snippet")).toContainText('"rgba(18,52,86,0)"');
	await opacity.press("End");
	await expect(input).toHaveValue("rgba(18,52,86,1)");
	await expect(row.locator("output")).toHaveText("100%");
});

test("rejects invalid and context-dependent colors without changing the example", async ({
	page,
}) => {
	const input = page.getByRole("textbox", { name: "Color 01", exact: true });
	const snippet = page.locator("#snippet");
	await input.fill("rebeccapurple");
	const validExample = await snippet.textContent();
	for (const value of ["", "not-a-color", "var(--pink)", "currentColor"]) {
		await input.fill(value);
		await expect(input).toHaveAttribute("aria-invalid", "true");
		await expect(input).toHaveAccessibleDescription(/Enter a valid CSS color/);
		await expect(snippet).toHaveText(validExample ?? "");
	}
	await input.fill("#abcdef");
	await expect(input).not.toHaveAttribute("aria-invalid");
	await expect(input).toHaveAccessibleDescription("");
	await expect(snippet).toContainText('"#abcdef"');
});

test("adds and removes colors with focus, retains one color, and resets defaults", async ({
	page,
}) => {
	const snippet = page.locator("#snippet");
	const defaultExample = await snippet.textContent();
	const defaultColors = await page
		.getByRole("textbox", { name: /^Color / })
		.evaluateAll((inputs) =>
			inputs.map((input) => (input as HTMLInputElement).value),
		);
	await page.getByRole("button", { name: "Add color" }).click();
	await expect(page.getByRole("textbox", { name: /^Color / })).toHaveCount(5);
	await expect(page.getByLabel("Color 05", { exact: true })).toBeFocused();
	await expect(snippet).toContainText("colors:");
	await page
		.getByRole("button", { name: "Remove color 2", exact: true })
		.click();
	await expect(page.getByRole("textbox", { name: /^Color / })).toHaveCount(4);
	await expect(page.getByLabel("Color 02", { exact: true })).toBeFocused();
	await expect(page.getByLabel("Color 02", { exact: true })).toHaveValue(
		defaultColors[2],
	);
	for (const count of [4, 3, 2]) {
		await page
			.getByRole("button", { name: `Remove color ${count}`, exact: true })
			.click();
		await expect(page.getByRole("textbox", { name: /^Color / })).toHaveCount(
			count - 1,
		);
		await expect(
			page.getByLabel(`Color 0${count - 1}`, { exact: true }),
		).toBeFocused();
	}
	await expect(
		page.getByRole("button", { name: "Remove color 1" }),
	).toBeDisabled();
	await page.getByRole("button", { name: "Reset", exact: true }).click();
	await expect(page.getByRole("textbox", { name: /^Color / })).toHaveCount(4);
	for (const [index, color] of defaultColors.entries()) {
		await expect(
			page.getByLabel(`Color 0${index + 1}`, { exact: true }),
		).toHaveValue(color);
		await expect(
			page.getByRole("button", {
				name: `Remove color ${index + 1}`,
				exact: true,
			}),
		).toBeEnabled();
	}
	await expect(snippet).toHaveText(defaultExample ?? "");
});
