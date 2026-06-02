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

function renderHampers() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = hampers.map((h, index) => {
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
                    <button class="btn-add" ${!inStock ? 'disabled' : ''} onclick="event.stopPropagation(); ${inStock ? `openModal(${index})` : ''}">
                        ${inStock ? 'Enquire' : 'Unavailable'}
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');
}

renderHampers();

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
    window.location.href = 'mailto:aura.gifts.mv@gmail.com?subject=' + subject + '&body=' + body;
    closeModal();
}

// Keyboard close modal
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});
