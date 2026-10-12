import { DEFAULT_COLORS } from "../../src/default-colors";
import { fireworks } from "../../src/index";
import { createUsageExample } from "./documentation";
import { highlightSnippet } from "./highlight";
import type { Messages } from "./i18n";

const colors = [...DEFAULT_COLORS];
function queryRequired<T extends Element>(
	selector: string,
	root: ParentNode = document,
): T {
	const element = root.querySelector<T>(selector);
	if (!element) throw new Error(`Required element not found: ${selector}`);
	return element;
}

function getRequiredElement(id: string): HTMLElement {
	const element = document.getElementById(id);
	if (!element) throw new Error(`Required element not found: #${id}`);
	return element;
}

const app = queryRequired<HTMLDivElement>("#app");
const runtimeData = app.dataset.runtime;
if (!runtimeData) throw new Error("Missing playground translations");
const t: Messages["runtime"] = JSON.parse(runtimeData);
function numbered(message: string, number: number, padded = false): string {
	return message.replace(
		"{number}",
		padded ? String(number).padStart(2, "0") : String(number),
	);
}

const rows = queryRequired<HTMLDivElement>("#color-rows");
const preview = queryRequired<HTMLButtonElement>("#preview");
const snippet = queryRequired<HTMLElement>("#snippet code");
const parser = document.createElement("canvas");
parser.width = parser.height = 1;
function getColorContext(): CanvasRenderingContext2D {
	const context = parser.getContext("2d", { willReadFrequently: true });
	if (!context) {
		throw new Error("Unable to create a 2D canvas context for color parsing");
	}
	return context;
}

const ctx = getColorContext();
let nextId = 0;

function normalizeColor(value: string): string | null {
	const text = value.trim();
	if (
		!text ||
		/\b(var|env|currentcolor|inherit|initial|unset|revert)\b/i.test(text) ||
		!CSS.supports("color", text)
	)
		return null;
	ctx.fillStyle = "#010203";
	ctx.fillStyle = text;
	const first = ctx.fillStyle;
	ctx.fillStyle = "#040506";
	ctx.fillStyle = text;
	return ctx.fillStyle === first ? first : null;
}

