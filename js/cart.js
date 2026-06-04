// ─── Standalone Cart — works on any page ─────────────────────────

// Inject cart drawer only if not already in the page
if (!document.getElementById('cart-drawer')) {
    const drawer = document.createElement('div');
    drawer.innerHTML = `
        <div class="cart-overlay" id="cart-overlay" onclick="toggleCart()"></div>
        <div class="cart-drawer" id="cart-drawer">
            <div class="cart-header">
                <h3>Your Cart</h3>
                <button class="cart-close" onclick="toggleCart()"><i class="fas fa-times"></i></button>
            </div>
            <div class="cart-items" id="cart-items"></div>
            <div class="cart-footer" id="cart-footer"></div>
        </div>
    `;
    document.body.appendChild(drawer);
}

// Cart state from localStorage.

let cart = JSON.parse(localStorage.getItem('aura_cart') || '[]');
// Normalize any stored img paths (strip leading ../)
cart = cart.map(item => ({ ...item, img: item.img ? item.img.replace(/^\.\.\//, '') : item.img }));
saveCart();

function saveCart() {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
}

function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = total;
        el.style.display = total > 0 ? 'flex' : 'none';
    });
}

// Resolve correct path prefix based on where the page is loaded from
const _pathPrefix = (function() {
    const p = window.location.pathname;
    if (p.endsWith('/') || p.includes('index.html') || p.includes('404.html') ||
        p.split('/').filter(Boolean).length <= 1) {
        return '';
    }
    return '../';
})();

function _normalizeImg(img) {
    // Always store as root-relative (strip leading ../)
    return img.replace(/^\.\.\//, '');
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const footer = document.getElementById('cart-footer');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-basket"></i>
                <p>Your cart is empty</p>
                <span>Add some hampers to get started</span>
                <a href="${_pathPrefix}pages/hampers.html" class="btn btn-gold" style="margin-top:16px;">Browse Hampers</a>
            </div>`;
        footer.innerHTML = '';
        return;
    }

    const grandTotal = cart.reduce((sum, item) => {
        const num = parseFloat(item.price.replace(/[^0-9.]/g, '').replace(',', '')) || 0;
        return sum + num * item.qty;
    }, 0);
    const currency = cart[0].price.replace(/[\d,.\s]/g, '').trim() || 'MVR';

    container.innerHTML = cart.map(item => {
        // Fix image path: stored as 'img/hampers/...' (root-relative), prefix if in /pages/
        const imgSrc = _pathPrefix + item.img;
        return `
        <div class="cart-item" data-index="${item.index}">
            <img src="${imgSrc}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price}</div>
                <div class="cart-item-qty">
                    <button onclick="changeQty(${item.index}, -1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${item.index}, 1)">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.index})" title="Remove"><i class="fas fa-times"></i></button>
        </div>`;
    }).join('');

    footer.innerHTML = `
        <div class="cart-total">
            <span>Total</span>
            <span>${currency} ${grandTotal.toLocaleString()}</span>
        </div>
        <button class="btn btn-gold btn-lg" style="width:100%;justify-content:center;margin-top:14px;" onclick="cartCheckout()">
            <i class="fas fa-paper-plane"></i> Send Order Enquiry
        </button>
        <p style="text-align:center;margin-top:8px;font-size:0.75rem;color:var(--text-light);">We'll confirm your order via email</p>
    `;
}

function removeFromCart(index) {
    const el = document.querySelector(`.cart-item[data-index="${index}"]`);
    if (el) {
        el.classList.add('removing');
        setTimeout(() => {
            cart = cart.filter(item => item.index !== index);
            saveCart(); updateCartCount();
            // If cart now empty, fade in the empty state smoothly
            const container = document.getElementById('cart-items');
            const footer = document.getElementById('cart-footer');
            if (cart.length === 0) {
                container.style.overflow = 'hidden';
                container.style.opacity = '0';
                setTimeout(() => {
                    renderCart();
                    container.style.overflow = '';
                    container.style.transition = 'opacity 0.2s ease';
                    container.style.opacity = '1';
                    setTimeout(() => container.style.transition = '', 200);
                }, 50);
            } else {
                renderCart();
            }
        }, 280);
    } else {
        cart = cart.filter(item => item.index !== index);
        saveCart(); updateCartCount(); renderCart();
    }
}

function changeQty(index, delta) {
    const item = cart.find(item => item.index === index);
    if (!item) return;
    if (delta > 0 && item.stock !== undefined && item.qty >= item.stock) {
        if (typeof showWarningToast === 'function') {
            showWarningToast(`Only ${item.stock} of "${item.name}" available`);
        }
        return;
    }
    if (delta < 0 && item.qty <= 1) {
        removeFromCart(index);
        return;
    }
    item.qty += delta;
    saveCart(); updateCartCount();
    // Animate just the qty number
    const qtyEl = document.querySelector(`.cart-item[data-index="${index}"] .cart-item-qty span`);
    if (qtyEl) {
        qtyEl.textContent = item.qty;
        qtyEl.classList.remove('qty-pop');
        void qtyEl.offsetWidth; // reflow
        qtyEl.classList.add('qty-pop');
    } else {
        renderCart();
    }
}

function cartCheckout() {
    const lines = cart.map(item => `- ${item.name} x${item.qty} (${item.price})`).join('\n');
    const subject = encodeURIComponent('Order Enquiry — Aura Gifts');
    const body = encodeURIComponent(
        'Hi Aura Gifts,\n\nI would like to enquire about the following order:\n\n' + lines +
        '\n\nPlease let me know availability and payment details.\n\nThank you.'
    );
    window.location.href = 'mailto:aura.gifts.mv@gmail.com?subject=' + subject + '&body=' + body;
}

function openCart() {
    renderCart();
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
}

function closeCart() {
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('open');
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
}

function toggleCart() {
    const isOpen = document.getElementById('cart-drawer').classList.contains('open');
    isOpen ? closeCart() : openCart();
}

// Init
updateCartCount();

// Auto-open if redirected with #cart
if (window.location.hash === '#cart') {
    openCart();
    history.replaceState(null, '', window.location.pathname);
}

// Keyboard close
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCart();
});
