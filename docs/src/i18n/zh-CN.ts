import type { Messages } from "./en";

export const zhCN: Messages = {
	meta: {
		title: "Shoka Fireworks · 快速上手",
		description:
			"轻巧的网页点击烟花特效。在线调配专属色彩、实时试放，一键复制代码接入项目。",
	},
	nav: {
		backToTop: "返回顶部",
		sections: "章节导航",
		install: "安装",
		playground: "调色",
		example: "接入",
		api: "API",
		github: "在 GitHub 上查看 shoka-fireworks",
		language: "语言",
	},
	intro: { lineOne: "点击之处，", lineTwo: "花火绽放。" },
	install: {
		step: "01 / 安装",
		title: "安装依赖",
		description: "通过 npm 将包添加至你的项目。",
		copy: "复制命令",
	},
	playground: {
		step: "02 / 定制与预览",
		title: "调配你的烟花色板",
		description: "自由增减颜色并实时试放，下方接入代码会自动同步。",
		palette: "色彩列表",
		reset: "恢复默认",
		help: "点选色块或输入任意 CSS 颜色值，修改后将在下一朵烟花生效。",
		add: "＋ 添加颜色",
		preview: "交互预览",
		invitation: "在下方画布中点击，试试当前配色。",
		toggle: "预览特效",
		warningTitle: "动效与闪烁提示",
		warning:
			"检测到系统已开启「减弱动态效果」。为方便调试，预览区仍支持手动触发烟花；若你对闪光或快速移动画面敏感（如光敏性癫痫、前庭障碍或偏头痛），请先关闭上方特效开关。",
		launch: "燃放烟花：点击预览画布，或聚焦后按回车键、空格键。",
		keyboard: "聚焦后按 Enter 或空格键燃放",
	},
	usage: {
		step: "03 / 接入项目",
		title: "添加到你的网站",
		copy: "复制代码",
		description:
			"在浏览器端 {body} 就绪后（例如在组件的挂载钩子中）运行以下代码。上方调好的配色已自动填入。",
		motionTitle: "响应系统的「减弱动态效果」",
		motion:
			"频繁的装饰性动画可能让部分人感到眩晕或不适。不同于上方的预览区，这段代码会自动遵循系统的「减弱动态效果」设置，且无需刷新页面即可实时生效。",
		guidance: "参阅 W3C 无障碍指南",
		check:
			"{shouldPlayAnimation} 会在每次点击时检查 {matches}；若开启了「减弱动态效果」，则返回 {false}，不再触发新烟花。",
		cleanup:
			"已经绽放的烟花仍会自然播完。如需立即停止所有动画并移除特效（例如在组件卸载时），请调用 {cleanup}。",
	},
	api: {
		step: "04 / API 参考",
		description:
			"在浏览器端 {body} 就绪后调用。每次调用都会返回对应的清理函数。",
		options: "FireworkConfig 配置项",
		option: "配置项",
		type: "类型",
		default: "默认值",
		behavior: "说明",
		defaultPalette: "下方 4 种默认柔和色",
		colors: "烟花粒子的 CSS 颜色数组，至少包含 1 种颜色。",
		shouldPlayAnimation:
			"每次点击时触发。返回 {false} 则当次点击不放烟花，正在播放的动画不受影响。",
		motion:
			"库本身不会自动检测「减弱动态效果」设置，建议如上方示例所示，在 {shouldPlayAnimation} 中进行检查。",
		defaultColors: "默认色板",
		cleanupTitle: "清理与卸载",
		cleanup:
			"组件卸载或关闭特效时，调用 fireworks() 返回的清理函数，即可停止所有动画、移除画布，并解绑点击与窗口缩放事件。",
	},
	credits: {
		title: "致谢",
		description: "本库的烟花特效改写自 {project}，谨向原作者霜月琉璃致谢。",
	},
	runtime: {
		colorLabel: "颜色 {number}",
		removeColor: "移除颜色 {number}",
		remove: "移除",
		pickColor: "选择颜色 {number}",
		opacity: "不透明度",
		invalidColor:
			"请输入有效的 CSS 颜色值，如 #ffb6b9 或 rgba(255,182,185,.9)。",
		copied: "已复制到剪贴板。",
		clipboardUnavailable:
			"无法自动写入剪贴板，已为你选中代码，请按 Ctrl+C 或 Command+C 复制。",
		on: "开启",
		off: "关闭",
		livePreview: "实时预览",
		effectsOff: "特效已关闭",
		previewPrompt: "点按此处，燃放烟花",
		previewDisabledPrompt: "预览特效已暂停",
		previewHint: "画布内任意位置均可连点试放",
		previewDisabledHint: "开启右上角开关即可恢复预览",
		previewOnStatus: "预览特效已开启。",
		previewOffStatus: "预览特效已关闭，正在播放的烟花已清空。",
		cleanupComment:
			"组件卸载或关闭特效时，调用 cleanup() 停止动画并移除事件监听。",
	},
};
