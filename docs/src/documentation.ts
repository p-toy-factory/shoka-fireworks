export function createUsageExample(
	colors?: readonly string[],
	cleanupComment = "When unmounting or disabling the effect, call cleanup() to stop animations and remove listeners.",
): string {
	const palette = colors
		? `  colors: ${JSON.stringify(colors, null, 2).replace(/\n/g, "\n  ")},\n`
		: "";
	return `import { fireworks } from "shoka-fireworks";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const cleanup = fireworks({
${palette}  shouldPlayAnimation: () => !reducedMotion.matches,
});

// ${cleanupComment}`;
}
