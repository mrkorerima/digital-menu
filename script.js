/* script.js
   - Mobile-friendly menu logic
   - Sends orders to Google Apps Script (replace WEB_APP_URL if needed)
   - Shows a polished pop-up on success
*/

// ----------------- CONFIG -----------------
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyO2PJch9_-Y7lQKPCR67Ea8Dhy3S7JijaaCou3o4D9MA4g--CP4Byn4TcJekgYiQCv/exec";
// ------------------------------------------------

// menu data (same as used in the HTML sample)
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
  { name: "ተልባ ጁስ", description: "Juisii Talbaa", category: "gosa dhugaatii/የመጠጥ ዝርዝር", price: 80 },
  { name: "ካሮት ጁስ", description: "Juisii Kaarotii", category: "gosa dhugaatii/የመጠጥ ዝርዝር", price: 80 },
  { name: "ሀባብ ጁስ", description: "Juisii Habaabii", category: "gosa dhugaatii/የመጠጥ ዝርዝር", price: 80 },
  { name: "ማኪያቶ", description: "Macchiato", category: "dhugaatii ho'aa/ትኩስ መጠጦች", price: 40 },
  { name: "ቡና", description: "Buna", category: "dhugaatii ho'aa/ትኩስ መጠጦች", price: 30 },
  { name: "ሻይ", description: "Shaayii", category: "dhugaatii ho'aa/ትኩስ መጠጦች", price: 25 }
];

// Grab table number from URL (?table=1 .. ?table=12)
const urlParams = new URLSearchParams(window.location.search);
const tableNumber = urlParams.get('table') || "Unknown";

// Create menu UI
function buildMenu() {
  const menuContainer = document.getElementById('menu');
  if (!menuContainer) {
    console.error("No #menu container found in DOM.");
    return;
  }

  // Build categories in order of appearance
  const categories = [...new Set(menuItems.map(i => i.category))];

  categories.forEach(cat => {
    const section = document.createElement('div');
    section.className = 'menu-section';
    const title = document.createElement('div');
    title.className = 'section-title';
    title.textContent = cat;
    section.appendChild(title);

    menuItems.filter(i => i.category === cat).forEach(item => {
      const card = document.createElement('div');
      card.className = 'menu-item';

      // unique id-safe key for qty input
      const key = slugify(item.name);

      card.innerHTML = `
        <div class="item-info">
          <div class="item-name">${escapeHtml(item.name)}</div>
          <div class="item-desc">${escapeHtml(item.description)}</div>
          <div class="item-price">${item.price} Br</div>
          <div class="order-controls">
            <input type="number" id="qty-${key}" value="1" min="1" aria-label="Quantity for ${escapeHtml(item.name)}">
            <button id="btn-${key}">Order</button>
          </div>
        </div>
      `;
      section.appendChild(card);

      // Attach listener
      const btn = card.querySelector(`#btn-${key}`);
      btn.addEventListener('click', () => {
        const qty = parseInt(card.querySelector(`#qty-${key}`).value || 1, 10);
        sendOrder(item, qty, btn);
      });
    });

    menuContainer.appendChild(section);
  });
}

// Send order to Google Apps Script
let sending = false;
async function sendOrder(item, quantity, buttonEl) {
  if (sending) return;
  sending = true;
  const originalText = buttonEl.textContent;
  buttonEl.textContent = "Sending...";
  buttonEl.disabled = true;

  const payload = {
    table: tableNumber,
    item: item.name,
    description: item.description,
    price: item.price,
    quantity: quantity
  };

  try {
    const res = await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // Apps Script returns JSON text — try parse safely
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch(e) { data = { status: 'unknown', raw: text }; }

    if (data && data.status === 'success') {
      showPopup(`✅ Ordered ${quantity} × ${item.name}`);
    } else {
      console.warn('Unexpected response from script:', data);
      showPopup(`⚠️ Order queued (response unknown)`);
    }
  } catch (err) {
    console.error('Order send error:', err);
    showPopup('❌ Network error. Please try again.');
  } finally {
    sending = false;
    buttonEl.textContent = originalText;
    buttonEl.disabled = false;
  }
}

// Small popup UI (creates and manages the element)
function showPopup(message) {
  let popup = document.getElementById('order-popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'order-popup';
    // Basic inline styles; your CSS can override
    Object.assign(popup.style, {
      position: 'fixed',
      top: '18px',
      right: '18px',
      background: '#4caf50',
      color: '#fff',
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999,
      fontSize: '15px',
      opacity: '0',
      transition: 'opacity 0.25s, transform 0.25s',
      transform: 'translateY(-8px)'
    });
    document.body.appendChild(popup);
  }

  popup.textContent = message;
  popup.style.opacity = '1';
  popup.style.transform = 'translateY(0)';

  // hide after 3s
  clearTimeout(popup._hideTimeout);
  popup._hideTimeout = setTimeout(() => {
    popup.style.opacity = '0';
    popup.style.transform = 'translateY(-8px)';
  }, 3000);
}

// helper: slugify string to use as id
function slugify(text) {
  return String(text).normalize('NFKD').replace(/[^\w\s.-_]/g, '').replace(/\s+/g, '-').toLowerCase();
}

// helper: basic html escape
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// initialize
document.addEventListener('DOMContentLoaded', () => {
  // create container if missing (compatibility with different HTML)
  if (!document.getElementById('menu')) {
    const cont = document.createElement('div');
    cont.id = 'menu';
    document.body.insertBefore(cont, document.body.firstChild.nextSibling);
  }
  buildMenu();
  // show table number if header element exists
  const tableInfo = document.getElementById('tableInfo');
  if (tableInfo) tableInfo.textContent = `Table: ${tableNumber}`;
});
