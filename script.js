const translations = {
  fa: {
    "page.title": "کافه",
    "header.title": "کافه",
    "header.subtitle": "قهوه تازه، خوراکی تازه",
    "category.coffee": "قهوه",
    "category.iced": "نوشیدنی‌های خنک",
    "category.pastries": "شیرینی",
    "item.espresso.name": "اسپرسو",
    "item.espresso.desc": "یک شات اسپرسوی قوی",
    "item.cappuccino.name": "کاپوچینو",
    "item.cappuccino.desc": "اسپرسو همراه با کف شیر داغ",
    "item.latte.name": "لته",
    "item.latte.desc": "اسپرسوی یکدست همراه با شیر گرم",
    "item.americano.name": "آمریکانو",
    "item.americano.desc": "اسپرسو با آب داغ",
    "item.icedlatte.name": "آیس لته",
    "item.icedlatte.desc": "اسپرسوی سرد شده با شیر سرد و یخ",
    "item.icedamericano.name": "آیس آمریکانو",
    "item.icedamericano.desc": "اسپرسوی خنک با آب یخ",
    "item.croissant.name": "کروسان",
    "item.croissant.desc": "شیرینی کلاسیک فرانسوی، کره‌ای و لایه‌لایه",
    "item.cheesecake.name": "چیزکیک",
    "item.cheesecake.desc": "برش نیویورکی با بافت کرمی",
    "btn.add": "افزودن +",
    "btn.added": "افزوده شد ✓",
    "btn.viewcart": "مشاهده سفارش",
    "cart.items": "آیتم",
    "cart.title": "سفارش شما",
    "cart.empty": "سبد خرید شما خالی است.",
    "cart.total": "جمع کل",
    "btn.confirm": "تایید سفارش",
    "cart.each": "هرکدام",
    "alert.empty": "سبد خرید شما خالی است.",
    "alert.confirmed": "سفارش شما ثبت شد!",
    currency: "تومان",
  },
  en: {
    "page.title": "Cafe",
    "header.title": "Cafe",
    "header.subtitle": "Fresh brews, fresh bites",
    "category.coffee": "Coffee",
    "category.iced": "Iced Drinks",
    "category.pastries": "Pastries",
    "item.espresso.name": "Espresso",
    "item.espresso.desc": "Strong and bold single shot",
    "item.cappuccino.name": "Cappuccino",
    "item.cappuccino.desc": "Espresso with steamed milk foam",
    "item.latte.name": "Latte",
    "item.latte.desc": "Smooth espresso with steamed milk",
    "item.americano.name": "Americano",
    "item.americano.desc": "Espresso with hot water",
    "item.icedlatte.name": "Iced Latte",
    "item.icedlatte.desc": "Chilled espresso with cold milk over ice",
    "item.icedamericano.name": "Iced Americano",
    "item.icedamericano.desc": "Cool and refreshing espresso with iced water",
    "item.croissant.name": "Croissant",
    "item.croissant.desc": "Buttery, flaky French classic",
    "item.cheesecake.name": "Cheesecake",
    "item.cheesecake.desc": "Creamy New York style slice",
    "btn.add": "Add +",
    "btn.added": "Added ✓",
    "btn.viewcart": "View Cart",
    "cart.items": "items",
    "cart.title": "Your Order",
    "cart.empty": "Your cart is empty.",
    "cart.total": "Total",
    "btn.confirm": "Confirm Order",
    "cart.each": "each",
    "alert.empty": "Your cart is empty.",
    "alert.confirmed": "Order confirmed!",
    currency: "Toman",
  },
};

let currentLang = localStorage.getItem("cafeLang") || "fa";

function t(key) {
  return (translations[currentLang] && translations[currentLang][key]) || key;
}

function formatPrice(amount) {
  return amount.toLocaleString("en-US") + " " + t("currency");
}

function applyLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  document.querySelectorAll(".menu-item").forEach(function (item) {
    const price = parseFloat(item.dataset.price);
    const priceEl = item.querySelector(".price");
    if (priceEl) priceEl.textContent = formatPrice(price);
  });
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  document.getElementById("langBtn").textContent = lang === "fa" ? "EN" : "FA";
  localStorage.setItem("cafeLang", lang);
  renderCartPanel();
}