function parseColor(value: string): { hex: string; alpha: number } | null {
	const normalized = normalizeColor(value);
	if (normalized === null) return null;
	if (/^#[\da-f]{6}$/i.test(normalized)) return { hex: normalized, alpha: 1 };
	const rgba = normalized.match(
		/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/,
	);
	if (rgba) {
		// Reading translucent pixels back can round the original RGB channels.
		return {
			hex: `#${rgba
				.slice(1, 4)
				.map((channel) => Number(channel).toString(16).padStart(2, "0"))
				.join("")}`,
			alpha: rgba[4] === undefined ? 1 : Number(rgba[4]),
		};
	}
	ctx.fillStyle = normalized;
	ctx.clearRect(0, 0, 1, 1);
	ctx.fillRect(0, 0, 1, 1);
	const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
	return {
		hex: `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`,
		alpha: Math.round((a / 255) * 100) / 100,
	};
}

const normalizedDefaults = DEFAULT_COLORS.map(normalizeColor);

function updateSnippet() {
	const isDefaultPalette =
		colors.length === DEFAULT_COLORS.length &&
		colors.every(
			(color, index) => normalizeColor(color) === normalizedDefaults[index],
		);
	const source = createUsageExample(
		isDefaultPalette ? undefined : colors,
		t.cleanupComment,
	);
	if (snippet.textContent !== source) {
		snippet.textContent = source;
		// Keep the example editable and copyable if highlighting cannot load.
		void highlightSnippet(snippet, source).catch(() => {});
	}
	queryRequired<HTMLElement>("#copy-status").textContent = "";
}

function renderRows(focusIndex?: number) {
	rows.replaceChildren();
	colors.forEach((color, index) => {
		const id = `color-${nextId++}`;
		const row = document.createElement("div");
		row.className = "color-row";
		row.innerHTML = `<div class="color-top"><label class="color-label" for="${id}-text">${numbered(t.colorLabel, index + 1, true)}</label><button class="remove quiet" type="button" aria-label="${numbered(t.removeColor, index + 1)}">${t.remove}</button></div><div class="color-inputs"><input class="picker" type="color" aria-label="${numbered(t.pickColor, index + 1)}"><input class="color-text" id="${id}-text" type="text" spellcheck="false" autocomplete="off" aria-describedby="${id}-error"></div><div class="opacity"><label for="${id}-alpha">${t.opacity}</label><input id="${id}-alpha" type="range" min="0" max="100" step="1"><output for="${id}-alpha"></output></div><p class="error" id="${id}-error" aria-live="polite"></p>`;
		const picker = queryRequired<HTMLInputElement>(".picker", row);
		const input = queryRequired<HTMLInputElement>(".color-text", row);
		const alpha = queryRequired<HTMLInputElement>("[type=range]", row);
		const output = queryRequired<HTMLOutputElement>("output", row);
		const error = queryRequired<HTMLParagraphElement>(".error", row);
		const remove = queryRequired<HTMLButtonElement>(".remove", row);
		function syncControls(parsed: { hex: string; alpha: number }) {
			picker.value = parsed.hex;
			alpha.value = String(Math.round(parsed.alpha * 100));
			output.value = `${alpha.value}%`;
		}
		function apply(value: string) {
			colors.splice(index, 1, value);
			input.removeAttribute("aria-invalid");
			error.textContent = "";
			updateSnippet();
		}
		input.value = color;
		const parsedColor = parseColor(color);
		if (!parsedColor) throw new Error(`Invalid configured color: ${color}`);
		syncControls(parsedColor);
		input.addEventListener("input", () => {
			const parsed = parseColor(input.value);
			if (!parsed) {
				input.setAttribute("aria-invalid", "true");
				error.textContent = t.invalidColor;
				return;
			}
			apply(input.value.trim());
			syncControls(parsed);
		});
		function applyControls() {
			const hex = picker.value;
			const rgb = [1, 3, 5].map((start) =>
				Number.parseInt(hex.slice(start, start + 2), 16),
			);
			input.value = `rgba(${rgb.join(",")},${Number(alpha.value) / 100})`;
			output.value = `${alpha.value}%`;
			apply(input.value);
		}
		picker.addEventListener("input", applyControls);
		alpha.addEventListener("input", applyControls);
		remove.disabled = colors.length === 1;
		remove.addEventListener("click", () => {
			colors.splice(index, 1);
			renderRows(Math.min(index, colors.length - 1));
			updateSnippet();
		});
		rows.appendChild(row);
	});
	if (focusIndex !== undefined)
		rows.children[focusIndex]
			?.querySelector<HTMLInputElement>(".color-text")
			?.focus();
}

queryRequired<HTMLButtonElement>("#add").addEventListener("click", () => {
	colors.splice(
		colors.length,
		0,
		DEFAULT_COLORS[colors.length % DEFAULT_COLORS.length],
	);
	renderRows(colors.length - 1);
	updateSnippet();
});
queryRequired<HTMLButtonElement>("#reset").addEventListener("click", () => {
	colors.splice(0, colors.length, ...DEFAULT_COLORS);
	renderRows();
	updateSnippet();
});
document
	.querySelectorAll<HTMLButtonElement>("[data-copy]")
	.forEach((button) => {
		button.addEventListener("click", async () => {
			const codeId = button.dataset.copy;
			const statusId = button.dataset.status;
			if (!codeId || !statusId)
				throw new Error("Copy button is missing its target metadata");
			const code = getRequiredElement(codeId);
			const status = getRequiredElement(statusId);
			try {
				await navigator.clipboard.writeText(code.textContent ?? "");
				status.textContent = t.copied;
			} catch {
				const selection = window.getSelection();
				const range = document.createRange();
				range.selectNodeContents(code);
				selection?.removeAllRanges();
				selection?.addRange(range);
				status.textContent = t.clipboardUnavailable;
			}
		});
	});
// Native button activation creates a click at (0, 0). Place keyboard sparks
// at the center while retaining the library's single document listener.
preview.addEventListener("click", (event) => {
	if (event.detail !== 0) return;
	event.stopPropagation();
	const bounds = preview.getBoundingClientRect();
	preview.dispatchEvent(
		new MouseEvent("click", {
			bubbles: true,
			detail: 1,
			clientX: bounds.x + bounds.width / 2,
			clientY: bounds.y + bounds.height / 2,
		}),
	);
});
renderRows();
updateSnippet();
const toggleEffects = queryRequired<HTMLButtonElement>("#toggle-effects");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let effectsEnabled = false;
let cleanup: (() => void) | undefined;

function setEffectsEnabled(enabled: boolean) {
	cleanup?.();
	cleanup = undefined;
	effectsEnabled = enabled;
	if (enabled) {
		cleanup = fireworks({
			colors,
			shouldPlayAnimation: (event) =>
				event.target instanceof Node && preview.contains(event.target),
		});
	}
	toggleEffects.setAttribute("aria-pressed", String(enabled));
	queryRequired<HTMLElement>("#effects-state").textContent = enabled
		? t.on
		: t.off;
	queryRequired<HTMLElement>("#live-label").textContent = enabled
		? t.livePreview
		: t.effectsOff;
	queryRequired<HTMLElement>(".live").classList.toggle("is-off", !enabled);
	queryRequired<HTMLElement>("#preview-prompt").textContent = enabled
		? t.previewPrompt
		: t.previewDisabledPrompt;
	queryRequired<HTMLElement>(".preview-hint").textContent = enabled
		? t.previewHint
		: t.previewDisabledHint;
	preview.disabled = !enabled;
}

function updateMotionWarning() {
	queryRequired<HTMLElement>("#motion-warning").hidden = !reducedMotion.matches;
	if (reducedMotion.matches)
		preview.setAttribute("aria-describedby", "motion-warning");
	else preview.removeAttribute("aria-describedby");
}

toggleEffects.addEventListener("click", () => {
	setEffectsEnabled(!effectsEnabled);
	queryRequired<HTMLElement>("#preview-status").textContent = effectsEnabled
		? t.previewOnStatus
		: t.previewOffStatus;
});
reducedMotion.addEventListener("change", updateMotionWarning);
updateMotionWarning();
setEffectsEnabled(true);
if (import.meta.hot)
	import.meta.hot.dispose(() => {
		cleanup?.();
		reducedMotion.removeEventListener("change", updateMotionWarning);
	});
