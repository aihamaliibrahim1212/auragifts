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
        img: 'img/hampers/hamper1.jpeg',
        badge: '',
        stock: 5,
        price: 'MVR 500',
    },
    {
        name: 'hamper2',
        desc: 'i dont know',
        img: 'img/hampers/hamper2.jpeg',
        badge: 'Signature',
        stock: 3,
        price: 'MVR 800',
    },
    {
        name: 'hamper3',
        desc: 'i dont know',
        img: 'img/hampers/hamper3.jpeg',
        badge: null,
        stock: 8,
        price: 'MVR 600',
    },
    {
        name: 'hamper4',
        desc: 'i dont know',
        img: 'img/hampers/hamper4.jpeg',
        badge: 'Corporate',
        stock: 0,
        price: 'MVR 1,200',
    },
    {
        name: 'hamper5',
        desc: 'i dont know',
        img: 'img/hampers/hamper5.jpeg',
        badge: null,
        stock: 2,
        price: 'MVR 700',
    },
    {
        name: 'hamper6',
        desc: 'i dont know',
        img: 'img/hampers/hamper6.jpeg',
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

// Hamper search — autocomplete + redirect to search.html
(function initSearch() {
    const input = document.getElementById('hamper-search');
    if (!input) return;

    // Create dropdown directly in body so it's outside the header stacking context
    let dropdown = document.getElementById('search-dropdown');
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.id = 'search-dropdown';
        dropdown.className = 'search-dropdown';
        document.body.appendChild(dropdown);
    }

    function getMatches(query) {
        const words = query.toLowerCase().split(/\s+/).filter(Boolean);
        return hampers.filter(h => {
            const searchable = [h.name, h.badge || '', h.desc].join(' ').toLowerCase();
            return words.every(w => searchable.includes(w));
        });
    }

    function positionDropdown() {
        const rect = input.getBoundingClientRect();
        dropdown.style.top = (rect.bottom + 4) + 'px';
        dropdown.style.left = rect.left + 'px';
        dropdown.style.width = rect.width + 'px';
    }

    function showDropdown(query) {
        if (!query) { dropdown.innerHTML = ''; dropdown.classList.remove('open'); return; }
        const matches = getMatches(query);
        if (!matches.length) {
            dropdown.innerHTML = `<div class="search-dd-item search-dd-none">No results for "${query}"</div>`;
        } else {
            dropdown.innerHTML = matches.map(h => `
                <div class="search-dd-item" onclick="goSearch('${encodeURIComponent(h.name)}')">
                    <div>
                        <div class="search-dd-name">${h.name}</div>
                        ${h.badge ? `<div class="search-dd-badge">${h.badge}</div>` : ''}
                    </div>
                </div>
            `).join('');
            dropdown.innerHTML += `<div class="search-dd-item search-dd-all" onclick="goSearch('${encodeURIComponent(query)}')">
                <i class="fas fa-search"></i> See all results for "<strong>${query}</strong>"
            </div>`;
        }
        positionDropdown();
        dropdown.classList.add('open');
    }

    window.addEventListener('resize', () => {
        if (dropdown.classList.contains('open')) positionDropdown();
    });

    input.addEventListener('input', () => showDropdown(input.value.trim()));

    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            const q = input.value.trim();
            if (q) { dropdown.innerHTML = ''; dropdown.classList.remove('open'); goSearch(encodeURIComponent(q)); }
        }
        if (e.key === 'Escape') { dropdown.innerHTML = ''; dropdown.classList.remove('open'); }
    });

    document.addEventListener('click', e => {
        if (!input.closest('.header-search-wrap').contains(e.target)) {
            dropdown.innerHTML = ''; dropdown.classList.remove('open');
        }
    });
})();

function goSearch(encodedQuery) {
    window.location.href = 'pages/search.html?q=' + encodedQuery;
}

// ─── Reviews ─────────────────────────────────────────────────────
// To add a review: copy one block and fill in the fields.
const reviews = [
    {
        name: 'Unknown',
        location: 'Maldives',
        rating: 5,
        text: 'recieved!! thank you so much!!! the boxes are beautiful! will definitely shop from you again�,�,',
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
    window.location.href = 'mailto:aura.gifts.mv@gmail.com?subject=' + subject + '&body=' + body;
    closeModal();
}

// Keyboard close modal
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeModal();
        closeCart();
    }
});

// ─── addToCart ────────────────────────────────────────────────────
// Kept here because it needs access to the hampers array.
// saveCart, updateCartCount, renderCart, openCart all come from cart.js.
function addToCart(index) {
    const h = hampers[index];
    const existing = cart.find(item => item.index === index);
    const currentQty = existing ? existing.qty : 0;

    if (currentQty >= h.stock) {
        showWarningToast(`Only ${h.stock} of "${h.name}" available`);
        return;
    }

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ index, name: h.name, price: h.price, img: h.img, qty: 1, stock: h.stock });
    }
    saveCart();
    updateCartCount();
    renderCart();
    showCartToast(h.name);
}

function showCartToast(name) {
    _showToast(name + ' added to cart', 'check-circle', false);
}

function showWarningToast(msg) {
    _showToast(msg, 'exclamation-circle', true);
}

function _showToast(text, icon, isWarning) {
    const old = document.getElementById('cart-toast');
    if (old) old.remove();
    const toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.className = 'cart-toast' + (isWarning ? ' warning' : '');
    toast.innerHTML = `
        <div class="cart-toast-label">
            <i class="fas fa-${icon}"></i>
            <span>${text}</span>
        </div>
        <div class="cart-toast-bar-wrap">
            <div class="cart-toast-bar"></div>
        </div>
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 1800);
}