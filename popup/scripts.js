window.onload=()=>{for(let a of document.querySelectorAll("a"))a.addEventListener("click",()=>chrome.tabs.create({url:a.getAttribute("href")}))};
