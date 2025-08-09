/* script.js
   - Full product list
   - Sends orders to Google Apps Script (no-cors mode)
   - Shows polished pop-up on success
*/

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyTeI_JYIWd8ah5tUU9eYoTq5K84foWnpZDjvwRX6tFJpoIlJt5U_LMK3YTmEuqKi7k/exec";

// Full menu (all items from your list)
const menuItems = [
  { name: "ጨጨብሳ በእንቁላል", description: "Cacabsaa Killeen", category: "ciree/ቁርስ", price: 250 },
  { name: "ጨጨብሳ እስፔሻል", description: "Cacabsaa Iispehsalaa(Kitfoni)", category: "ciree/ቁርስ", price: 300 },
  { name: "ጨጨብሳ ኖርማል", description: "Cacabsaa", category: "ciree/ቁርስ", price: 150 },
  { name: "ቡላ ፍርፍር እስፔውሻል", description: "Firfirii Bulaa Iispeshalaa", category: "ciree/ቁርስ", price: 300 },
  { name: "ቡላ ፍርፍር ኖርማል", description: "Firfirii Bulaa", category: "ciree/ቁርስ", price: 150 },
  { name: "ገንፎ እስፔሻል", description: "Marqaa Iispeshalaa", category: "ciree/ቁርስ", price: 300 },
  { name: "የቡላ ገንፎ", description: "Marqaa Bulaa", category: "ciree/ቁርስ", price: 150 },
  { name: "ቡላ ገንፎ እስፔሻል", description: "Marqaa Bulaa Iispehsalaa", category: "ciree/ቁርስ", price: 300 },
  { name: "ጭኮ", description: "Micciiraa", category: "ciree/ቁርስ", price: 500 },
  { name: "ቂንጬ", description: "Qincee", category: "ciree/ቁርስ", price: 150 },
  { name: "ቡላ ፍርፍር በአይብ", description: "Firfirii Bula Shalalan", category: "ciree/ቁርስ", price: 200 },
  { name: "እርጎ", description: "Itituu", category: "gosa dhugaatii/የመጠጥ ዝርዝር", price: 80 },
  { name: "ትፈልቶ የቀዘቀዘ ወተት", description: "Aannan Kabanayee", category: "gosa dhugaatii/የመጠጥ ዝርዝር", price: 40 },
  { name: "ለስላሳ", description: "Lalaffaa", category: "gosa dhugaatii/የመጠጥ ዝርዝር", price: 40 },
  { name: "ውሃ 2 ሊትር", description: "Bishaan L2", category: "gosa dhugaatii/የመጠጥ ዝርዝር", price: 35 },
  { name: "ውሃ 1 ሊትር", description: "Bishaan L1", category: "gosa dhugaatii/የመጠጥ ዝርዝር", price: 25 },
  { name: "ውሃ 1/2 ሊትር", description: "Bishaan L1/2", category: "gosa dhugaatii/የመጠጥ ዝርዝር", price: 25 },
  { name: "ተልባ ጁስ እስፔሻል", description: "Juisii Talbaa Ispeshalaa", category: "gosa dhugaatii/የመጠጥ ዝርዝር", price: 100 },
  { name: "ተልባ ጁስ", description: "Juisii Talbaa Ispeshalaa", category: "gosa dhugaatii/የመጠጥ ዝርዝር", price: 80 },
  { name: "ካሮት ጁስ", description: "Juisii Kaarotii", category: "gosa dhugaatii/የመጠጥ ዝርዝር", price: 80 },
  { name: "ሀባብ ጁስ", description: "Juisii Habaabii", category: "gosa dhugaatii/የመጠጥ ዝርዝር", price: 80 },
  { name: "ማኪያቶ", description: "Macchiato", category: "dhugaatii ho'aa/ትኩስ መጠጦች", price: 40 },
  { name: "ቡና", description: "Buna", category: "dhugaatii ho'aa/ትኩስ መጠጦች", price: 30 },
  { name: "ሻይ", description: "Shaayii", category: "dhugaatii ho'aa/ትኩስ መጠጦች", price: 25 }
];

