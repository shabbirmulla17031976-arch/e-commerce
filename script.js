/* =============================================
   TechHub Store - Complete JavaScript (script.js)
   Features: Products, Cart, Search, Gift Voucher
   ============================================= */

// ================ Fake Products Data ================
const products = [
    { id: 1, name: 'iPhone 15 Pro', price: 999, img: 'https://via.placeholder.com/300x200?text=iPhone+15', desc: 'Latest Apple flagship with A17 Pro chip.', category: 'Mobile' },
    { id: 2, name: 'MacBook Air M2', price: 1299, img: 'https://via.placeholder.com/300x200?text=MacBook+Air', desc: 'Ultra-light laptop with M2 processor.', category: 'Laptop' },
    { id: 3, name: 'Samsung Galaxy S24', price: 899, img: 'https://via.placeholder.com/300x200?text=Galaxy+S24', desc: 'Android with AI-powered camera.', category: 'Mobile' },
    { id: 4, name: 'Dell XPS 13', price: 1099, img: 'https://via.placeholder.com/300x200?text=Dell+XPS', desc: 'Premium Windows ultrabook.', category: 'Laptop' },
    { id: 5, name: 'AirPods Pro 2', price: 249, img: 'https://via.placeholder.com/300x200?text=AirPods+Pro', desc: 'Active noise cancellation earbuds.', category: 'Accessories' },
    { id: 6, name: 'Sony WH-1000XM5', price: 399, img: 'https://via.placeholder.com/300x200?text=Sony+Headphones', desc: 'Best-in-class over-ear headphones.', category: 'Accessories' }
];

let cart = [];

// ================ Load Products ================
function loadProducts(filter = '') {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(filter.toLowerCase()) || 
        p.category.toLowerCase().includes(filter.toLowerCase())
    );

    if (filtered.length === 0) {
        grid.innerHTML = '<p class="text-center col-12">No products found.</p>';
        return;
    }

    filtered.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        col.innerHTML = `
            <div class="card product-card h-100">
                <img src="${product.img}" class="card-img-top" alt="${product.name}" loading="lazy">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text flex-grow-1">${product.desc}</p>
                    <p class="price">$${product.price}</p>
                    <button class="btn btn-primary mt-auto" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(col);
    });
}

// ================ Cart Functions ================
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCart();
    showToast(`${product.name} added to cart!`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function updateCart() {
    // Update cart count
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count').textContent = count;

    // Update cart modal
    const itemsContainer = document.getElementById('cart-items');
    if (!itemsContainer) return;

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p class="text-center text-muted">Your cart is empty.</p>';
        document.getElementById('cart-total').textContent = '0';
        return;
    }

    itemsContainer.innerHTML = cart.map(item => `
        <div class="d-flex justify-content-between align-items-center mb-3 p-3 border rounded">
            <div class="flex-grow-1">
                <h6 class="mb-1">${item.name}</h6>
                <small class="text-muted">$${item.price} × ${item.qty}</small>
            </div>
            <div class="d-flex align-items-center">
                <span class="badge bg-primary me-3">$${item.price * item.qty}</span>
                <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    document.getElementById('cart-total').textContent = total.toFixed(2);
}

// ================ Search Functionality ================
document.getElementById('search-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('search-input').value.trim();
    loadProducts(query);
});

// ================ Cart Modal ================
document.getElementById('cart-icon')?.addEventListener('click', function(e) {
    e.preventDefault();
    updateCart();
    const modal = new bootstrap.Modal(document.getElementById('cart-modal'));
    modal.show();
});

document.getElementById('checkout-btn')?.addEventListener('click', function() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'warning');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    if (confirm(`Proceed to checkout? Total: $${total.toFixed(2)}`)) {
        showToast('Redirecting to payment gateway...', 'info');
        // Here you would integrate Razorpay/Stripe
        setTimeout(() => {
            alert('Payment integration would go here!');
            cart = [];
            updateCart();
            bootstrap.Modal.getInstance(document.getElementById('cart-modal')).hide();
        }, 1000);
    }
});

// ================ Contact Form ================
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    showToast('Thank you! Your message has been sent.', 'success');
    this.reset();
});

// ================ Gift Voucher Generator ================
// Luhn Algorithm for valid 16-digit card number
function generateCardNumber() {
    let num = '4' + Math.floor(Math.random() * 900000000000000) + Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    let sum = 0;
    for (let i = 0; i < num.length; i++) {
        let digit = parseInt(num[i]);
        if (i % 2 === 0) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return num + checkDigit;
}

function formatCardNumber(num) {
    return num.match(/.{1,4}/g).join(' ');
}

function generateExpiry() {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 3);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear().toString().slice(2);
    return `${month}/${year}`;
}

