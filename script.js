
console.log("JS loaded");

const list = document.getElementById('list');
const addBtn = document.getElementById('add');
const clearBtn = document.getElementById('clear');
const statusEl = document.getElementById('status');
const installBtn = document.getElementById('install');
const loadBtn = document.getElementById('load');

let deferredPrompt;
let ITEM_MAP = null;

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

function loadList() {
  list.innerHTML = "";
  JSON.parse(localStorage.getItem("watch") || "[]")
    .forEach(i => {
      const li = document.createElement("li");
      li.textContent = i;
      list.appendChild(li);
    });
}

loadBtn.onclick = async () => {
  if (ITEM_MAP) {
    alert("Mapping already loaded");
    return;
  }
  try {
    const res = await fetch("https://prices.runescape.wiki/api/v1/osrs/mapping");
    ITEM_MAP = await res.json();
    localStorage.setItem("osrs_mapping", JSON.stringify(ITEM_MAP));
    alert("Loaded " + ITEM_MAP.length + " items");
  } catch (e) {
    alert("Failed to load mapping");
    console.error(e);
  }
};

addBtn.onclick = () => {
  let name = document.getElementById('item').value.trim();
  let id = document.getElementById('id').value.trim();

  if (!name && !id) return;

  if (!id && ITEM_MAP) {
    const found = ITEM_MAP.find(
      i => i.name.toLowerCase() === name.toLowerCase()
    );
    if (found) id = found.id;
  }

  const label = id ? `${name || id} (${id})` : name;

  const arr = JSON.parse(localStorage.getItem("watch") || "[]");
  arr.push(label);
  localStorage.setItem("watch", JSON.stringify(arr));
  loadList();
};

clearBtn.onclick = () => {
  localStorage.removeItem("watch");
  loadList();
};

const cached = localStorage.getItem("osrs_mapping");
if (cached) {
  ITEM_MAP = JSON.parse(cached);
  console.log("Mapping restored:", ITEM_MAP.length);
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}

loadList();
