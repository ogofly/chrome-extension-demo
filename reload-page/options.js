document.addEventListener("DOMContentLoaded", restoreOptions);

document.getElementById("saveBtn").addEventListener("click", saveOptions);

function saveOptions() {
  var enable = document.getElementById("enable").checked;
  chrome.storage.local.set({ enable: enable }, () => {
    var status = document.getElementById("status");
    status.textContent = "saved";
    setTimeout(function () {
      status.textContent = "";
    }, 1500);
  });
}

function restoreOptions() {
  chrome.storage.local.get(["enable"], (r) => {
    document.getElementById("enable").checked = r.enable ? r.enable : "";
  });
}
