// Header scroll + scroll-to-top
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    const scrollTop = document.getElementById('scrollTop');
    if (window.scrollY > 60) {
        header.classList.add('scrolled');
        scrollTop.classList.add('visible');
    } else {
        header.classList.remove('scrolled');
        scrollTop.classList.remove('visible');
    }
});

// Hampers data. you can add hampers, remove,
// or update its data here
const hampers = [
    {
        name: 'hamper1',
        desc: 'i dont know',
        img: 'hampers/hamper1.jpeg',
        badge: '',
        stock: 5,
        price: 'MVR 500',
    },
    {
        name: 'hamper2',
        desc: 'i dont know',
        img: 'hampers/hamper2.jpeg',
        badge: 'Signature',
        stock: 3,
        price: 'MVR 800',
    },
    {
        name: 'hamper3',
        desc: 'i dont know',
        img: 'hampers/hamper3.jpeg',
        badge: null,
        stock: 8,
        price: 'MVR 600',
    },
    {
        name: 'hamper4',
        desc: 'i dont know',
        img: 'hampers/hamper4.jpeg',
        badge: 'Corporate',
        stock: 0,
        price: 'MVR 1,200',
    },
    {
        name: 'hamper5',
        desc: 'i dont know',
        img: 'hampers/hamper5.jpeg',
        badge: null,
        stock: 2,
        price: 'MVR 700',
    },
    {
        name: 'hamper6',
        desc: 'i dont know',
        img: 'hampers/hamper6.jpeg',
        badge: 'Custom',
        stock: 12,
        price: 'MVR 950',
    },
];

function hamperCardHTML(h, index) {
    const inStock = h.stock > 0;
    const stockLabel = h.stock === 0
        ? `<span class="stock-pill out">Out of Stock</span>`
        : h.stock <= 3
        ? `<span class="stock-pill low">Only ${h.stock} left</span>`
        : `<span class="stock-pill in">${h.stock} in stock</span>`;
    return `
    <div class="product-card ${!inStock ? 'out-of-stock' : ''}" onclick="${inStock ? `openModal(${index})` : ''}">
        <div class="product-img">
            <img src="${h.img}" alt="${h.name}" loading="lazy">
            ${h.badge ? `<span class="product-badge">${h.badge}</span>` : ''}
        </div>
        <div class="product-body">
            ${h.badge ? `<div class="product-tag">${h.badge}</div>` : ''}
            <div class="product-name">${h.name}</div>
            <div class="product-desc">${h.desc}</div>
        </div>
        <div class="product-footer">
            ${stockLabel}
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
                <span style="font-weight:700;font-size:1rem;color:var(--text-dark);">${h.price}</span>
                <button class="btn-add" ${!inStock ? 'disabled' : ''} onclick="event.stopPropagation(); ${inStock ? `addToCart(${index})` : ''}">
                    ${inStock ? 'Add to Cart' : 'Unavailable'}
                </button>
            </div>
        </div>
    </div>`;
}

function renderHampers() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = hampers.map((h, index) => hamperCardHTML(h, index)).join('');
}

renderHampers();

// Hamper search
document.getElementById('hamper-search').addEventListener('input', function () {
    const query = this.value.toLowerCase().trim();
    const grid = document.getElementById('products-grid');
    const filtered = query
        ? hampers.filter(h =>
            h.name.toLowerCase().includes(query) ||
            (h.badge && h.badge.toLowerCase().includes(query)) ||
            h.desc.toLowerCase().includes(query))
        : hampers;

    if (filtered.length === 0) {
        grid.innerHTML = `<p style="color:var(--text-light);font-size:0.95rem;padding:20px 0;">No hampers found for "<strong>${query}</strong>".</p>`;
        return;
    }
    grid.innerHTML = filtered.map(h => hamperCardHTML(h, hampers.indexOf(h))).join('');
});

// ─── Reviews ─────────────────────────────────────────────────────
// To add a review: copy one block and fill in the fields.
const reviews = [
    {
        name: 'Unknown',
        location: 'Maldives',
        rating: 5,
        text: 'recieved!! thank you so much!!! the boxes are beautiful! will definitely shop from you again💗💗',
        initial: 'U',
        color: '#b8a898',
    },
    {
        name: 'Unknown',
        location: 'Maldives',
        rating: 5,
        text: "hii, got the package, its pretty thnakyouu",
        initial: 'U',
        color: '#c8b8a8',
    },
    {
        name: 'Unknown',
        location: 'Maldives',
        rating: 5,
        text: 'Thankyou. Love the packaging🥰',
        initial: 'U',
        color: '#a89888',
    },
];

