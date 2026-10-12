import type { Messages } from "./en";

export const ko: Messages = {
	meta: {
		title: "Shoka Fireworks · 시작하기",
		description:
			"가벼운 웹 클릭 불꽃놀이 효과. 나만의 색상 팔레트를 조합해 바로 시험해 보고, 코드를 복사해 프로젝트에 적용해 보세요.",
	},
	nav: {
		backToTop: "맨 위로",
		sections: "섹션 탐색",
		install: "설치",
		playground: "색상 조합",
		example: "적용",
		api: "API",
		github: "GitHub에서 shoka-fireworks 보기",
		language: "언어",
	},
	intro: { lineOne: "클릭하는 곳마다,", lineTwo: "피어나는 불꽃." },
	install: {
		step: "01 / 설치",
		title: "패키지 설치",
		description: "npm으로 프로젝트에 패키지를 추가합니다.",
		copy: "명령어 복사",
	},
	playground: {
		step: "02 / 커스텀 및 미리보기",
		title: "나만의 불꽃 팔레트 만들기",
		description:
			"자유롭게 색상을 추가·조정하고 바로 터뜨려 보세요. 아래 적용 코드도 자동으로 함께 바뀝니다.",
		palette: "색상 목록",
		reset: "기본값 복원",
		help: "색상칩을 고르거나 유효한 CSS 색상 값을 입력하세요. 다음 불꽃부터 바로 적용됩니다.",
		add: "＋ 색상 추가",
		preview: "인터랙티브 미리보기",
		invitation: "아래 캔버스를 클릭해 현재 색상 조합을 시험해 보세요.",
		toggle: "미리보기 효과",
		warningTitle: "움직임 및 깜박임 안내",
		warning:
			"시스템의 ‘동작 줄이기’ 설정이 켜져 있습니다. 테스트를 위해 미리보기 영역에서는 수동으로 불꽃을 터뜨릴 수 있으나, 광과민성 뇌전증·전정기관 장애가 있거나 깜박임으로 편두통이 유발된다면 먼저 위 스위치로 효과를 꺼 주세요.",
		launch:
			"불꽃 터뜨리기: 미리보기 캔버스를 클릭하거나, 포커스한 뒤 Enter 또는 스페이스 키를 누르세요.",
		keyboard: "포커스 후 Enter 또는 스페이스 키로 실행",
	},
	usage: {
		step: "03 / 프로젝트 적용",
		title: "웹사이트에 추가하기",
		copy: "코드 복사",
		description:
			"브라우저에서 {body}가 준비된 뒤(예: 컴포넌트의 마운트 훅) 아래 코드를 실행하세요. 위에서 고른 색상이 자동으로 반영되어 있습니다.",
		motionTitle: "‘동작 줄이기’ 설정에 대응하기",
		motion:
			"반복되는 장식용 애니메이션은 일부 방문자에게 어지럼증이나 불편함을 줄 수 있습니다. 위 미리보기와 달리 이 코드는 시스템의 ‘동작 줄이기’ 설정을 자동으로 따르며, 새로고침 없이 즉시 반영됩니다.",
		guidance: "W3C 접근성 지침 보기",
		check:
			"{shouldPlayAnimation}은 매 클릭마다 {matches}를 확인하며, ‘동작 줄이기’가 켜져 있으면 {false}를 반환해 새 불꽃이 터지지 않도록 합니다.",
		cleanup:
			"이미 피어난 불꽃은 자연스럽게 끝까지 재생됩니다. 모든 애니메이션을 즉시 멈추고 효과를 제거하려면(예: 컴포넌트 언마운트 시) {cleanup}을 호출하세요.",
	},
	api: {
		step: "04 / API 레퍼런스",
		description:
			"브라우저에서 {body}가 준비된 뒤 호출합니다. 호출할 때마다 해당 효과를 정리하는 함수를 반환합니다.",
		options: "FireworkConfig 설정 항목",
		option: "항목",
		type: "타입",
		default: "기본값",
		behavior: "설명",
		defaultPalette: "아래의 기본 파스텔 색상 4종",
		colors:
			"불꽃 입자에 사용할 CSS 색상 배열입니다. 최소 1개 이상의 색상이 필요합니다.",
		shouldPlayAnimation:
			"매 클릭 시 호출됩니다. {false}를 반환하면 해당 클릭의 불꽃만 건너뛰며, 재생 중인 애니메이션에는 영향을 주지 않습니다.",
		motion:
			"라이브러리는 ‘동작 줄이기’ 설정을 자동으로 감지하지 않습니다. 위 예제처럼 {shouldPlayAnimation} 안에서 확인하는 것을 권장합니다.",
		defaultColors: "기본 팔레트",
		cleanupTitle: "정리 및 해제",
		cleanup:
			"컴포넌트가 언마운트되거나 효과를 끌 때 fireworks()가 반환한 정리 함수를 호출하면, 모든 애니메이션을 멈추고 캔버스와 클릭·리사이즈 이벤트 리스너를 해제합니다.",
	},
	credits: {
		title: "크레딧",
		description:
			"이 라이브러리의 불꽃 효과는 {project}를 바탕으로 수정했습니다. 원작자 霜月琉璃 님께 감사드립니다.",
	},
	runtime: {
		colorLabel: "색상 {number}",
		removeColor: "색상 {number} 삭제",
		remove: "삭제",
		pickColor: "색상 {number} 선택",
		opacity: "불투명도",
		invalidColor:
			"#ffb6b9 또는 rgba(255,182,185,.9) 같은 유효한 CSS 색상 값을 입력하세요.",
		copied: "클립보드에 복사했습니다.",
		clipboardUnavailable:
			"자동으로 복사하지 못했습니다. 선택된 코드를 Ctrl+C 또는 Command+C로 복사하세요.",
		on: "켜짐",
		off: "꺼짐",
		livePreview: "실시간 미리보기",
		effectsOff: "효과 꺼짐",
		previewPrompt: "여기를 눌러 불꽃 터뜨리기",
		previewDisabledPrompt: "미리보기 효과 일시 중지됨",
		previewHint: "캔버스 안 어디서든 여러 번 클릭해 보세요",
		previewDisabledHint: "오른쪽 위 스위치를 켜면 미리보기가 다시 시작됩니다",
		previewOnStatus: "미리보기 효과를 켰습니다.",
		previewOffStatus: "미리보기 효과를 끄고 재생 중인 불꽃을 정리했습니다.",
		cleanupComment:
			"컴포넌트 언마운트 또는 효과 해제 시 cleanup()을 호출해 애니메이션과 이벤트 리스너를 정리합니다.",
	},
};
