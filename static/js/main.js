/**
 * GrownUp Organics - Clientside Application Logic
 */

// ==========================================
// STATE & STORAGE
// ==========================================
window.wishlist = JSON.parse(localStorage.getItem('grownup_wishlist')) || [];
let activeSlideIndex = 0;
let sliderInterval = null;
let currentQuickViewId = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateWishlistBadges();
    refreshCartDrawer();
    setupEventListeners();
    startSliderAuto();
});

// ==========================================
// EVENT LISTENERS Setup
// ==========================================
function setupEventListeners() {
    // Cart drawer triggers
    const cartTrigger = document.getElementById('cart-trigger');
    const closeCartBtn = document.getElementById('close-cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');

    if (cartTrigger) {
        cartTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            openCartDrawer();
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            closeCartDrawer();
        });
    }

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeCartDrawer();
            }
        });
    }

    // Quickview modal triggers
    const quickviewModal = document.getElementById('quick-view-modal');
    if (quickviewModal) {
        quickviewModal.addEventListener('click', (e) => {
            if (e.target === quickviewModal || e.target.classList.contains('modal-close')) {
                closeQuickView();
            }
        });
    }

    // Tracking redirect helper
    const openTrackingBtn = document.getElementById('open-tracking-btn');
    if (openTrackingBtn) {
        openTrackingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/tracking/';
        });
    }

    // Global Search Category Syncer
    const globalSearch = document.getElementById('global-search-form');
    if (globalSearch) {
        globalSearch.addEventListener('submit', (e) => {
            e.preventDefault();
            const cat = document.getElementById('search-category').value;
            const query = document.getElementById('search-input').value.trim();
            let url = '/shop/?';
            if (cat) url += `category=${cat}&`;
            if (query) url += `search=${encodeURIComponent(query)}`;
            window.location.href = url;
        });
    }
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✓' : 'ℹ'}</span>
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('removing');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 2500);
}

// ==========================================
// CART OPERATIONS (AJAX)
// ==========================================
function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer-overlay');
    if (drawer) {
        drawer.classList.add('active');
        refreshCartDrawer();
    }
}

function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer-overlay');
    if (drawer) drawer.classList.remove('active');
}

function refreshCartDrawer() {
    fetch('/api/cart/drawer-items/')
        .then(res => res.json())
        .then(data => {
            // Update Header Cart Count Badge
            const cartCountElem = document.getElementById('cart-count');
            if (cartCountElem) {
                cartCountElem.textContent = data.cart_count;
            }

            // Populate Cart Drawer list
            const itemsList = document.getElementById('cart-drawer-items-list');
            const summaryBlock = document.getElementById('cart-drawer-summary');
            
            if (!itemsList) return;

            if (data.items.length === 0) {
                itemsList.innerHTML = `<p class="text-center text-muted" style="margin-top: 40px;">Your cart is empty.</p>`;
                if (summaryBlock) summaryBlock.style.display = 'none';
                return;
            }

            if (summaryBlock) summaryBlock.style.display = 'block';

            itemsList.innerHTML = data.items.map(item => `
                <div class="cart-item-drawer" style="position:relative;">
                    <div class="cart-item-img">
                        <img src="/static/${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <div class="cart-item-price-qty">
                            <span>Qty: <strong>${item.quantity}</strong></span>
                            <span class="cart-item-price">₹${item.total_price.toFixed(2)}</span>
                        </div>
                    </div>
                    <button class="btn-remove-item" onclick="removeFromCart(${item.id})" style="position:absolute; top:0; right:0; border:none; background:none; font-size:1.2rem; cursor:pointer;">×</button>
                </div>
            `).join('');

            // Update Drawer totals
            document.getElementById('cart-subtotal').textContent = `₹${data.subtotal.toFixed(2)}`;
            
            const shippingElem = document.getElementById('cart-shipping');
            shippingElem.textContent = data.shipping === 0 ? 'FREE' : `₹${data.shipping.toFixed(2)}`;
            
            const discountElem = document.getElementById('cart-discount-row');
            if (data.discount > 0) {
                if (discountElem) discountElem.style.display = 'flex';
                document.getElementById('cart-discount').textContent = `-₹${data.discount.toFixed(2)}`;
            } else {
                if (discountElem) discountElem.style.display = 'none';
            }

            document.getElementById('cart-total').textContent = `₹${data.total.toFixed(2)}`;
        });
}

function addToCart(productId, quantity = 1, silent = false) {
    fetch(`/api/cart/add/${productId}/?quantity=${quantity}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                if (!silent) {
                    showToast(data.message);
                    openCartDrawer();
                } else {
                    refreshCartDrawer();
                }
            }
        });
}

function removeFromCart(productId) {
    fetch(`/api/cart/remove/${productId}/`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showToast(data.message, 'info');
                refreshCartDrawer();
                // If on cart page, reload
                if (window.location.pathname === '/cart/') {
                    window.location.reload();
                }
            }
        });
}

function updateCartQty(productId, newQty) {
    if (newQty <= 0) {
        removeFromCart(productId);
        return;
    }
    fetch(`/api/cart/update/${productId}/?quantity=${newQty}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                refreshCartDrawer();
                // If on cart page, reload
                if (window.location.pathname === '/cart/') {
                    window.location.reload();
                }
            }
        });
}