// get table from url (?table=1..12)
const table = (new URLSearchParams(window.location.search)).get('table') || 'Unknown';

// build UI
function renderMenu() {
  const menu = document.getElementById('menu');
  menu.innerHTML = ''; // clear

  // group by category
  const cats = [...new Set(menuItems.map(i => i.category))];

  cats.forEach(cat => {
    const sec = document.createElement('div');
    sec.className = 'menu-section';

    const title = document.createElement('div');
    title.className = 'section-title';
    title.textContent = cat;
    sec.appendChild(title);

    menuItems.filter(i => i.category === cat).forEach(item => {
      const key = slugify(item.name);
      const card = document.createElement('div');
      card.className = 'menu-item';
      card.innerHTML = `
        <div class="item-info">
          <div class="item-name">${escapeHtml(item.name)}</div>
          <div class="item-desc">${escapeHtml(item.description)}</div>
        </div>
        <div class="item-meta">
          <div class="item-price">${item.price} Br</div>
          <div class="order-controls">
            <input type="number" id="qty-${key}" min="1" value="1" style="width:60px;padding:6px;border-radius:6px;border:1px solid #ddd;">
            <button id="btn-${key}">Order</button>
          </div>
        </div>
      `;
      sec.appendChild(card);

      // attach event
      card.querySelector(`#btn-${key}`).addEventListener('click', () => {
        const qty = parseInt(document.getElementById(`qty-${key}`).value || '1', 10);
        sendOrder(item, qty);
      });
    });

    menu.appendChild(sec);
  });

  // show table number if element exists
  const tableInfo = document.getElementById('tableInfo');
  if (tableInfo) tableInfo.textContent = `Table: ${table}`;
}

function sendOrder(item, qty) {
  // show immediate popup (we'll treat POST as fire-and-forget because of no-cors)
  showPopup(`Sending ${qty} × ${item.name}...`);

  const payload = {
    table: table,
    item: item.name,
    description: item.description,
    price: item.price,
    quantity: qty
  };

  // use no-cors to avoid CORS preflight blocking in browsers
  fetch(WEB_APP_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(() => {
    // With no-cors we can't read response; assume success if no network error thrown
    showPopup(`✅ Ordered ${qty} × ${item.name}`);
  })
  .catch(err => {
    console.error('sendOrder error:', err);
    showPopup('❌ Network error — try again');
  });
}

// popup
let popupTimeout;
function showPopup(text) {
  let pop = document.getElementById('order-popup');
  if (!pop) {
    pop = document.createElement('div');
    pop.id = 'order-popup';
    Object.assign(pop.style, {
      position: 'fixed',
      top: '18px',
      right: '18px',
      background: '#4caf50',
      color: '#fff',
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
      zIndex: 9999,
      fontSize: '15px',
      opacity: 0,
      transition: 'opacity 0.25s, transform 0.25s',
      transform: 'translateY(-8px)'
    });
    document.body.appendChild(pop);
  }
  pop.textContent = text;
  pop.style.opacity = 1;
  pop.style.transform = 'translateY(0)';
  clearTimeout(popupTimeout);
  popupTimeout = setTimeout(() => {
    pop.style.opacity = 0;
    pop.style.transform = 'translateY(-8px)';
  }, 3000);
}

// helpers
function slugify(s) {
  return s.toString().normalize('NFKD').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase();
}
function escapeHtml(s) {
  return (s+'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// init
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('menu')) {
    const m = document.createElement('div'); m.id = 'menu'; document.body.appendChild(m);
  }
  renderMenu();
  // show table in header if exists
  const headerTable = document.getElementById('tableInfo');
  if (headerTable) headerTable.textContent = `Table: ${table}`;
});
