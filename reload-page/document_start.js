// var s = document.createElement('script');
// s.src = chrome.runtime.getURL('inject.js');
// s.onload = function() {
//     this.remove();
// };
// (document.head || document.documentElement).appendChild(s);

function ping() {
  setInterval(function () {
    chrome.runtime.sendMessage({ type: "ping" });
  }, 1000);
}

window.addEventListener("load", ping);
