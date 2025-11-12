
const products = [
    { id: 1, name: 'iPhone 15 Pro', price: 999, img: 'https://via.placeholder.com/300x200?text=iPhone+15', desc: 'Latest Apple smartphone with A17 chip.', category: 'Mobile' },
    { id: 2, name: 'MacBook Air M2', price: 1299, img: 'https://via.placeholder.com/300x200?text=MacBook+Air', desc: 'Lightweight laptop with M2 processor.', category: 'Laptop' },
    { id: 3, name: 'Samsung Galaxy S24', price: 899, img: 'https://via.placeholder.com/300x200?text=Galaxy+S24', desc: 'Android flagship with AI features.', category: 'Mobile' },
    { id: 4, name: 'Dell XPS 13', price: 1099, img: 'https://via.placeholder.com/300x200?text=Dell+XPS', desc: 'Ultra-thin Windows laptop.', category: 'Laptop' },
    { id: 5, name: 'AirPods Pro 2', price: 249, img: 'https://via.placeholder.com/300x200?text=AirPods', desc: 'Noise-cancelling wireless earbuds.', category: 'Accessories' },
    { id: 6, name: 'Sony WH-1000XM5', price: 399, img: 'https://via.placeholder.com/300x200?text=Sony+Headphones', desc: 'Premium over-ear headphones.', category: 'Accessories' }
];

let cart = [];

// Load Products
function loadProducts(filter = '') {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    const filtered = products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()) || p.category.toLowerCase().includes(filter.toLowerCase()));
    filtered.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        col.innerHTML = `
            <div class="card product-card">
                <img src="${product.img}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.desc}</p>
                    <p class="price">$${product.price}</p>
                    <button class="btn btn-primary w-100" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `;
        grid.appendChild(col);
    });
}

// Add to Cart
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCart();
    alert(`${product.name} added to cart!`);
}

// Update Cart UI
function updateCart() {
    document.getElementById('cart-count').textContent = cart.reduce((sum, item) => sum + item.qty, 0);
    const items = document.getElementById('cart-items');
    items.innerHTML = cart.map(item => `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
                <h6>${item.name}</h6>
                <small>$${item.price} x ${item.qty}</small>
            </div>
            <div>
                <button class="btn btn-sm btn-outline-secondary" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    document.getElementById('cart-total').textContent = total;
}

// Remove from Cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Search
document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('search-input').value;
    loadProducts(query);
});

// Cart Modal
document.getElementById('cart-icon').addEventListener('click', () => {
    updateCart();
    new bootstrap.Modal(document.getElementById('cart-modal')).show();
});

// Checkout (Simple Alert - Real में Razorpay/Stripe ऐड करो)
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) return alert('Cart empty!');
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    alert(`Proceeding to checkout. Total: $${total}. (Integrate payment here)`);
    cart = []; // Clear cart
    updateCart();
});

// Contact Form
document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Message sent! Thanks for contacting us.');
    e.target.reset();
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});

// Init
loadProducts();