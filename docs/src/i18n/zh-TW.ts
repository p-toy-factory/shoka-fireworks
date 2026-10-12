import type { Messages } from "./en";

export const zhTW: Messages = {
	meta: {
		title: "Shoka Fireworks · 快速上手",
		description:
			"輕巧的網頁點擊煙火特效。線上調配專屬色彩、即時試放，一鍵複製程式碼接入專案。",
	},
	nav: {
		backToTop: "返回頂部",
		sections: "章節導覽",
		install: "安裝",
		playground: "調色",
		example: "接入",
		api: "API",
		github: "在 GitHub 上查看 shoka-fireworks",
		language: "語言",
	},
	intro: { lineOne: "點擊之處，", lineTwo: "花火綻放。" },
	install: {
		step: "01 / 安裝",
		title: "安裝套件",
		description: "透過 npm 將套件加入你的專案。",
		copy: "複製指令",
	},
	playground: {
		step: "02 / 客製與預覽",
		title: "調配你的煙火色盤",
		description: "自由增減顏色並即時試放，下方接入程式碼會自動同步。",
		palette: "色彩列表",
		reset: "恢復預設",
		help: "點選色塊或輸入任意 CSS 顏色值，修改後將在下一朵煙火生效。",
		add: "＋ 新增顏色",
		preview: "互動預覽",
		invitation: "在下方畫布中點擊，試試目前配色。",
		toggle: "預覽特效",
		warningTitle: "動效與閃爍提示",
		warning:
			"偵測到系統已開啟「減少動態效果」。為方便測試，預覽區仍支援手動觸發煙火；若你對閃光或快速移動畫面敏感（如光敏性癲癇、前庭障礙或偏頭痛），請先關閉上方特效開關。",
		launch: "施放煙火：點擊預覽畫布，或聚焦後按 Enter 鍵、空白鍵。",
		keyboard: "聚焦後按 Enter 或空白鍵施放",
	},
	usage: {
		step: "03 / 接入專案",
		title: "加入你的網站",
		copy: "複製程式碼",
		description:
			"在瀏覽器端 {body} 就緒後（例如在元件的掛載鉤子中）執行以下程式碼。上方調好的配色已自動填入。",
		motionTitle: "響應系統的「減少動態效果」",
		motion:
			"頻繁的裝飾性動畫可能讓部分人感到眩暈或不適。不同於上方的預覽區，這段程式碼會自動遵循系統的「減少動態效果」設定，且無需重新整理頁面即可即時生效。",
		guidance: "參閱 W3C 無障礙指南",
		check:
			"{shouldPlayAnimation} 會在每次點擊時檢查 {matches}；若開啟了「減少動態效果」，則回傳 {false}，不再觸發新煙火。",
		cleanup:
			"已經綻放的煙火仍會自然播完。如需立即停止所有動畫並移除特效（例如在元件卸載時），請呼叫 {cleanup}。",
	},
	api: {
		step: "04 / API 參考",
		description:
			"在瀏覽器端 {body} 就緒後呼叫。每次呼叫都會回傳對應的清理函式。",
		options: "FireworkConfig 設定項",
		option: "設定項",
		type: "型別",
		default: "預設值",
		behavior: "說明",
		defaultPalette: "下方 4 種預設柔和色",
		colors: "煙火粒子的 CSS 顏色陣列，至少包含 1 種顏色。",
		shouldPlayAnimation:
			"每次點擊時觸發。回傳 {false} 則當次點擊不放煙火，正在播放的動畫不受影響。",
		motion:
			"套件本身不會自動偵測「減少動態效果」設定，建議如上方範例所示，在 {shouldPlayAnimation} 中進行檢查。",
		defaultColors: "預設色盤",
		cleanupTitle: "清理與卸載",
		cleanup:
			"元件卸載或關閉特效時，呼叫 fireworks() 回傳的清理函式，即可停止所有動畫、移除畫布，並解除點擊與視窗縮放事件監聽。",
	},
	credits: {
		title: "致謝",
		description: "本函式庫的煙火特效改寫自 {project}，謹向原作者霜月琉璃致謝。",
	},
	runtime: {
		colorLabel: "顏色 {number}",
		removeColor: "移除顏色 {number}",
		remove: "移除",
		pickColor: "選擇顏色 {number}",
		opacity: "不透明度",
		invalidColor:
			"請輸入有效的 CSS 顏色值，如 #ffb6b9 或 rgba(255,182,185,.9)。",
		copied: "已複製到剪貼簿。",
		clipboardUnavailable:
			"無法自動寫入剪貼簿，已為你選取程式碼，請按 Ctrl+C 或 Command+C 複製。",
		on: "開啟",
		off: "關閉",
		livePreview: "即時預覽",
		effectsOff: "特效已關閉",
		previewPrompt: "點按此處，施放煙火",
		previewDisabledPrompt: "預覽特效已暫停",
		previewHint: "畫布內任意位置均可連點試放",
		previewDisabledHint: "開啟右上角開關即可恢復預覽",
		previewOnStatus: "預覽特效已開啟。",
		previewOffStatus: "預覽特效已關閉，正在播放的煙火已清空。",
		cleanupComment:
			"元件卸載或關閉特效時，呼叫 cleanup() 停止動畫並移除事件監聽。",
	},
};
