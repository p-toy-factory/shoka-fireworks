import type { Messages } from "./en";

export const ja: Messages = {
	meta: {
		title: "Shoka Fireworks · はじめに",
		description:
			"Webサイトに軽やかなクリック花火エフェクトを。配色をカスタマイズしてその場で試し、コードをコピーしてすぐ導入できます。",
	},
	nav: {
		backToTop: "ページの先頭へ",
		sections: "セクション移動",
		install: "インストール",
		playground: "配色",
		example: "導入",
		api: "API",
		github: "GitHub で shoka-fireworks を見る",
		language: "言語",
	},
	intro: { lineOne: "クリックひとつで、", lineTwo: "花火が咲く。" },
	install: {
		step: "01 / インストール",
		title: "パッケージの追加",
		description: "npm でプロジェクトにパッケージを追加します。",
		copy: "コマンドをコピー",
	},
	playground: {
		step: "02 / カスタマイズとプレビュー",
		title: "花火のパレットを作る",
		description:
			"色を自由に増減・調整してその場で試せます。下の導入コードも自動で更新されます。",
		palette: "カラーリスト",
		reset: "初期値に戻す",
		help: "カラーピッカーまたは任意の CSS カラー値を入力してください。次の花火から反映されます。",
		add: "＋ 色を追加",
		preview: "インタラクティブプレビュー",
		invitation: "下のキャンバスをクリックして、現在の配色を試せます。",
		toggle: "プレビュー演出",
		warningTitle: "視差効果・点滅に関するご注意",
		warning:
			"システムの「視差効果を減らす」が有効になっています。動作確認のためプレビュー内では手動で花火を再生できますが、光過敏性てんかんや前庭障害、片頭痛などの症状がある場合は、操作前に上のスイッチで演出をオフにしてください。",
		launch:
			"花火を打ち上げる：プレビューキャンバスをクリックするか、フォーカスして Enter またはスペースキーを押します。",
		keyboard: "フォーカス後、Enter / スペースキーで打ち上げ",
	},
	usage: {
		step: "03 / プロジェクトへ導入",
		title: "サイトに組み込む",
		copy: "コードをコピー",
		description:
			"ブラウザーで {body} が利用可能になったタイミング（コンポーネントのマウントフックなど）で以下のコードを実行します。上で調整した配色が反映されています。",
		motionTitle: "「視差効果を減らす」設定への対応",
		motion:
			"頻繁な装飾アニメーションは、一部の訪問者にめまいや不快感を引き起こすことがあります。上のプレビューとは異なり、このコードはシステムの「視差効果を減らす」設定に自動で従い、再読み込みなしで即座に反映します。",
		guidance: "W3C アクセシビリティ解説を読む",
		check:
			"{shouldPlayAnimation} はクリックごとに {matches} を確認し、「視差効果を減らす」が有効な場合は {false} を返して新しい花火の発火を抑止します。",
		cleanup:
			"すでに開いている花火は最後まで自然に再生されます。すべてのアニメーションを即座に止め、エフェクトを完全に解除する場合（コンポーネントのアンマウント時など）は {cleanup} を呼び出してください。",
	},
	api: {
		step: "04 / API リファレンス",
		description:
			"ブラウザーで {body} の準備ができた後に呼び出します。呼び出しごとに専用のクリーンアップ関数を返します。",
		options: "FireworkConfig の設定項目",
		option: "項目",
		type: "型",
		default: "既定値",
		behavior: "説明",
		defaultPalette: "以下に示すデフォルトのパステルカラー 4 色",
		colors: "花火のパーティクルに使う CSS カラー配列（1 色以上必須）。",
		shouldPlayAnimation:
			"クリックのたびに発火します。{false} を返すとそのクリックでの花火をスキップし、再生中のアニメーションには影響しません。",
		motion:
			"ライブラリ自体は「視差効果を減らす」設定を自動検出しません。上の例のように {shouldPlayAnimation} 内でチェックしてください。",
		defaultColors: "デフォルトパレット",
		cleanupTitle: "クリーンアップと破棄",
		cleanup:
			"コンポーネントのアンマウント時やエフェクトを無効化する際は、fireworks() が返すクリーンアップ関数を呼び出してください。すべてのアニメーションを停止し、キャンバスとクリック・リサイズのイベントリスナーを解除します。",
	},
	credits: {
		title: "クレジット",
		description:
			"本ライブラリの花火エフェクトは {project} を元に改変しました。原作者の霜月琉璃さんに感謝します。",
	},
	runtime: {
		colorLabel: "色 {number}",
		removeColor: "色 {number} を削除",
		remove: "削除",
		pickColor: "色 {number} を選択",
		opacity: "不透明度",
		invalidColor:
			"#ffb6b9 や rgba(255,182,185,.9) など、有効な CSS カラー値を入力してください。",
		copied: "クリップボードにコピーしました。",
		clipboardUnavailable:
			"自動でコピーできませんでした。選択されたコードを Ctrl+C または Command+C でコピーしてください。",
		on: "オン",
		off: "オフ",
		livePreview: "ライブプレビュー",
		effectsOff: "演出オフ",
		previewPrompt: "ここをクリックして花火を打ち上げる",
		previewDisabledPrompt: "プレビュー演出は一時停止中",
		previewHint: "キャンバス内のどこでも、何度でもクリックできます",
		previewDisabledHint: "右上のスイッチをオンにすると再開します",
		previewOnStatus: "プレビュー演出をオンにしました。",
		previewOffStatus:
			"プレビュー演出をオフにし、再生中の花火をクリアしました。",
		cleanupComment:
			"アンマウント時やエフェクトの終了時は cleanup() を呼び出し、アニメーションとイベントリスナーを解除します。",
	},
};
