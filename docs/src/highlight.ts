import type { HighlighterCore } from "shiki/core";

let highlighter: Promise<HighlighterCore> | undefined;

function getHighlighter(): Promise<HighlighterCore> {
	highlighter ??= Promise.all([
		import("shiki/core"),
		import("shiki/engine/javascript"),
		import("shiki/langs/typescript.mjs"),
		import("shiki/themes/github-dark-default.mjs"),
	]).then(
		([
			{ createHighlighterCore },
			{ createJavaScriptRegexEngine },
			language,
			theme,
		]) =>
			createHighlighterCore({
				langs: [language.default],
				themes: [theme.default],
				engine: createJavaScriptRegexEngine(),
			}),
	);
	return highlighter;
}

export async function highlightSnippet(element: HTMLElement, source: string) {
	const instance = await getHighlighter();
	// A newer edit may have arrived while the highlighter was loading.
	if (element.textContent !== source) return;
	const { tokens } = instance.codeToTokens(source, {
		lang: "typescript",
		theme: "github-dark-default",
	});
	const fragment = document.createDocumentFragment();
	for (const [index, line] of tokens.entries()) {
		if (index > 0) fragment.append("\n");
		const row = document.createElement("span");
		row.className = "line";
		for (const token of line) {
			const span = document.createElement("span");
			span.textContent = token.content;
			if (token.color) span.style.color = token.color;
			row.append(span);
		}
		fragment.append(row);
	}
	element.replaceChildren(fragment);
}