function renderReviews() {
    const grid = document.getElementById('reviews-grid');
    grid.innerHTML = reviews.map(r => `
        <div class="testimonial-card">
            <div class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
            <p class="testimonial-text">"${r.text}"</p>
            <div class="testimonial-author">
                <div class="author-avatar" style="background:${r.color};">${r.initial}</div>
                <div>
                    <div class="author-name">${r.name}</div>
                    <div class="author-loc">${r.location}</div>
                </div>
            </div>
        </div>
    `).join('');
}

renderReviews();

// Modal
let currentHamper = null;

function openModal(index) {
    currentHamper = hampers[index];
    if (!currentHamper) return;
    document.getElementById('modal-title').textContent = currentHamper.name;
    document.getElementById('modal-tag').textContent = currentHamper.desc;
    document.getElementById('modal-sender').value = '';
    document.getElementById('modal-recipient').value = '';
    document.getElementById('modal-message').value = '';
    document.getElementById('modal-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
    document.body.style.overflow = '';
}

function closeModalOnBg(e) {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
}

function handleEnquiry() {
    const name = document.getElementById('modal-sender').value.trim();
    const email = document.getElementById('modal-recipient').value.trim();
    if (!name || !email) {
        alert('Please fill in your name and email address.');
        return;
    }
    const subject = encodeURIComponent('Hamper Enquiry ' + currentHamper.name);
    const body = encodeURIComponent(
        'Hi Aura Gifts,\n\nI am interested in: ' + currentHamper.name +
        '\n\nName: ' + name +
        '\nEmail: ' + email +
        '\n\nMessage:\n' + document.getElementById('modal-message').value
    );
    window.location.href = 'mailto:aihamaliibrahim989@gmail.com?subject=' + subject + '&body=' + body;
    closeModal();
}

// Keyboard close modal
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeModal();
        closeCart();
    }
});

// ─── Cart ─────────────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('aura_cart') || '[]');

function saveCart() {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
}

function addToCart(index) {
    const h = hampers[index];
    const existing = cart.find(item => item.index === index);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ index, name: h.name, price: h.price, img: h.img, qty: 1 });
    }
    saveCart();
    updateCartCount();
    renderCart();
    openCart();
}

function removeFromCart(index) {
    cart = cart.filter(item => item.index !== index);
    saveCart();
    updateCartCount();
    renderCart();
}

function changeQty(index, delta) {
    const item = cart.find(item => item.index === index);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(index);
    else { saveCart(); updateCartCount(); renderCart(); }
}

function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count').textContent = total;
    document.getElementById('cart-count').style.display = total > 0 ? 'flex' : 'none';
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const footer = document.getElementById('cart-footer');

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-basket"></i>
                <p>Your cart is empty</p>
                <span>Add some hampers to get started</span>
                <a href="#products" class="btn btn-gold" style="margin-top:16px;" onclick="closeCart()">
                    Browse Hampers
                </a>
            </div>`;
        footer.innerHTML = '';
        return;
    }

    // Calculate total strip non-numeric chars from price
    const grandTotal = cart.reduce((sum, item) => {
        const num = parseFloat(item.price.replace(/[^0-9.]/g, '').replace(',', '')) || 0;
        return sum + num * item.qty;
    }, 0);
    const currency = cart[0].price.replace(/[\d,.\s]/g, '').trim() || 'MVR';

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
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
        </div>
    `).join('');

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

function cartCheckout() {
    const lines = cart.map(item => `- ${item.name} x${item.qty} (${item.price})`).join('\n');
    const subject = encodeURIComponent('Order Enquiry - Aura Gifts');
    const body = encodeURIComponent(
        'Hi Aura Gifts,\n\nI would like to enquire about the following order:\n\n' + lines +
        '\n\nPlease let me know availability and payment details.\n\nThank you.'
    );
    window.location.href = 'mailto:aihamaliibrahim989@gmail.com?subject=' + subject + '&body=' + body;
}

function openCart() {
    renderCart();
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('open');
    document.body.style.overflow = '';
}

function toggleCart() {
    const isOpen = document.getElementById('cart-drawer').classList.contains('open');
    isOpen ? closeCart() : openCart();
}

// Init cart count
updateCartCount();

// Auto-open cart if redirected from another page
if (window.location.hash === '#cart') {
    openCart();
    history.replaceState(null, '', window.location.pathname);
}
