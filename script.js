document.addEventListener('DOMContentLoaded', function () {
  let cart = [];
  const cartCountEl = document.getElementById('cartCount');
  const cartTotalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  function updateCartBar() {
    const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
    const totalPrice = cart.reduce((sum, i) => sum + i.qty * i.price, 0);
    cartCountEl.textContent = totalItems + ' item' + (totalItems !== 1 ? 's' : '');
    cartTotalEl.textContent = '€' + totalPrice.toFixed(2);
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

      updateCartBar();
      localStorage.setItem('cafeCart', JSON.stringify(cart));
    });
  });

  checkoutBtn.addEventListener('click', function () {
    // Order page will be linked here later, e.g. window.location.href = 'order.html';
    alert('Order page coming soon! Cart saved: ' + JSON.stringify(cart));
  });

  updateCartBar();
});