document.addEventListener("DOMContentLoaded", function () {
  let cart = JSON.parse(localStorage.getItem("cafeCart")) || [];

  const cartCountEl = document.getElementById("cartCount");
  const cartTotalEl = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartPanel = document.getElementById("cartPanel");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartItemsEl = document.getElementById("cartItems");
  const cartPanelTotalEl = document.getElementById("cartPanelTotal");
  const confirmOrderBtn = document.getElementById("confirmOrderBtn");
  const langBtn = document.getElementById("langBtn");

  function saveCart() {
    localStorage.setItem("cafeCart", JSON.stringify(cart));
  }

  function getTotals() {
    const totalItems = cart.reduce(function (sum, i) {
      return sum + i.qty;
    }, 0);
    const totalPrice = cart.reduce(function (sum, i) {
      return sum + i.qty * i.price;
    }, 0);
    return { totalItems: totalItems, totalPrice: totalPrice };
  }

  function updateCartBar() {
    const total = getTotals();
    cartCountEl.innerHTML =
      total.totalItems +
      ' <span data-i18n="cart.items">' +
      t("cart.items") +
      "</span>";
    cartTotalEl.textContent = formatPrice(total.totalPrice);
  }

  window.renderCartPanel = function () {
    cartItemsEl.innerHTML = "";

    if (cart.length === 0) {
      const msg = document.createElement("p");
      msg.className = "empty-cart-msg";
      msg.id = "emptyCartMsg";
      msg.setAttribute("data-i18n", "cart.empty");
      msg.textContent = t("cart.empty");
      cartItemsEl.appendChild(msg);
    } else {
      cart.forEach(function (item, index) {
        const displayName = t("item." + item.id + ".name");
        const line = document.createElement("div");
        line.className = "cart-line";
        line.innerHTML =
          '<div class="cart-line-info">' +
          '<div class="cart-line-name">' +
          displayName +
          "</div>" +
          '<div class="cart-line-price">' +
          formatPrice(item.price) +
          " " +
          t("cart.each") +
          "</div>" +
          "</div>" +
          '<div class="cart-line-controls">' +
          '<button class="qty-btn minus-btn" data-index="' +
          index +
          '">-</button>' +
          '<span class="qty-value">' +
          item.qty +
          "</span>" +
          '<button class="qty-btn plus-btn" data-index="' +
          index +
          '">+</button>' +
          '<button class="remove-btn" data-index="' +
          index +
          '" title="Remove">&#128465;</button>' +
          "</div>";
        cartItemsEl.appendChild(line);
      });
    }

    const total = getTotals();
    cartPanelTotalEl.textContent = formatPrice(total.totalPrice);
    updateCartBar();
  };

  function openCart() {
    cartOverlay.classList.add("active");
    cartPanel.classList.add("open");
  }

  function closeCart() {
    cartOverlay.classList.remove("active");
    cartPanel.classList.remove("open");
  }

  document.querySelectorAll(".add-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const item = btn.closest(".menu-item");
      const id = item.dataset.id;
      const price = parseFloat(item.dataset.price);

      const existing = cart.find(function (i) {
        return i.id === id;
      });
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ id: id, price: price, qty: 1 });
      }

      btn.textContent = t("btn.added");
      btn.classList.add("added");
      setTimeout(function () {
        btn.textContent = t("btn.add");
        btn.classList.remove("added");
      }, 800);

      saveCart();
      renderCartPanel();
    });
  });

  cartItemsEl.addEventListener("click", function (e) {
    const target = e.target;
    const index = target.dataset.index;
    if (index === undefined) return;
    const idx = parseInt(index, 10);

    if (target.classList.contains("plus-btn")) {
      cart[idx].qty += 1;
    } else if (target.classList.contains("minus-btn")) {
      cart[idx].qty -= 1;
      if (cart[idx].qty <= 0) {
        cart.splice(idx, 1);
      }
    } else if (target.classList.contains("remove-btn")) {
      cart.splice(idx, 1);
    } else {
      return;
    }

    saveCart();
    renderCartPanel();
  });

  checkoutBtn.addEventListener("click", openCart);
  closeCartBtn.addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);

  confirmOrderBtn.addEventListener("click", function () {
    if (cart.length === 0) {
      alert(t("alert.empty"));
      return;
    }
    alert(t("alert.confirmed"));
  });

  langBtn.addEventListener("click", function () {
    applyLanguage(currentLang === "fa" ? "en" : "fa");
  });

  applyLanguage(currentLang);
  renderCartPanel();
});
