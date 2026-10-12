import { createTimeline, createTimer, utils } from "animejs";
import { DEFAULT_COLORS } from "./default-colors.js";

const alwaysTrue = () => true;

export interface FireworkConfig {
	colors?: string[];
	shouldPlayAnimation?: (event: MouseEvent) => boolean;
}

interface Coordinates {
	x: number;
	y: number;
}

interface Particule extends Coordinates {
	[key: string]: unknown;
	color: string | CanvasGradient | CanvasPattern;
	endPos: Coordinates;
	radius: number;
	draw: () => void;
}

interface Circle extends Coordinates {
	[key: string]: unknown;
	alpha: number;
	color: string;
	lineWidth: number;
	radius: number;
	draw: () => void;
}

// Refactored from https://github.com/amehime/hexo-theme-shoka/blob/ad3bb6039fe37a294e2ce8d1a83aa2c782e5d2ea/source/js/_app/fireworks.js
export function fireworks({
	colors = DEFAULT_COLORS,
	shouldPlayAnimation = alwaysTrue,
}: FireworkConfig = {}): () => void {
	if (colors.length === 0) {
		throw new RangeError(
			"FireworkConfig.colors must contain at least one color",
		);
	}

	const canvasEl = document.createElement("canvas");
	canvasEl.ariaHidden = "true";
	canvasEl.style.cssText =
		"position:fixed;top:0;left:0;pointer-events:none;z-index:9999999";
	document.body.appendChild(canvasEl);

	const canvasContext = canvasEl.getContext("2d");
	if (!canvasContext) {
		canvasEl.remove();
		throw new Error("Unable to create a 2D canvas context for fireworks");
	}
	const ctx = canvasContext;

	const numberOfParticules = 30;
	const activeTimelines = new Set<ReturnType<typeof createTimeline>>();
	let pointerX = 0;
	let pointerY = 0;

	function setCanvasSize() {
		canvasEl.width = window.innerWidth * 2;
		canvasEl.height = window.innerHeight * 2;
		canvasEl.style.width = `${window.innerWidth}px`;
		canvasEl.style.height = `${window.innerHeight}px`;
		ctx.scale(2, 2);
	}

	function updateCoords(e: MouseEvent) {
		pointerX = e.clientX;
		pointerY = e.clientY;
	}

	function setParticuleDirection(p: Coordinates): Coordinates {
		const angle = (utils.random(0, 360) * Math.PI) / 180;
		const value = utils.random(50, 180);
		const radius = Number(utils.randomPick([-1, 1])) * value;
		return {
			x: p.x + radius * Math.cos(angle),
			y: p.y + radius * Math.sin(angle),
		};
	}

	function createParticule(x: number, y: number): Particule {
		const p: Particule = {
			x,
			y,
			color: utils.randomPick(colors),
			radius: utils.random(16, 32),
			endPos: { x, y },
			draw: () => {
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
				ctx.fillStyle = p.color;
				ctx.fill();
			},
		};
		p.endPos = setParticuleDirection(p);
		return p;
	}

	function createCircle(x: number, y: number): Circle {
		const p: Circle = {
			x,
			y,
			color: "#FFF",
			radius: 0.1,
			alpha: 0.5,
			lineWidth: 6,
			draw: () => {
				ctx.globalAlpha = p.alpha;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
				ctx.lineWidth = p.lineWidth;
				ctx.strokeStyle = p.color;
				ctx.stroke();
				ctx.globalAlpha = 1;
			},
		};
		return p;
	}

	function animateParticules(x: number, y: number) {
		const circle = createCircle(x, y);
		const particules = Array.from({ length: numberOfParticules }, () =>
			createParticule(x, y),
		);
		const timeline = createTimeline({
			autoplay: false,
			onComplete: (completedTimeline) =>
				activeTimelines.delete(completedTimeline),
		})
			.add(particules, {
				x: (p?: unknown) => (p as Particule).endPos.x,
				y: (p?: unknown) => (p as Particule).endPos.y,
				radius: 0.1,
				duration: utils.random(1200, 1800),
				ease: "outExpo",
				onRender: () => {
					for (const particule of particules) {
						particule.draw();
					}
				},
			})
			.add(
				circle,
				{
					radius: utils.random(80, 160),
					lineWidth: 0,
					alpha: {
						to: 0,
						ease: "linear",
						duration: utils.random(600, 800),
					},
					duration: utils.random(1200, 1800),
					ease: "outExpo",
					onRender: () => circle.draw(),
				},
				0,
			);
		activeTimelines.add(timeline);
		timeline.play();
	}

	const clearTimer = createTimer({
		duration: Number.POSITIVE_INFINITY,
		autoplay: false,
		onUpdate: () => {
			ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
		},
	});

	function listener(e: MouseEvent) {
		if (!shouldPlayAnimation(e)) {
			return;
		}
		if (clearTimer.paused) {
			clearTimer.play();
		}
		updateCoords(e);
		animateParticules(pointerX, pointerY);
	}

	document.addEventListener("click", listener, false);

	setCanvasSize();
	window.addEventListener("resize", setCanvasSize, false);
	return function cleanup() {
		clearTimer.cancel();
		for (const timeline of activeTimelines) {
			timeline.cancel();
		}
		activeTimelines.clear();
		window.removeEventListener("resize", setCanvasSize, false);
		document.removeEventListener("click", listener, false);
		canvasEl.remove();
	};
}
