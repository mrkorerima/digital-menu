const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyTeI_JYIWd8ah5tUU9eYoTq5K84foWnpZDjvwRX6tFJpoIlJt5U_LMK3YTmEuqKi7k/exec";

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
const cartPanel = document.getElementById("cartPanel");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalDisplay = document.getElementById("cartTotal");
const submitOrderBtn = document.getElementById("submitOrderBtn");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const popup = document.getElementById("popup");
const cartCount = document.getElementById("cartCount");
const tableSelect = document.getElementById("tableSelect");

let cart = {};

// Group menu by category
const groupedMenu = menuData.reduce((acc, item) => {
  if (!acc[item.cat]) acc[item.cat] = [];
  acc[item.cat].push(item);
  return acc;
}, {});

function renderMenu() {
  for (const cat in groupedMenu) {
    const catDiv = document.createElement("div");
    catDiv.classList.add("category");
    catDiv.innerHTML = `<h2>${cat}</h2>`;

    groupedMenu[cat].forEach((product) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("item");
      itemDiv.innerHTML = `
        <div class="item-info">
          <div class="item-name">${product.name}</div>
          <div class="item-desc">${product.desc}</div>
        </div>
        <div>
          <span class="item-price">${product.price} ETB</span>
          <button aria-label="Add ${product.name} to cart" onclick="addToCart('${product.name}', ${product.price})">+</button>
        </div>
      `;
      catDiv.appendChild(itemDiv);
    });

    menuContainer.appendChild(catDiv);
  }
}

function addToCart(name, price) {
  if (!tableSelect.value) {
    alert("Please select a table first!");
    return;
  }

  if (cart[name]) {
    cart[name].qty++;
  } else {
    cart[name] = { price, qty: 1 };
  }
  updateCartUI();
}

function removeFromCart(name) {
  if (!cart[name]) return;
  cart[name].qty--;
  if (cart[name].qty <= 0) {
    delete cart[name];
  }
  updateCartUI();
}

function updateCartUI() {
  cartItemsContainer.innerHTML = "";
  const items = Object.entries(cart);
  let total = 0;

  if (items.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    submitOrderBtn.disabled = true;
    cartCount.textContent = 0;
    cartTotalDisplay.textContent = "";
    return;
  }

  items.forEach(([name, data]) => {
    total += data.price * data.qty;
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <div class="cart-item-name">${name}</div>
      <button class="cart-item-remove" aria-label="Remove one ${name}" onclick="removeFromCart('${name}')">−</button>
      <div class="cart-item-qty">x${data.qty}</div>
      <div class="cart-item-price">${(data.price * data.qty).toFixed(2)} ETB</div>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartTotalDisplay.textContent = `Total: ${total.toFixed(2)} ETB`;
  submitOrderBtn.disabled = false;
  cartCount.textContent = items.length;
}

function toggleCart(open) {
  if (open) {
    cartPanel.classList.add("open");
    cartPanel.setAttribute("aria-hidden", "false");
  } else {
    cartPanel.classList.remove("open");
    cartPanel.setAttribute("aria-hidden", "true");
  }
}

openCartBtn.addEventListener("click", () => toggleCart(true));
closeCartBtn.addEventListener("click", () => toggleCart(false));

// Submit order handler
submitOrderBtn.addEventListener("click", () => {
  if (!tableSelect.value) {
    alert("Please select a table first!");
    return;
  }
  if (Object.keys(cart).length === 0) {
    alert("Cart is empty!");
    return;
  }

  const table = tableSelect.value;
  const orders = [];

  for (const [name, data] of Object.entries(cart)) {
    orders.push({ table, item: name, price: data.price, quantity: data
