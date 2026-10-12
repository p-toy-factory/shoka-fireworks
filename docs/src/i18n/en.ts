export const en = {
	meta: {
		title: "Shoka Fireworks · Get started",
		description:
			"Lightweight click fireworks for the web. Customize your palette, test it live, and copy the code into your project.",
	},
	nav: {
		backToTop: "Back to top",
		sections: "Page sections",
		install: "Install",
		playground: "Playground",
		example: "Example",
		api: "API",
		github: "View shoka-fireworks on GitHub",
		language: "Language",
	},
	intro: { lineOne: "Make a little", lineTwo: "firework magic." },
	install: {
		step: "01 / INSTALL",
		title: "Install the package",
		description: "Add the package to your project via npm.",
		copy: "Copy command",
	},
	playground: {
		step: "02 / CUSTOMIZE & PREVIEW",
		title: "Tune your firework palette",
		description:
			"Add or tweak colors and test them live. The integration snippet below updates automatically.",
		palette: "Color palette",
		reset: "Reset",
		help: "Pick a swatch or enter any CSS color value. Changes apply to the next firework.",
		add: "＋ Add color",
		preview: "Interactive preview",
		invitation: "Click inside the canvas below to test your palette.",
		toggle: "Preview effects",
		warningTitle: "Motion and flashing notice",
		warning:
			"Reduced Motion is enabled on your system. For testing, the preview still lets you trigger fireworks manually. If motion or flashing triggers photosensitive epilepsy, vestibular symptoms, or migraines, turn off preview effects above first.",
		launch:
			"Launch a firework: click the preview canvas, or focus it and press Enter or Space.",
		keyboard: "Focus, then press Enter or Space",
	},
	usage: {
		step: "03 / INTEGRATE",
		title: "Add to your site",
		copy: "Copy example",
		description:
			"Run this code in the browser once {body} is ready (for example, inside your component’s mount hook). Your custom palette is already filled in.",
		motionTitle: "Adapt to Reduced Motion",
		motion:
			"Frequent decorative animations can cause dizziness or discomfort for some visitors. Unlike the preview above, this code automatically honors the system Reduced Motion setting and reacts to changes without reloading.",
		guidance: "Read the W3C accessibility guidance",
		check:
			"{shouldPlayAnimation} checks {matches} on every click; when Reduced Motion is enabled, it returns {false} so no new fireworks are triggered.",
		cleanup:
			"Fireworks already in flight finish playing naturally. To stop all animations immediately and remove the effect (such as on component unmount), call {cleanup}.",
	},
	api: {
		step: "04 / API REFERENCE",
		description:
			"Call in the browser once {body} is ready. Each call returns its own cleanup function.",
		options: "FireworkConfig options",
		option: "Option",
		type: "Type",
		default: "Default",
		behavior: "Behavior",
		defaultPalette: "The 4 default pastel colors below",
		colors:
			"CSS color strings for firework particles. Must include at least 1 color.",
		shouldPlayAnimation:
			"Triggered on every click. Return {false} to skip the firework for that click without interrupting active animations.",
		motion:
			"The library does not check Reduced Motion automatically. Check it inside {shouldPlayAnimation} as shown in the example above.",
		defaultColors: "Default palette",
		cleanupTitle: "Cleanup & teardown",
		cleanup:
			"When unmounting a component or disabling the effect, call the cleanup function returned by fireworks() to stop all animations, remove the canvas, and detach click and resize listeners.",
	},
	credits: {
		title: "Credits",
		description:
			"This library’s fireworks effect is adapted from {project}. Thank you to the original author, 霜月琉璃.",
	},
	runtime: {
		colorLabel: "Color {number}",
		removeColor: "Remove color {number}",
		remove: "Remove",
		pickColor: "Pick color {number}",
		opacity: "Opacity",
		invalidColor:
			"Enter a valid CSS color, such as #ffb6b9 or rgba(255,182,185,.9).",
		copied: "Copied to clipboard.",
		clipboardUnavailable:
			"Could not copy automatically. The code is selected—press Ctrl+C or Command+C to copy.",
		on: "On",
		off: "Off",
		livePreview: "Live preview",
		effectsOff: "Effects off",
		previewPrompt: "Click here to launch fireworks",
		previewDisabledPrompt: "Preview effects paused",
		previewHint: "Click anywhere on the canvas, as often as you like",
		previewDisabledHint: "Turn on the switch above to resume previewing",
		previewOnStatus: "Preview effects are on.",
		previewOffStatus: "Preview effects are off. Active fireworks have stopped.",
		cleanupComment:
			"When unmounting or disabling the effect, call cleanup() to stop animations and remove listeners.",
	},
};

export type Messages = typeof en;
