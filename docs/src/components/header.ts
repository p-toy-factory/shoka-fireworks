function queryRequired<T extends Element>(
	selector: string,
	root: ParentNode,
): T {
	const element = root.querySelector<T>(selector);
	if (!element) throw new Error(`Required element not found: ${selector}`);
	return element;
}

export function setupHeader(header: HTMLElement): () => void {
	const pageNav = queryRequired<HTMLElement>(".page-nav", header);
	const languagePicker = queryRequired<HTMLDetailsElement>(
		".language-picker",
		header,
	);
	const languageTrigger = queryRequired<HTMLElement>(
		".language-trigger",
		languagePicker,
	);

	function updateLanguageLinks() {
		for (const link of header.querySelectorAll<HTMLAnchorElement>(
			"a[data-locale]",
		)) {
			const url = new URL(link.href);
			url.hash = window.location.hash;
			link.href = url.href;
		}
	}

	function handleLanguageKeydown(event: KeyboardEvent) {
		if (event.key === "Escape" && languagePicker.open) {
			event.preventDefault();
			languagePicker.open = false;
			languageTrigger.focus();
		}
	}

	function closeLanguagePicker(event: Event) {
		if (
			event.target instanceof Node &&
			!languagePicker.contains(event.target)
		) {
			languagePicker.open = false;
		}
	}

	const updateHeaderHeight = () => {
		document.documentElement.style.setProperty(
			"--header-height",
			`${header.offsetHeight}px`,
		);
	};
	let headerResizeObserver: ResizeObserver | undefined;
	if (typeof ResizeObserver === "undefined") {
		updateHeaderHeight();
	} else {
		headerResizeObserver = new ResizeObserver(updateHeaderHeight);
		headerResizeObserver.observe(header);
		updateHeaderHeight();
	}

	let headerAnimation: Animation | null = null;
	let navigationAnimation: Animation | null = null;
	const updateHeaderState = () => {
		const stuck = window.scrollY > 0;
		if (header.hasAttribute("data-stuck") === stuck) return;

		const currentHeight = header.getBoundingClientRect().height;
		const currentNavigation = pageNav.getBoundingClientRect();
		headerAnimation?.cancel();
		headerAnimation = null;
		navigationAnimation?.cancel();
		navigationAnimation = null;
		header.toggleAttribute("data-stuck", stuck);
		const targetHeight = header.getBoundingClientRect().height;
		const targetNavigation = pageNav.getBoundingClientRect();
		updateHeaderHeight();
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return;
		}

		if (Math.abs(currentHeight - targetHeight) >= 1) {
			const animation = header.animate(
				[{ height: `${currentHeight}px` }, { height: `${targetHeight}px` }],
				{ duration: 180, easing: "ease-in-out" },
			);
			headerAnimation = animation;
			animation.addEventListener(
				"finish",
				() => {
					if (headerAnimation === animation) {
						headerAnimation = null;
						updateHeaderHeight();
					}
				},
				{ once: true },
			);
		}

		const x = currentNavigation.left - targetNavigation.left;
		const y = currentNavigation.top - targetNavigation.top;
		if (Math.abs(x) >= 1 || Math.abs(y) >= 1) {
			const animation = pageNav.animate(
				[
					{ transform: `translate(${x}px, ${y}px)` },
					{ transform: "translate(0, 0)" },
				],
				{ duration: 180, easing: "ease-in-out" },
			);
			navigationAnimation = animation;
			animation.addEventListener(
				"finish",
				() => {
					if (navigationAnimation === animation) {
						navigationAnimation = null;
					}
				},
				{ once: true },
			);
		}
	};

	updateLanguageLinks();
	window.addEventListener("hashchange", updateLanguageLinks);
	languagePicker.addEventListener("keydown", handleLanguageKeydown);
	document.addEventListener("click", closeLanguagePicker);
	document.addEventListener("focusin", closeLanguagePicker);
	updateHeaderState();
	window.addEventListener("scroll", updateHeaderState, { passive: true });

	return () => {
		window.removeEventListener("hashchange", updateLanguageLinks);
		window.removeEventListener("scroll", updateHeaderState);
		languagePicker.removeEventListener("keydown", handleLanguageKeydown);
		document.removeEventListener("click", closeLanguagePicker);
		document.removeEventListener("focusin", closeLanguagePicker);
		headerResizeObserver?.disconnect();
		headerAnimation?.cancel();
		navigationAnimation?.cancel();
		headerAnimation = null;
		navigationAnimation = null;
	};
}
