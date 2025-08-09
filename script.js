// ========== CONFIG ==========
// Put your Google Apps Script URL here:
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyTeI_JYIWd8ah5tUU9eYoTq5K84foWnpZDjvwRX6tFJpoIlJt5U_LMK3YTmEuqKi7k/exec";

// ===========================

// Grab DOM elements
const menuEl = document.getElementById("menu");
const cartPanel = document.getElementById("cartPanel");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const submitOrderBtn = document.getElementById("submitOrderBtn");
const cartCountEl = document.getElementById("cartCount");
const popup = document.getElementById("popup");

// Cart data structure: [{id, name, price, quantity}]
let cart = [];

// Parse table number from URL query string
function getTableNumber() {
  const params = new URLSearchParams(window.location.search);
  const table = params.get("table");
  if (!table || isNaN(table) || table < 1) {
    return "Unknown";
  }
  return table;
}
const tableNumber = getTableNumber();

// Full menu data (Amharic + Oromifa + category + price)
const menuData = [
  { id: 1, name: "ጨጨብሳ በእንቁላል", description: "Cacabsaa Killeen", category: "ciree/ቁርስ", price: 250 },
  { id: 2, name: "ጨጨብሳ እስፔሻል", description: "Cacabsaa Iispehsalaa(Kitfoni)", category: "ciree/ቁርስ", price: 300 },
  { id: 3, name: "ጨጨብሳ ኖርማል", description: "Cacabsaa", category: "ciree/ቁርስ", price: 150 },
  { id: 4, name: "ቡላ ፍርፍር እስፔውሻል", description: "Firfirii Bulaa Iispeshalaa", category: "ciree/ቁርስ", price: 300 },
  { id: 5, name: "ቡላ ፍርፍር ኖርማል", description: "Firfirii Bulaa", category: "ciree/ቁርስ", price: 150 },
  { id: 6, name: "ገንፎ እስፔሻል", description: "Marqaa Iispeshalaa", category: "ciree/ቁርስ", price: 300 },
  { id: 7, name: "የቡላ ገንፎ", description: "Marqaa Bulaa", category: "ciree/ቁርስ", price: 150 },
  { id: 8, name: "ቡላ ገንፎ እስፔሻል", description: "Marqaa Bulaa Iispehsalaa", category: "ciree/ቁርስ", price: 300 },
  { id: 9, name: "ጭኮ", description: "Micciiraa", category: "ciree/ቁርስ", price: 500 },
  { id: 10, name: "ቂንጬ", description: "Qincee", category: "ciree/ቁርስ", price: 150 },
  { id: 11, name: "ቡላ ፍርፍር በአይብ", description: "Firfirii Bula Shalalan", category: "ciree/ቁርስ", price: 200 },
  { id: 12, name: "እርጎ", description: "Itituu", category: "gosa dhugaatii/የመጠጥ ዝርዝር", price: 80 },
  { id: 13, name: "ትፈልቶ የቀዘቀዘ ወተት", description: "Aannan Kabanayee", category: "gosa dhugaatii/የመጠጥ ዝርዝር", price: 40 },
  { id: 14, name: "ለስላሳ", description: "Lalaffaa", category: "gosa dhugaatii/የመጠጥ ዝርዝር", price: 40 },
  { id: 15, name: "ውሃ 2 ሊትር", description: "Bishaan L2", category: "gosa dhugaatii/የመጠጥ ዝርዝር", price: 35 },
  { id: 16, name: "ውሃ 1 ሊትር", description: "Bishaan L1", category: "gosa dhugaatii/የመጠጥ ዝርዝር", price: 25 },
  { id: 17, name: "ውሃ 1/2 ሊትር", description: "Bishaan L1/2", category: "gosa dhugaatii/የመጠጥ ዝርዝር", price: 25 },
  { id: 18, name: "ተልባ ጁስ እስፔሻል", description: "Juisii Talbaa Ispeshalaa", category: "gosa dhugaatii/የመጠጥ ዝርዝር", price: 100 },
  { id: 19, name: "ተልባ ጁስ", description: "Juisii Talbaa Ispeshalaa", category: "gosa dhugaatii/የመጠጥ ዝርዝር", price: 80 },
  { id: 20, name: "ካሮት ጁስ", description: "Juisii Kaarotii", category: "gosa dhugaatii/የመጠጥ ዝርዝር", price: 80 },
  { id: 21, name: "ሀባብ ጁስ", description: "Juisii Habaabii", category: "gosa dhugaatii/የመጠጥ ዝርዝር", price: 80 },
  { id: 22, name: "ማኪያቶ", description: "Macchiato", category: "dhugaatii ho'aa/ትኩስ መጠጦች", price: 40 },
  { id: 23, name: "ቡና", description: "Buna", category: "dhugaatii ho'aa/ትኩስ መጠጦች", price: 30 },
  { id: 24, name: "ሻይ", description: "Shaayii", category: "dhugaatii ho'aa/ትኩስ መጠጦች", price: 25 }
];

