import { expect, type Page, test } from "@playwright/test";
import { messages } from "../src/i18n";

async function observeCanvas(page: Page) {
	// Observe real drawing without replacing the animation engine. The expanding
	// ring stays at the launch position while individual particles move randomly.
	await page.locator("body > canvas").evaluate((canvas) => {
		const context = (canvas as HTMLCanvasElement).getContext("2d");
		if (!context) throw new Error("Missing firework canvas context");
		const arc = context.arc.bind(context);
		const stroke = context.stroke.bind(context);
		const fill = context.fill.bind(context);
		let lastArc: number[] = [];
		context.arc = (...args: Parameters<typeof arc>) => {
			lastArc = [args[0], args[1]];
			arc(...args);
		};
		context.stroke = () => {
			if (!canvas.hasAttribute("data-launch-position")) {
				canvas.setAttribute("data-launch-position", JSON.stringify(lastArc));
			}
			stroke();
		};
		context.fill = () => {
			if (!canvas.hasAttribute("data-particle-color")) {
				canvas.setAttribute("data-particle-color", String(context.fillStyle));
			}
			fill();
		};
	});
}

test.beforeEach(async ({ page }) => {
	await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) =>
		route.abort(),
	);
	await page.goto("/");
	await observeCanvas(page);
});

for (const activation of ["click", "Enter", "Space"]) {
	test(`launches a real firework at the preview position using ${activation}`, async ({
		page,
	}) => {
		const preview = page.getByRole("button", { name: /^Launch a firework/ });
		await preview.scrollIntoViewIfNeeded();
		const header = page.locator("header#top");
		await expect(header).toHaveAttribute("data-stuck", "");
		await header.evaluate(async (element) => {
			await Promise.all(
				element
					.getAnimations()
					.map((animation) => animation.finished.catch(() => undefined)),
			);
		});
		// Focusing can scroll the preview; measure the position used by activation.
		if (activation !== "click") await preview.focus();
		const bounds = await preview.boundingBox();
		if (!bounds) throw new Error("Preview has no bounds");
		const position =
			activation === "click"
				? { x: 60, y: 80 }
				: { x: bounds.width / 2, y: bounds.height / 2 };
		if (activation === "click") {
			await page.mouse.click(bounds.x + position.x, bounds.y + position.y);
		} else {
			await preview.press(activation);
		}
		const canvas = page.locator("body > canvas");
		await expect(canvas).toHaveAttribute("data-launch-position", /\[/);
		const [x, y] = JSON.parse(
			(await canvas.getAttribute("data-launch-position")) ?? "[]",
		) as number[];
		expect(Math.abs(x - (bounds.x + position.x))).toBeLessThan(1);
		expect(Math.abs(y - (bounds.y + position.y))).toBeLessThan(1);
	});
}

test("does not launch fireworks when clicking outside the preview", async ({
	page,
}) => {
	await page.getByRole("button", { name: "Add color" }).click();
	await page.evaluate(
		() =>
			new Promise<void>((resolve) => {
				requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
			}),
	);
	await expect(page.locator("body > canvas")).not.toHaveAttribute(
		"data-launch-position",
	);
});

test("turning effects off disposes the canvas and re-enabling creates one canvas", async ({
	page,
}) => {
	const preview = page.getByRole("button", { name: /^Launch a firework/ });
	const toggle = page.getByRole("button", { name: /Preview effects/ });
	await preview.click();
	await expect(page.locator("body > canvas")).toHaveAttribute(
		"data-launch-position",
		/\[/,
	);
	for (let cycle = 0; cycle < 2; cycle++) {
		await toggle.click();
		await expect(toggle).toHaveAttribute("aria-pressed", "false");
		await expect(preview).toBeDisabled();
		await expect(page.locator("body > canvas")).toHaveCount(0);
		await expect(page.locator("#preview-status")).toHaveText(
			"Preview effects are off. Active fireworks have stopped.",
		);
		await toggle.click();
		await expect(toggle).toHaveAttribute("aria-pressed", "true");
		await expect(preview).toBeEnabled();
		await expect(page.locator("body > canvas")).toHaveCount(1);
		await expect(page.locator("#preview-status")).toHaveText(
			"Preview effects are on.",
		);
		await observeCanvas(page);
		await preview.click();
		await expect(page.locator("body > canvas")).toHaveAttribute(
			"data-launch-position",
			/\[/,
		);
	}
});

test("uses the edited palette for real particles before and after toggling effects", async ({
	page,
}) => {
	for (const count of [4, 3, 2]) {
		await page
			.getByRole("button", { name: `Remove color ${count}`, exact: true })
			.click();
	}
	const color = page.getByLabel("Color 01", { exact: true });
	const preview = page.getByRole("button", { name: /^Launch a firework/ });
	await color.fill("#123456");
	await preview.click();
	await expect(page.locator("body > canvas")).toHaveAttribute(
		"data-particle-color",
		"#123456",
	);
	const toggle = page.getByRole("button", { name: /Preview effects/ });
	await toggle.click();
	await toggle.click();
	await observeCanvas(page);
	await color.fill("#abcdef");
	await preview.click();
	await expect(page.locator("body > canvas")).toHaveAttribute(
		"data-particle-color",
		"#abcdef",
	);
});

test("warns about Reduced Motion on load and when the preference changes", async ({
	page,
}) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.reload();
	await observeCanvas(page);
	const warning = page.getByRole("alert");
	const preview = page.getByRole("button", { name: /^Launch a firework/ });
	await expect(warning).toBeVisible();
	await expect(warning).toContainText(messages.en.playground.warningTitle);
	await expect(preview).toHaveAttribute("aria-describedby", "motion-warning");
	// The playground explicitly allows previewing; the copied example respects motion.
	await expect(preview).toBeEnabled();
	await preview.click();
	await expect(page.locator("body > canvas")).toHaveAttribute(
		"data-launch-position",
		/\[/,
	);
	await expect(page.locator("#snippet")).toContainText(
		"shouldPlayAnimation: () => !reducedMotion.matches",
	);
	await page.emulateMedia({ reducedMotion: "no-preference" });
	await expect(warning).toBeHidden();
	await expect(preview).not.toHaveAttribute("aria-describedby");
	await page.emulateMedia({ reducedMotion: "reduce" });
	await expect(warning).toBeVisible();
	await expect(preview).toHaveAttribute("aria-describedby", "motion-warning");
});