// Gift Voucher Form
document.getElementById('voucher-form')?.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('voucher-name').value.trim();
    const mobile = document.getElementById('voucher-mobile').value.trim();
    const currency = document.getElementById('voucher-currency').value;
    const amount = document.getElementById('voucher-amount').value;
    const pin = document.getElementById('voucher-pin').value;

    // Validation
    if (!name || !mobile || !amount || !pin) {
        showToast('Please fill all fields', 'danger');
        return;
    }
    if (pin.length !== 4 || isNaN(pin)) {
        showToast('PIN must be exactly 4 digits', 'danger');
        return;
    }
    if (amount < 100) {
        showToast('Minimum amount is $100', 'danger');
        return;
    }

    // Generate card details
    const cardNumber = generateCardNumber();
    const expiry = generateExpiry();
    const brand = currency === 'INR' ? 'RuPay' : 'VISA';
    const symbol = currency === 'INR' ? '₹' : '$';

    // Update card UI
    document.getElementById('card-number').textContent = formatCardNumber(cardNumber);
    document.getElementById('card-holder').textContent = name.toUpperCase();
    document.getElementById('card-expiry').textContent = expiry;
    document.getElementById('card-brand').textContent = brand;
    document.getElementById('card-cvv').textContent = pin;

    // Show result
    document.getElementById('voucher-result').classList.remove('d-none');

    // Save to localStorage (for demo)
    const voucher = { name, mobile, currency, amount, cardNumber, pin, expiry, brand, symbol };
    localStorage.setItem('techhub_gift_voucher', JSON.stringify(voucher));

    showToast(`Gift Voucher created for ${symbol}${amount}!`, 'success');
});

// Download Voucher as Image
document.getElementById('download-voucher')?.addEventListener('click', function() {
    const card = document.getElementById('voucher-card');
    const button = this;
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

    html2canvas(card, {
        scale: 3,
        backgroundColor: null,
        logging: false,
        useCORS: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `TechHub-Gift-Voucher-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-download"></i> Download as Image';
        showToast('Voucher downloaded!', 'success');
    }).catch(err => {
        console.error('Download failed:', err);
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-download"></i> Download as Image';
        showToast('Download failed. Try again.', 'danger');
    });
});

// Print Voucher
document.getElementById('print-voucher')?.addEventListener('click', function() {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    const cardHTML = document.getElementById('voucher-card').outerHTML;
    const voucher = JSON.parse(localStorage.getItem('techhub_gift_voucher') || '{}');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>TechHub Gift Voucher</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 20px; background: #f8f9fa; }
                .voucher-info { margin: 20px 0; padding: 15px; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
                .credit-card { margin: 30px auto; }
                @media print { body { background: white; } }
            </style>
        </head>
        <body>
            <h1>TechHub Gift Voucher</h1>
            <div class="voucher-info">
                <p><strong>Recipient:</strong> ${voucher.name || 'N/A'}</p>
                <p><strong>Amount:</strong> ${voucher.symbol || '$'}${voucher.amount || '0'}</p>
                <p><strong>PIN:</strong> ${voucher.pin || '****'}</p>
                <p><strong>Valid till:</strong> ${voucher.expiry || 'N/A'}</p>
                <p><em>Redeem at TechHub Store checkout. Contact: 7378646180</em></p>
            </div>
            ${cardHTML}
            <script>window.onload = function() { window.print(); setTimeout(() => window.close(), 1000); }</script>
        </body>
        </html>
    `);
    printWindow.document.close();
});

// ================ Toast Notification ================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'success' ? 'success' : type === 'danger' ? 'danger' : 'info'} alert-dismissible fade show position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);';
    toast.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        if (toast && toast.parentNode) {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
}

// ================ Smooth Scroll ================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ================ Page Load Initialization ================
document.addEventListener('DOMContentLoaded', function() {
    // Load products
    loadProducts();

    // Update cart from localStorage (if any)
    const savedCart = localStorage.getItem('techhub_cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCart();
        } catch (e) {
            console.error('Failed to load cart:', e);
        }
    }

    // Save cart on change
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('techhub_cart', JSON.stringify(cart));
    });

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// ================ Auto-save cart to localStorage ================
setInterval(() => {
    if (cart.length > 0) {
        localStorage.setItem('techhub_cart', JSON.stringify(cart));
    }
}, 5000);
