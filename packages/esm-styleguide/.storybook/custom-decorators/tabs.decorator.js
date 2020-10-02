import { useEffect } from "@storybook/client-api";

const lastViewedLangKey = "omrs-storybook:preferred-lang";

function getLastViewedLang() {
  return localStorage.getItem(lastViewedLangKey);
}

function getTabs() {
  return document.querySelectorAll(".tab");
}

function getPanels() {
  return document.querySelectorAll(".panel");
}

function saveLastViewedLang(lang) {
  localStorage.setItem(lastViewedLangKey, lang);
}

function showAll(elements) {
  elements.forEach((el) => el.classList.add("active"));
}

function hideAll(elements) {
  elements.forEach((el) => el.classList.remove("active"));
}

function switchTab($event) {
  const tabs = getTabs();
  const panels = getPanels();
  const lang = $event.target.getAttribute("lang");
  const panelsToBeDisplayed = document.querySelectorAll(`.${lang}`);
  const tabsToBeDisplayed = document.querySelectorAll(`div[lang=${lang}]`);
  hideAll(tabs);
  hideAll(panels);
  showAll(tabsToBeDisplayed);
  showAll(panelsToBeDisplayed);
  saveLastViewedLang(lang);
}

function showLastViewedLangTab() {
  const lastViewedLang = getLastViewedLang() || "html";
  const tabs = document.querySelectorAll(`div[lang=${lastViewedLang}]`);
  const panels = document.querySelectorAll(`.${lastViewedLang}`);
  showAll(tabs);
  showAll(panels);
}

export const withTabs = (storyFn) => {
  useEffect(() => {
    showLastViewedLangTab();
    getTabs().forEach((tab) => tab.addEventListener("click", switchTab));
  });
  return storyFn();
};
