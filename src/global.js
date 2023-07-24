import { $, $All } from "./core/utils/util.js";
import { getState, register, setState } from "./core/observer/observer.js";
import {
  gridPageIdx,
  isGrid,
  isSubTab,
  listPageIdx,
  subscribeList,
} from "./core/store/store.js";

// 로고 새로고침
function refreshWindow() {
  location.reload();
}

// 메인 요소 가져오기
function getMainElements() {
  return {
    listContainer: $(".list_container"),
    gridContainer: $All(".grid_container")[getState(gridPageIdx)],
    listButton: $(".list_button"),
    gridButton: $(".grid_button"),
    leftNavigationButton: $(".left_navigation_button"),
    rightNavigationButton: $(".right_navigation_button"),
  };
}

// 그리드, 리스트 여부에 따른 요소 css 변환
function changeView(elements, currentMode) {
  elements.listButton.src = currentMode
    ? "./assets/icons/list_off.png"
    : "./assets/icons/list_on.png";
  elements.gridButton.src = currentMode
    ? "./assets/icons/grid_on.png"
    : "./assets/icons/grid_off.png";

  elements.listContainer.style.display = currentMode ? "none" : "block";
  elements.gridContainer.style.display = currentMode ? "grid" : "none";
  elements.leftNavigationButton.style.display = currentMode ? "none" : "block";
  elements.rightNavigationButton.style.display = currentMode ? "none" : "block";
}

// 오늘 날짜 update
function updateDate() {
  let today = new Date();
  const dateHtml = $(".container__header_date");
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
  };

  today = today.toLocaleDateString("ko-KR", options);
  dateHtml.innerHTML = today;
}

// 키보드 방향키로 탭 이동
function keyboardClicked({ key: key }) {
  const currentGridMode = getState(isGrid);
  const nowGridPage = getState(gridPageIdx);
  const nowListPage = getState(listPageIdx);
  if (currentGridMode) {
    if (key === "ArrowRight" && nowGridPage < 3) {
      setState(gridPageIdx, nowGridPage + 1);
    } else if (key === "ArrowLeft" && nowGridPage > 0) {
      setState(gridPageIdx, nowGridPage - 1);
    }
  } else {
    if (key === "ArrowRight") {
      setState(listPageIdx, nowListPage + 1);
    } else if (key === "ArrowLeft") {
      setState(listPageIdx, nowListPage - 1);
    }
  }
}

function toggleGridClicked() {
  setState(isGrid, !getState(isGrid));
}

function toggleSubClicked() {
  const subListCount = getState(subscribeList).length;
  subListCount === 0
    ? alert("구독한 언론사가 없습니다!")
    : setState(isSubTab, !getState(isSubTab));
}

function toggleMainView() {
  const currentMode = getState(isGrid);
  const elements = getMainElements();
  changeView(elements, currentMode);
}
function updateSubViewButton() {
  const isSubMode = getState(isSubTab);
  const subTabButton = $(".main_section__header__title--sub");
  const allTabButton = $(".main_section__header__title--all");
  if (isSubMode) {
    subTabButton.style.color = "#000000";
    allTabButton.style.color = "#879298";
  } else {
    subTabButton.style.color = "#879298";
    allTabButton.style.color = "#000000";
  }
}

function setEvent() {
  const mainLogo = $(".container__header__main");
  const listButton = $(".list_button");
  const gridButton = $(".grid_button");
  const subTabButton = $(".main_section__header__title--sub");
  const allTabButton = $(".main_section__header__title--all");
  mainLogo.addEventListener("click", refreshWindow);
  listButton.addEventListener("click", toggleGridClicked);
  gridButton.addEventListener("click", toggleGridClicked);
  subTabButton.addEventListener("click", toggleSubClicked);
  allTabButton.addEventListener("click", toggleSubClicked);
  window.addEventListener("keydown", keyboardClicked);
}

(function init() {
  setEvent();
  register(isGrid, toggleMainView);
  register(isSubTab, updateSubViewButton);
})();

export { updateDate };
