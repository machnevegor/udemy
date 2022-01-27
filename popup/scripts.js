window.onload = () => {
  for (let link of document.querySelectorAll("a")) {
    link.addEventListener("click", () => {
      chrome.tabs.create({
        url: link.getAttribute("href"),
      });
    });
  }
};
