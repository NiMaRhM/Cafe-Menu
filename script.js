document.addEventListener('DOMContentLoaded', function () {
  let cart = JSON.parse(localStorage.getItem('cafeCart')) || [];

  const cartCountEl = document.getElementById('cartCount');
  const cartTotalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartPanel = document.getElementById('cartPanel');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsEl = document.getElementById('cartItems');
  const emptyCartMsg = document.getElementById('emptyCartMsg');
  const cartPanelTotalEl = document.getElementById('cartPanelTotal');
  const confirmOrderBtn = document.getElementById('confirmOrderBtn');

  function saveCart() {
    localStorage.setItem('cafeCart', JSON.stringify(cart));
  }

  function getTotals() {
    const totalItems = cart.reduce(function (sum, i) { return sum + i.qty; }, 0);
    const totalPrice = cart.reduce(function (sum, i) { return sum + i.qty * i.price; }, 0);
    return { totalItems: totalItems, totalPrice: totalPrice };
  }

  function updateCartBar() {
    const t = getTotals();
    cartCountEl.textContent = t.totalItems + ' آیتم' + (t.totalItems !== 1 ? '' : '');
    cartTotalEl.textContent = '€' + t.totalPrice.toFixed(2);
  }

  function renderCartPanel() {
    cartItemsEl.innerHTML = '';

    if (cart.length === 0) {
      cartItemsEl.appendChild(emptyCartMsg);
      emptyCartMsg.style.display = 'block';
    } else {
      cart.forEach(function (item, index) {
        const line = document.createElement('div');
        line.className = 'cart-line';
        line.innerHTML =
          '<div class="cart-line-info">' +
            '<div class="cart-line-name">' + item.name + '</div>' +
            '<div class="cart-line-price">€' + item.price.toFixed(2) + '</div>' +
          '</div>' +
          '<div class="cart-line-controls">' +
            '<button class="qty-btn minus-btn" data-index="' + index + '">-</button>' +
            '<span class="qty-value">' + item.qty + '</span>' +
            '<button class="qty-btn plus-btn" data-index="' + index + '">+</button>' +
            '<button class="remove-btn" data-index="' + index + '" title="Remove">&#128465;</button>' +
          '</div>';
        cartItemsEl.appendChild(line);
      });
    }

    const t = getTotals();
    cartPanelTotalEl.textContent = '€' + t.totalPrice.toFixed(2);
    updateCartBar();
  }

  function openCart() {
    cartOverlay.classList.add('active');
    cartPanel.classList.add('open');
  }

  function closeCart() {
    cartOverlay.classList.remove('active');
    cartPanel.classList.remove('open');
  }

  document.querySelectorAll('.add-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.menu-item');
      const name = item.dataset.name;
      const price = parseFloat(item.dataset.price);

      const existing = cart.find(function (i) { return i.name === name; });
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name: name, price: price, qty: 1 });
      }

      btn.textContent = 'Added ✓';
      btn.classList.add('added');
      setTimeout(function () {
        btn.textContent = 'Add +';
        btn.classList.remove('added');
      }, 800);

      saveCart();
      renderCartPanel();
    });
  });

  cartItemsEl.addEventListener('click', function (e) {
    const target = e.target;
    const index = target.dataset.index;
    if (index === undefined) return;
    const idx = parseInt(index, 10);

    if (target.classList.contains('plus-btn')) {
      cart[idx].qty += 1;
    } else if (target.classList.contains('minus-btn')) {
      cart[idx].qty -= 1;
      if (cart[idx].qty <= 0) {
        cart.splice(idx, 1);
      }
    } else if (target.classList.contains('remove-btn')) {
      cart.splice(idx, 1);
    } else {
      return;
    }

    saveCart();
    renderCartPanel();
  });

  checkoutBtn.addEventListener('click', openCart);
  closeCartBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  confirmOrderBtn.addEventListener('click', function () {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    // Full order page will be linked here later, e.g. window.location.href = 'order.html';
    alert('Order confirmed! (Full order page coming soon)');
  });

  renderCartPanel();
});