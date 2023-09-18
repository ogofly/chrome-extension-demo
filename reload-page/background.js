// chrome.alarms.create("dailyRefresh", {
//   periodInMinutes: 1,
//   when: getFireTime(),
// });

// chrome.alarms.onAlarm.addListener(function (alarm) {
//   if (alarm.name === "dailyRefresh") {
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//       if (tabs.length > 0) {
//         chrome.tabs.reload(tabs[0].id);
//         notifyRefresh();
//       }
//     });
//   }
// });

let preReloadTs = 0;
setInterval(async () => {
  const now = new Date();
  const intv = await getInterval();
  if (intv <= 0 || now.getTime() - preReloadTs < intv * 1000) return;
  console.log(now, "reload");
  preReloadTs = now.getTime();
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length > 0) {
      chrome.tabs.reload(tabs[0].id);
      // notifyRefresh();
    }
  });
}, 1000);

function getFireTime() {
  var now = new Date();
  return now.getTime() + 3000;
}

function notifyRefresh() {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "./icon.png",
    title: "网页已刷新",
    message: "网页已刷新！",
  });
}

function getInterval() {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get(["refreshInterval"], (r) => {
      const v = r.refreshInterval ? Number.parseInt(r.refreshInterval) : 0;
      resolve(v);
    });
  });
}