// ==========================================
// WISHLIST OPERATIONS (localStorage-based)
// ==========================================
function toggleWishlist(productId) {
    const index = window.wishlist.indexOf(productId);
    if (index > -1) {
        window.wishlist.splice(index, 1);
        showToast("Removed from wishlist.", "info");
    } else {
        window.wishlist.push(productId);
        showToast("Added to wishlist!");
    }
    localStorage.setItem('grownup_wishlist', JSON.stringify(window.wishlist));
    updateWishlistBadges();
    
    // Update hearts on page
    const buttons = document.querySelectorAll(`.product-wishlist-btn[data-id="${productId}"]`);
    buttons.forEach(btn => {
        btn.classList.toggle('active');
        const svg = btn.querySelector('svg');
        if (svg) {
            svg.setAttribute('fill', window.wishlist.includes(productId) ? 'currentColor' : 'none');
        }
    });

    // If on wishlist page, reload
    if (window.location.pathname === '/wishlist/') {
        window.location.reload();
    }
}

function updateWishlistBadges() {
    const wishlistCountElem = document.getElementById('wishlist-count');
    if (wishlistCountElem) {
        wishlistCountElem.textContent = window.wishlist.length;
    }
}

// ==========================================
// PRODUCT QUICK VIEW (AJAX)
// ==========================================
function openQuickView(productId) {
    fetch(`/api/product/quickview/${productId}/`)
        .then(res => res.json())
        .then(data => {
            currentQuickViewId = data.id;
            
            document.getElementById('quickview-category').textContent = data.categoryName;
            document.getElementById('quickview-name').textContent = data.name;
            document.getElementById('quickview-price').textContent = `₹${data.price.toFixed(2)}`;
            
            const oldPriceElem = document.getElementById('quickview-old-price');
            if (data.oldPrice) {
                oldPriceElem.textContent = `₹${data.oldPrice.toFixed(2)}`;
                oldPriceElem.style.display = 'inline';
            } else {
                oldPriceElem.style.display = 'none';
            }

            document.getElementById('quickview-image').src = `/static/${data.image}`;
            document.getElementById('quickview-desc').textContent = data.description;
            
            // Render Stars
            const starsContainer = document.getElementById('quickview-stars');
            const fullStars = Math.floor(data.rating);
            const halfStar = data.rating % 1 >= 0.5 ? 1 : 0;
            let starsHTML = '';
            for (let i = 0; i < fullStars; i++) starsHTML += '★';
            if (halfStar) starsHTML += '☆';
            for (let i = 0; i < (5 - fullStars - halfStar); i++) starsHTML += '☆';
            starsContainer.textContent = starsHTML;
            document.getElementById('quickview-reviews').textContent = `(${data.reviews} customer reviews)`;

            // Render Specs Table
            const specsBody = document.getElementById('quickview-specs-body');
            specsBody.innerHTML = '';
            for (const [key, value] of Object.entries(data.specs)) {
                specsBody.innerHTML += `
                    <tr>
                        <td style="font-weight: 600; padding: 6px 12px; border-bottom: 1px solid #eee;">${key}</td>
                        <td style="padding: 6px 12px; border-bottom: 1px solid #eee; color: #555;">${value}</td>
                    </tr>
                `;
            }

            // Reset quantity selector
            document.getElementById('quickview-qty').value = 1;

            // Show Modal
            document.getElementById('quick-view-modal').classList.add('active');
        });
}

function closeQuickView() {
    const modal = document.getElementById('quick-view-modal');
    if (modal) modal.classList.remove('active');
    currentQuickViewId = null;
}

function addQuickViewToCart() {
    if (!currentQuickViewId) return;
    const qty = parseInt(document.getElementById('quickview-qty').value) || 1;
    addToCart(currentQuickViewId, qty);
    closeQuickView();
}

// ==========================================
// HOME HERO SLIDER
// ==========================================
function startSliderAuto() {
    if (sliderInterval) clearInterval(sliderInterval);
    sliderInterval = setInterval(() => {
        const slides = document.querySelectorAll('.hero-slider .slide');
        const totalSlides = slides.length || 2;
        activeSlideIndex = (activeSlideIndex + 1) % totalSlides;
        updateSliderUI();
    }, 6000);
}

function setSlide(index) {
    activeSlideIndex = index;
    updateSliderUI();
    startSliderAuto();
}

function updateSliderUI() {
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dots = document.querySelectorAll('.hero-slider .dot');
    
    slides.forEach((slide, idx) => {
        if (idx === activeSlideIndex) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });

    dots.forEach((dot, idx) => {
        if (idx === activeSlideIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// ==========================================
// TAB FILTER FOR HOME FEATURED
// ==========================================
function filterHomeProducts(category, element) {
    // Toggle active tab class
    const tabs = document.querySelectorAll('.tabs-navigation .tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));
    element.classList.add('active');

    // Show/hide grid rows or items
    const cards = document.querySelectorAll('#home-featured-grid .product-card');
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ==========================================
// COUPON FORM OPERATIONS (AJAX)
// ==========================================
function applyCouponCode() {
    const couponInput = document.getElementById('coupon-input');
    if (!couponInput) return;
    const code = couponInput.value.trim();
    if (!code) {
        showToast('Please enter a coupon code.', 'info');
        return;
    }

    fetch('/api/cart/apply-coupon/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coupon_code: code })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showToast(data.message);
            window.location.reload(); // Reload to show updated order summary on cart/checkout pages
        } else {
            showToast(data.message, 'info');
        }
    });
}

function removeCouponCode() {
    fetch('/api/cart/remove-coupon/', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showToast(data.message);
            window.location.reload();
        }
    });
}
