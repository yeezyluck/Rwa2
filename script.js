
let MAP=null;
const list=document.getElementById("list");

const loadList=()=>{
 list.innerHTML="";
 const items=JSON.parse(localStorage.getItem("items")||"[]");
 items.forEach(i=>{
  const li=document.createElement("li");
  const arrow=i.prev&&i.price?(i.price>i.prev?"▲":"▼"):"";
  const cls=i.price>i.prev?"up":"down";
  const roi=i.low?(((i.price-i.low*1.01)/i.low)*100).toFixed(1):"";
  li.innerHTML=`<b>${i.name}</b> (${i.id}) 
  <span class="${cls}">${arrow} ${i.price||"?"}</span> gp 
  <span class="small">ROI ${roi||"?"}%</span>`;
  list.appendChild(li);
 });
};

document.getElementById("map").onclick=async()=>{
 if(MAP)return;
 MAP=await (await fetch("https://prices.runescape.wiki/api/v1/osrs/mapping")).json();
 localStorage.setItem("map",JSON.stringify(MAP));
 alert("Mapping loaded");
};

document.getElementById("add").onclick=()=>{
 let n=name.value.trim(), i=id.value.trim();
 if(!i && MAP){
  const f=MAP.find(x=>x.name.toLowerCase()===n.toLowerCase());
  if(f)i=f.id;
 }
 if(!i)return;
 const arr=JSON.parse(localStorage.getItem("items")||"[]");
 arr.push({name:n||i,id:i});
 localStorage.setItem("items",JSON.stringify(arr));
 loadList();
};

document.getElementById("refresh").onclick=async()=>{
 const arr=JSON.parse(localStorage.getItem("items")||"[]");
 for(let it of arr){
  const r=await fetch(`https://prices.runescape.wiki/api/v1/osrs/latest?id=${it.id}`);
  const d=(await r.json()).data[it.id];
  it.prev=it.price;
  it.price=d.high;
  it.low=d.low;
 }
 localStorage.setItem("items",JSON.stringify(arr));
 loadList();
};

document.getElementById("clear").onclick=()=>{
 localStorage.removeItem("items");
 loadList();
};

const m=localStorage.getItem("map");
if(m)MAP=JSON.parse(m);
loadList();
