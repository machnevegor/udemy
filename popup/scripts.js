window.onload = () => {
  document.querySelectorAll("a").forEach((el) => {
    el.addEventListener("click", () => {
      chrome.tabs.create({ url: el.getAttribute("href") });
    });
  });
};
