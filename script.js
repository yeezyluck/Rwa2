
console.log("JS loaded");

const list = document.getElementById('list');
const addBtn = document.getElementById('add');
const clearBtn = document.getElementById('clear');
const statusEl = document.getElementById('status');
const installBtn = document.getElementById('install');

let deferredPrompt;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.hidden = false;
});

installBtn.onclick = async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt = null;
  installBtn.hidden = true;
};

function updateStatus() {
  statusEl.textContent = navigator.onLine ? "Online" : "Offline";
}
window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);
updateStatus();

function load() {
  list.innerHTML = "";
  JSON.parse(localStorage.getItem("watch") || "[]")
    .forEach(i => {
      const li = document.createElement("li");
      li.textContent = i;
      list.appendChild(li);
    });
}

addBtn.onclick = () => {
  const v = document.getElementById('item').value || document.getElementById('id').value;
  if (!v) return;
  const arr = JSON.parse(localStorage.getItem("watch") || "[]");
  arr.push(v);
  localStorage.setItem("watch", JSON.stringify(arr));
  load();
};

clearBtn.onclick = () => {
  localStorage.removeItem("watch");
  load();
};

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}

load();
