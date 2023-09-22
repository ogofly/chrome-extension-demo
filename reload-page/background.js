const timeoutForPing = 5 * 1000;

setInterval(async () => {
  const opt = await chrome.storage.local.get(["enable"]);
  if (opt.enable == false || opt.enable == "false") {
    return;
  }
  doDetect();
}, 1000);

let curTabId = 0;

function onPageLoadComplete(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tabId === curTabId) {
    setTimeout(() => prepareShow(tabId), 4000);
  }
}
// 使用chrome.tabs API添加事件监听器
chrome.tabs.onUpdated.addListener(onPageLoadComplete);

// 心跳
let tabPingTimeMap = new Map();
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log(Date.now(), message);
  if (message.type == "ping") {
    tabPingTimeMap[sender.tab.id] = Date.now();
  }
});

let tabNotPingTimeMap = new Map();
async function doDetect() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true, windowType: "normal" });
  if (!tabs || tabs.length === 0) return;
  const t = tabs[0];
  if (t.title.indexOf("悉息掌控") < 0) return;
  let toRecreate = false;

  const now = Date.now();
  let prePingTs = tabPingTimeMap[t.id];
  if (prePingTs) {
    let d = now - prePingTs
    if (d > timeoutForPing) {
      toRecreate = true;
      console.log("toRecreate..", "delay", d, "pre ping:", prePingTs, "now:", now);
    }
  } else {
    const np = tabNotPingTimeMap[t.id];
    if (np && now - np >= timeoutForPing) {
      toRecreate = true;
      d = now - np
      console.log("toRecreate..", "delay:", d, "no ping found at:", prePingTs, "now:", now);
    }
  }
  if (!toRecreate) return;

  const url = t.url;
  // await chrome.tabs.reload(t.id)
  const preTabId = t.id;

  // create new
  const nt = await chrome.tabs.create({ url: url });
  curTabId = nt.id;
  // remove old
  await chrome.tabs.remove(preTabId);

  // prepareShow(nt.id);
  // setTimeout(async () => {
  //   await prepareShow(nt.id);
  // }, 4000);
  // await chrome.windows.update(windowId, { state: "fullscreen" })
}

async function prepareShow(tid) {
  // 收起左侧菜单栏
  await chrome.scripting.executeScript({
    target: { tabId: tid },
    func: function () {
      document.querySelector(".close-menu")?.click();
    },
  });
  // 全屏显示
  await chrome.scripting.executeScript({
    target: { tabId: tid },
    func: function () {
      // const fullScreenBtn = "#app-header-menu-change-id > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(1)";
      // // .app_action-icon__lG7zf
      // const btn = document.querySelector(fullScreenBtn);
      // console.log("btn", btn);
      // btn.click();

      // let el = document.documentElement,
      //   rfs = el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
      //   console.log("doc", el)
      //   console.log("fullScreen", rfs);
      // rfs.call(el);

      document.querySelector(".kanban-view").style.top = "0px";
      document.querySelector(".app-header").style.height = 0;
      document.querySelector(".icon-app-container-fiexd").style.opacity = 0;
    },
  });
}
