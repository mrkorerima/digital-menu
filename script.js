const menuData = [
  { name: "ጨጨብሳ በእንቁላል", desc: "Cacabsaa Killeen", cat: "ቁርስ", price: 250 },
  { name: "ጨጨብሳ እስፔሻል", desc: "Cacabsaa Iispehsalaa(Kitfoni)", cat: "ቁርስ", price: 300 },
  { name: "ጨጨብሳ ኖርማል", desc: "Cacabsaa", cat: "ቁርስ", price: 150 },
  { name: "ቡላ ፍርፍር እስፔውሻል", desc: "Firfirii Bulaa Iispeshalaa", cat: "ቁርስ", price: 300 },
  { name: "ቡላ ፍርፍር ኖርማል", desc: "Firfirii Bulaa", cat: "ቁርስ", price: 150 },
  { name: "ገንፎ እስፔሻል", desc: "Marqaa Iispeshalaa", cat: "ቁርስ", price: 300 },
  { name: "የቡላ ገንፎ", desc: "Marqaa Bulaa", cat: "ቁርስ", price: 150 },
  { name: "ቡላ ገንፎ እስፔሻል", desc: "Marqaa Bulaa Iispehsalaa", cat: "ቁርስ", price: 300 },
  { name: "ጭኮ", desc: "Micciiraa", cat: "ቁርስ", price: 500 },
  { name: "ቂንጬ", desc: "Qincee", cat: "ቁርስ", price: 150 },
  { name: "ቡላ ፍርፍር በአይብ", desc: "Firfirii Bula Shalalan", cat: "ቁርስ", price: 200 },
  { name: "እርጎ", desc: "Itituu", cat: "የመጠጥ", price: 80 },
  { name: "ትፈልቶ የቀዘቀዘ ወተት", desc: "Aannan Kabanayee", cat: "የመጠጥ", price: 40 },
  { name: "ለስላሳ", desc: "Lalaffaa", cat: "የመጠጥ", price: 40 },
  { name: "ውሃ 2 ሊትር", desc: "Bishaan L2", cat: "የመጠጥ", price: 35 },
  { name: "ውሃ 1 ሊትር", desc: "Bishaan L1", cat: "የመጠጥ", price: 25 },
  { name: "ውሃ 1/2 ሊትር", desc: "Bishaan L1/2", cat: "የመጠጥ", price: 25 },
  { name: "ተልባ ጁስ እስፔሻል", desc: "Juisii Talbaa Ispeshalaa", cat: "የመጠጥ", price: 100 },
  { name: "ተልባ ጁስ", desc: "Juisii Talbaa", cat: "የመጠጥ", price: 80 },
  { name: "ካሮት ጁስ", desc: "Juisii Kaarotii", cat: "የመጠጥ", price: 80 },
  { name: "ሀባብ ጁስ", desc: "Juisii Habaabii", cat: "የመጠጥ", price: 80 },
  { name: "ማኪያቶ", desc: "Macchiato", cat: "ትኩስ መጠጦች", price: 40 },
  { name: "ቡና", desc: "Buna", cat: "ትኩስ መጠጦች", price: 30 },
  { name: "ሻይ", desc: "Shaayii", cat: "ትኩስ መጠጦች", price: 25 },
];

const menuContainer = document.getElementById("menu");
const groupedMenu = {};

menuData.forEach(item => {
  if (!groupedMenu[item.cat]) groupedMenu[item.cat] = [];
  groupedMenu[item.cat].push(item);
});

for (const cat in groupedMenu) {
  const catDiv = document.createElement("div");
  catDiv.classList.add("category");
  catDiv.innerHTML = `<h2>${cat}</h2>`;
  
  groupedMenu[cat].forEach(product => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");
    itemDiv.innerHTML = `
      <span>${product.name} - ${product.price} ETB</span>
      <button onclick="sendOrder('${product.name}', ${product.price})">Order</button>
    `;
    catDiv.appendChild(itemDiv);
  });
  menuContainer.appendChild(catDiv);
}

function sendOrder(item, price) {
  const table = document.getElementById("tableSelect").value;
  if (!table) {
    alert("Please select a table first!");
    return;
  }

  fetch("YOUR-APPSCRIPT-URL", { // Replace with your Google Apps Script URL
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table, item, price })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      document.getElementById("popup").style.display = "block";
      setTimeout(() => {
        document.getElementById("popup").style.display = "none";
      }, 3000);
    }
  })
  .catch(err => console.error(err));
}