// Group items by category for display
function groupByCategory(items) {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});
}

// Render the menu with quantity inputs and add buttons
function renderMenu() {
  const grouped = groupByCategory(menuData);
  menuEl.innerHTML = "";

  for (const [category, items] of Object.entries(grouped)) {
    const catDiv = document.createElement("section");
    catDiv.className = "category";

    const catTitle = document.createElement("h2");
    catTitle.textContent = category;
    catDiv.appendChild(catTitle);

    items.forEach((item) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "item";

      itemDiv.innerHTML = `
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-desc">${item.description}</div>
        </div>
        <div>
          <span class="item-price">${item.price} ETB</span>
          <input type="number" min="1" value="1" class="qty-select" id="qty-${item.id}" />
          <button class="add-btn" data-id="${item.id}">Add</button>
        </div>
      `;

      catDiv.appendChild(itemDiv);
    });

    menuEl.appendChild(catDiv);
  }
}

// Add item to cart or update quantity if already in cart
function addToCart(id, qty) {
  const existing = cart.find((c) => c.id === id);
  if (existing) {
    existing.quantity += qty;
  } else {
    const item = menuData.find((m) => m.id === id);
    cart.push({ id: item.id, name: item.name, price: item.price, quantity: qty });
  }
  renderCart();
}

// Render the cart items inside the side panel
function renderCart() {
  cartItemsEl.innerHTML = "";
  if (cart.length === 0) {
    cartItemsEl.textContent = "Your cart is empty.";
    submitOrderBtn.disabled = true;
    cartCountEl.textContent = 0;
    cartTotalEl.textContent = "";
    return;
  }

  cart.forEach((item) => {
    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";

    itemEl.innerHTML = `
      <div class="cart-item-name">${item.name}</div>
      <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" class="cart-item-qty" />
      <div class="cart-item-price">${item.price * item.quantity} ETB</div>
      <button class="cart-item-remove" aria-label="Remove ${item.name}" data-id="${item.id}">&times;</button>
    `;

    cartItemsEl.appendChild(itemEl);
  });

  // Calculate total
  const total = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  cartTotalEl.textContent = `Total: ${total} ETB`;
  cartCountEl.textContent = cart.reduce((acc, i) => acc + i.quantity, 0);
  submitOrderBtn.disabled = false;

  // Add event listeners for qty changes & removal
  document.querySelectorAll(".cart-item-qty").forEach((input) => {
    input.addEventListener("change", (e) => {
      const id = parseInt(e.target.dataset.id);
      let val = parseInt(e.target.value);
      if (isNaN(val) || val < 1) val = 1;
      e.target.value = val;
      const cartItem = cart.find((c) => c.id === id);
      if (cartItem) {
        cartItem.quantity = val;
        renderCart();
      }
    });
  });

  document.querySelectorAll(".cart-item-remove").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      cart = cart.filter((c) => c.id !== id);
      renderCart();
    });
  });
}

// Event: Add buttons in menu
menuEl.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-btn")) {
    const id = parseInt(e.target.dataset.id);
    const qtyInput = document.getElementById(`qty-${id}`);
    let qty = parseInt(qtyInput.value);
    if (isNaN(qty) || qty < 1) qty = 1;
    addToCart(id, qty);
    qtyInput.value = "1"; // reset qty input
  }
});

// Toggle cart panel open/close
openCartBtn.addEventListener("click", () => {
  cartPanel.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
});

closeCartBtn.addEventListener("click", () => {
  cartPanel.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
});

// Submit order event
submitOrderBtn.addEventListener("click", () => {
  if (cart.length === 0) return;
  submitOrderBtn.disabled = true;
  submitOrderBtn.textContent = "Sending...";

  // Prepare payload
  const payload = {
    table: tableNumber,
    order: cart.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity,
    })),
    totalPrice: cart.reduce((acc, i) => acc + i.price * i.quantity, 0),
    timestamp: new Date().toISOString(),
  };

  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Network response not ok");
      return res.text();
    })
    .then(() => {
      // Clear cart and close panel
      cart = [];
      renderCart();
      cartPanel.classList.remove("open");
      cartPanel.setAttribute("aria-hidden", "true");
      submitOrderBtn.textContent = "Submit Order";
      showPopup("✅ Order Sent!");
    })
    .catch((err) => {
      submitOrderBtn.disabled = false;
      submitOrderBtn.textContent = "Submit Order";
      alert("Error sending order. Please try again.");
      console.error("Order submission error:", err);
    });
});

// Show popup message
function showPopup(message) {
  popup.textContent = message;
  popup.classList.add("show");
  setTimeout(() => {
    popup.classList.remove("show");
  }, 3000);
}

// Initial rendering
renderMenu();
renderCart();
