document.addEventListener("DOMContentLoaded", restoreOptions);

document.getElementById("saveBtn").addEventListener("click", saveOptions);

function saveOptions() {
  var refreshInterval = document.getElementById("refreshInterval").value;
  chrome.storage.local.set({ refreshInterval: refreshInterval }, () => {
    var status = document.getElementById("status");
    status.textContent = "saved";
    setTimeout(function () {
      status.textContent = "";
    }, 1500);
  });
}

function restoreOptions() {
  chrome.storage.local.get(["refreshInterval"], (r) => {
    document.getElementById("refreshInterval").value = r.refreshInterval;
  });
}
