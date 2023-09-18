document.addEventListener("DOMContentLoaded", restoreOptions);

document.getElementById("saveBtn").addEventListener("click", saveOptions);

function saveOptions() {
  var refreshInterval = document.getElementById("refreshInterval").value;
  let refreshTime = document.getElementById("refreshTime").value;
  chrome.storage.local.set({ refreshInterval: refreshInterval, refreshTime: refreshTime }, () => {
    var status = document.getElementById("status");
    status.textContent = "saved";
    setTimeout(function () {
      status.textContent = "";
    }, 1500);
  });
}

function restoreOptions() {
  chrome.storage.local.get(["refreshInterval", "refreshTime"], (r) => {
    document.getElementById("refreshInterval").value = r.refreshInterval;
    document.getElementById("refreshTime").value = r.refreshTime ? r.refreshTime : "";
  });
}
