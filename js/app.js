/**
 * GrownUp Organics - Main Application & State Controller
 */

// ==========================================
// STATE MANAGEMENT & LOCAL STORAGE
// ==========================================
window.cart = JSON.parse(localStorage.getItem('grownup_cart')) || [];
window.wishlist = JSON.parse(localStorage.getItem('grownup_wishlist')) || [];
window.orders = JSON.parse(localStorage.getItem('grownup_orders')) || [];

let activeCoupon = null; // Stores { code, discount }
let activeFilters = {
  category: '',
  brand: '',
  search: '',
  sort: 'default'
};
let activeSlideIndex = 0;
let activeProductQty = 1;
let activeQuickViewQty = 1;
let currentPaymentMethod = 'cod';

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

  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 2500);
}

// ==========================================
// CART OPERATIONS
// ==========================================
function saveCart() {
  localStorage.setItem('grownup_cart', JSON.stringify(window.cart));
  updateHeaderBadges();
  renderCartDrawer();
}

function addToCart(productId, quantity = 1, silent = false) {
  const product = getProductById(productId);
  if (!product) return;

  const existingItem = window.cart.find(item => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    window.cart.push({ productId, quantity });
  }

  saveCart();
  if (!silent) {
    showToast(`Added ${product.name} to cart!`);
    openCartDrawer();
  }
}

function removeFromCart(productId) {
  window.cart = window.cart.filter(item => item.productId !== productId);
  saveCart();
  showToast("Item removed from cart.", "info");
  
  // Re-render main cart view if user is on the cart page
  if (window.location.hash.startsWith('#cart')) {
    renderCurrentPage();
  }
}

function updateCartQty(productId, newQty) {
  if (newQty <= 0) {
    removeFromCart(productId);
    return;
  }

  const item = window.cart.find(item => item.productId === productId);
  if (item) {
    item.quantity = newQty;
    saveCart();
    
    // Re-render main cart view if user is on the cart page
    if (window.location.hash.startsWith('#cart')) {
      renderCurrentPage();
    }
  }
}

function getCartItemsDetails() {
  return window.cart.map(item => {
    const product = getProductById(item.productId);
    return {
      product,
      quantity: item.quantity
    };
  }).filter(item => item.product !== undefined);
}

function clearCart() {
  window.cart = [];
  saveCart();
}

// ==========================================
// WISHLIST OPERATIONS
// ==========================================
function saveWishlist() {
  localStorage.setItem('grownup_wishlist', JSON.stringify(window.wishlist));
  updateHeaderBadges();
}

function toggleWishlist(productId) {
  const index = window.wishlist.indexOf(productId);
  const product = getProductById(productId);
  if (!product) return;

  if (index > -1) {
    window.wishlist.splice(index, 1);
    showToast("Removed from wishlist.", "info");
  } else {
    window.wishlist.push(productId);
    showToast("Added to wishlist!");
  }
  
  saveWishlist();

  // Re-render if currently on wishlist page
  if (window.location.hash.startsWith('#wishlist')) {
    renderCurrentPage();
  }
}

// ==========================================
// HEADER UPDATE HELPERS
// ==========================================
function updateHeaderBadges() {
  const cartCountElem = document.getElementById('cart-count');
  const wishlistCountElem = document.getElementById('wishlist-count');
  
  if (cartCountElem) {
    const totalItems = window.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElem.textContent = totalItems;
  }
  if (wishlistCountElem) {
    wishlistCountElem.textContent = window.wishlist.length;
  }
}

// ==========================================
// CART DRAWER RENDER
// ==========================================
function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer-overlay');
  if (drawer) drawer.classList.add('active');
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer-overlay');
  if (drawer) drawer.classList.remove('active');
}

function renderCartDrawer() {
  const itemsList = document.getElementById('cart-drawer-items-list');
  const footerSummary = document.getElementById('cart-drawer-summary');
  
  if (!itemsList) return;

  const cartItems = getCartItemsDetails();
  
  if (cartItems.length === 0) {
    itemsList.innerHTML = `<p class="text-center text-muted" style="margin-top: 40px;">Your cart is empty.</p>`;
    if (footerSummary) footerSummary.style.display = 'none';
    return;
  }

  if (footerSummary) footerSummary.style.display = 'block';

  // Render list
  itemsList.innerHTML = cartItems.map(item => `
    <div class="cart-item-drawer">
      <div class="cart-item-img">
        <img src="${item.product.image}" alt="">
      </div>
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.product.name}</h4>
        <div class="cart-item-price-qty">
          <span>Qty: <strong>${item.quantity}</strong></span>
          <span class="cart-item-price">₹${(item.product.price * item.quantity).toFixed(2)}</span>
        </div>
      </div>
      <button class="btn-remove-item" onclick="removeFromCart(${item.product.id})" style="position:absolute; top:0; right:0;">×</button>
    </div>
  `).join('');

  // Calculate subtotals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountAmount = activeCoupon ? subtotal * activeCoupon.discount : 0;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal - discountAmount + shipping;

  document.getElementById('cart-subtotal').textContent = `₹${subtotal.toFixed(2)}`;
  document.getElementById('cart-shipping').textContent = shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`;
  document.getElementById('cart-total').textContent = `₹${total.toFixed(2)}`;
}

// ==========================================
// SLIDER FUNCTIONS
// ==========================================
let sliderInterval = null;

function startSliderAuto() {
  if (sliderInterval) clearInterval(sliderInterval);
  sliderInterval = setInterval(() => {
    const slides = document.querySelectorAll('.hero-slider .slide');
    const totalSlides = slides.length || 2;
    activeSlideIndex = (activeSlideIndex + 1) % totalSlides;
    updateSliderUI();
  }, 5000);
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
// FEATURED PRODUCTS TAB FILTER (HOME)
// ==========================================
function filterHomeProducts(category, element) {
  // Update active tab styling
  const buttons = document.querySelectorAll('.tabs-navigation .tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');

  const grid = document.getElementById('home-featured-grid');
  if (!grid) return;

  const filtered = getProductsByCategory(category).slice(0, 8);
  grid.innerHTML = filtered.map(p => renderProductCardHTML(p)).join('');
}

// ==========================================
// SHOP OPERATIONS
// ==========================================
function applyFilter(type, value) {
  if (type === 'category') {
    activeFilters.category = value;
  } else if (type === 'brand') {
    activeFilters.brand = value;
  }
  
  // Re-build routing with query parameters
  updateShopUrl();
}

function clearAllFilters() {
  activeFilters.category = '';
  activeFilters.brand = '';
  activeFilters.search = '';
  activeFilters.sort = 'default';
  
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';

  updateShopUrl();
}

function applySort(val) {
  activeFilters.sort = val;
  updateShopUrl();
}

function updateShopUrl() {
  let hash = '#shop';
  const params = [];
  if (activeFilters.category) params.push(`category=${activeFilters.category}`);
  if (activeFilters.brand) params.push(`brand=${activeFilters.brand}`);
  if (activeFilters.search) params.push(`search=${encodeURIComponent(activeFilters.search)}`);
  if (activeFilters.sort !== 'default') params.push(`sort=${activeFilters.sort}`);
  
  if (params.length > 0) {
    hash += '?' + params.join('&');
  }
  navigateTo(hash);
}

// ==========================================
// PRODUCT DETAIL ACTIONS
// ==========================================
function changeDetailQty(delta) {
  activeProductQty = Math.max(1, activeProductQty + delta);
  const qtyElem = document.getElementById('detail-qty-count');
  if (qtyElem) qtyElem.textContent = activeProductQty;
}

function setDetailImage(src, element) {
  const mainImg = document.getElementById('detail-main-image');
  if (mainImg) mainImg.src = src;

  const thumbs = document.querySelectorAll('.thumb-img-wrap');
  thumbs.forEach(t => t.classList.remove('active'));
  element.classList.add('active');
}

function addDetailToCart(productId) {
  addToCart(productId, activeProductQty);
  activeProductQty = 1;
  const qtyElem = document.getElementById('detail-qty-count');
  if (qtyElem) qtyElem.textContent = activeProductQty;
}

// ==========================================
// COUPON CHECKOUT OPERATIONS
// ==========================================
function applyCouponCode() {
  const codeElem = document.getElementById('coupon-input-code');
  const feedbackElem = document.getElementById('coupon-feedback');
  if (!codeElem || !feedbackElem) return;

  const code = codeElem.value.trim().toUpperCase();
  if (code === 'ORGANIC10') {
    activeCoupon = { code: 'ORGANIC10', discount: 0.1 };
    feedbackElem.style.color = 'var(--primary)';
    feedbackElem.textContent = 'Promo coupon 10% Discount Applied!';
    showToast("10% Coupon Applied!");
    renderCurrentPage();
  } else if (code === 'VILLAGE20') {
    activeCoupon = { code: 'VILLAGE20', discount: 0.2 };
    feedbackElem.style.color = 'var(--primary)';
    feedbackElem.textContent = 'Promo coupon 20% Discount Applied!';
    showToast("20% Coupon Applied!");
    renderCurrentPage();
  } else {
    activeCoupon = null;
    feedbackElem.style.color = 'var(--accent)';
    feedbackElem.textContent = 'Invalid promo coupon code.';
    showToast("Invalid Coupon.", "info");
    renderCurrentPage();
  }
}

function setPaymentMethod(method, element) {
  currentPaymentMethod = method;
  const items = document.querySelectorAll('.payment-method-item');
  items.forEach(item => item.classList.remove('active'));
  element.classList.add('active');
  
  const radio = element.querySelector('.payment-radio');
  if (radio) radio.checked = true;
}

function handlePlaceOrder(event) {
  event.preventDefault();
  
  const cartItems = getCartItemsDetails();
  if (cartItems.length === 0) {
    showToast("Your cart is empty.", "info");
    return;
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountAmount = activeCoupon ? subtotal * activeCoupon.discount : 0;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal - discountAmount + shipping;

  const fname = document.getElementById('bill-fname').value;
  const lname = document.getElementById('bill-lname').value;
  const address = document.getElementById('bill-address').value;
  const city = document.getElementById('bill-city').value;
  const pincode = document.getElementById('bill-pincode').value;
  const phone = document.getElementById('bill-phone').value;
  const email = document.getElementById('bill-email').value;

  // Create Mock Invoice
  const orderId = 'VO-' + Math.floor(10000000 + Math.random() * 90000000);
  const newOrder = {
    id: orderId,
    fname,
    lname,
    address,
    city,
    pincode,
    phone,
    email,
    paymentMode: currentPaymentMethod,
    items: cartItems,
    subtotal,
    discountAmount,
    shipping,
    total,
    date: new Date().toLocaleDateString('en-IN', { dateStyle: 'long' }),
    status: 'Processing'
  };

  // Add to local storage
  window.orders.push(newOrder);
  localStorage.setItem('grownup_orders', JSON.stringify(window.orders));

  clearCart();
  activeCoupon = null;
  showToast("Order placed successfully! Redirecting...");
  
  // Navigate to invoice/tracking screen
  setTimeout(() => {
    navigateTo(`#tracking?id=${orderId}&email=${encodeURIComponent(email)}`);
  }, 1500);
}

// ==========================================
// ORDER TRACKING SEARCH
// ==========================================
function handleTrackingSearch(event) {
  event.preventDefault();
  const emailVal = document.getElementById('track-page-email').value.trim();
  const idVal = document.getElementById('track-page-id').value.trim();
  const errorElem = document.getElementById('tracking-page-error');
  
  if (errorElem) errorElem.textContent = '';

  const matched = window.orders.find(o => o.id === idVal && (o.email.toLowerCase() === emailVal.toLowerCase() || o.phone === emailVal));
  
  if (matched) {
    navigateTo(`#tracking?id=${matched.id}&email=${encodeURIComponent(matched.email)}`);
  } else {
    if (errorElem) errorElem.textContent = 'Invoice ID or Email/Mobile mismatch. Please check details.';
  }
}

// Dialog tracking modal search
function initTrackingModal() {
  const form = document.getElementById('tracking-modal-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('tracking-email').value.trim();
    const id = document.getElementById('tracking-id').value.trim();
    
    const matched = window.orders.find(o => o.id === id && (o.email.toLowerCase() === email.toLowerCase() || o.phone === email));
    
    if (matched) {
      document.getElementById('tracking-modal-overlay').classList.remove('active');
      navigateTo(`#tracking?id=${matched.id}&email=${encodeURIComponent(matched.email)}`);
    } else {
      showToast("Order not found with provided credentials.", "info");
    }
  });
}

// ==========================================
// QUICK VIEW DIALOG ACTIONS
// ==========================================
let activeQuickViewProduct = null;

function openQuickView(productId) {
  const product = getProductById(productId);
  if (!product) return;

  activeQuickViewProduct = product;
  activeQuickViewQty = 1;

  const overlay = document.getElementById('quick-view-overlay');
  const mount = document.getElementById('quick-view-content-mount');

  if (overlay && mount) {
    mount.innerHTML = renderQuickViewHTML(product);
    overlay.classList.add('active');
  }
}

function closeQuickView() {
  const overlay = document.getElementById('quick-view-overlay');
  if (overlay) overlay.classList.remove('active');
  activeQuickViewProduct = null;
}

function changeQuickViewQty(delta) {
  activeQuickViewQty = Math.max(1, activeQuickViewQty + delta);
  const qtyElem = document.getElementById('quick-view-qty-count');
  if (qtyElem) qtyElem.textContent = activeQuickViewQty;
}

function addQuickViewToCart(productId) {
  addToCart(productId, activeQuickViewQty);
  closeQuickView();
}

// ==========================================
// OTHER FORM SUBMISSIONS
// ==========================================
function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('contact-name').value;
  const feedback = document.getElementById('contact-form-feedback');
  
  if (feedback) {
    feedback.textContent = `Thank you, ${name}! Your message has been received. We will contact you shortly.`;
    document.getElementById('contact-form-element').reset();
  }
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  showToast(`Welcome back, ${email}!`);
  navigateTo('#home');
}

// ==========================================
// CLIENT-SIDE ROUTER & PAGE NAVIGATOR
// ==========================================
function navigateTo(hash) {
  window.location.hash = hash;
}

function renderCurrentPage() {
  const hash = window.location.hash || '#home';
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  // Soft fade transition
  mainContent.style.opacity = 0;

  setTimeout(() => {
    // Parse Hash route and parameters
    const routeParts = hash.split('?');
    const path = routeParts[0];
    const queryStr = routeParts[1] || '';
    
    // Parse query params
    const queryParams = {};
    if (queryStr) {
      queryStr.split('&').forEach(pair => {
        const [k, v] = pair.split('=');
        queryParams[k] = decodeURIComponent(v || '');
      });
    }

    // Router matching
    let html = '';
    let activeRouteTag = '';

    // Route: Product Detail page
    if (path.startsWith('#product/')) {
      const productId = parseInt(path.split('/')[1]);
      const product = getProductById(productId);
      html = renderProductDetailHTML(product);
      activeRouteTag = 'shop';
    } 
    // Route: Shop page
    else if (path === '#shop') {
      activeFilters.category = queryParams.category || '';
      activeFilters.brand = queryParams.brand || '';
      activeFilters.search = queryParams.search || '';
      activeFilters.sort = queryParams.sort || 'default';

      // Apply filtering logic
      let list = searchProducts(activeFilters.search, activeFilters.category);
      if (activeFilters.brand) {
        list = list.filter(p => p.brand === activeFilters.brand);
      }

      // Apply sorting
      if (activeFilters.sort === 'price-low') {
        list.sort((a, b) => a.price - b.price);
      } else if (activeFilters.sort === 'price-high') {
        list.sort((a, b) => b.price - a.price);
      } else if (activeFilters.sort === 'name-asc') {
        list.sort((a, b) => a.name.localeCompare(b.name));
      }

      html = renderShopHTML(list, activeFilters.category, activeFilters.brand, activeFilters.sort);
      activeRouteTag = 'shop';
    } 
    // Route: Cart
    else if (path === '#cart') {
      html = renderCartHTML(getCartItemsDetails(), activeCoupon ? activeCoupon.discount : 0);
    } 
    // Route: Wishlist
    else if (path === '#wishlist') {
      const list = window.wishlist.map(id => getProductById(id)).filter(p => p !== undefined);
      html = renderWishlistHTML(list);
    } 
    // Route: Checkout
    else if (path === '#checkout') {
      html = renderCheckoutHTML(getCartItemsDetails(), activeCoupon ? activeCoupon.discount : 0);
    } 
    // Route: Order Tracking
    else if (path === '#tracking') {
      const orderId = queryParams.id;
      const email = queryParams.email;
      let matchedOrder = null;
      if (orderId && email) {
        matchedOrder = window.orders.find(o => o.id === orderId && o.email.toLowerCase() === email.toLowerCase());
      }
      html = renderOrderTrackingHTML(matchedOrder);
    } 
    // Route: About Us
    else if (path === '#about') {
      html = renderAboutHTML();
      activeRouteTag = 'about';
    } 
    // Route: Contact Us
    else if (path === '#contact') {
      html = renderContactHTML();
      activeRouteTag = 'contact';
    } 
    // Route: Login
    else if (path === '#login') {
      html = renderLoginHTML();
    }
    // Default Route: Home
    else {
      html = renderHomeHTML();
      activeRouteTag = 'home';
    }

    // Mount HTML
    mainContent.innerHTML = html;
    
    // Smooth fade in
    mainContent.style.opacity = 1;

    // Update active state on main navbar items
    const navItems = document.querySelectorAll('.nav-links .nav-link-item');
    navItems.forEach(item => {
      if (item.getAttribute('data-route') === activeRouteTag) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Custom slider activation if Home is rendered
    if (path === '#home' || path === '') {
      startSliderAuto();
    } else {
      if (sliderInterval) clearInterval(sliderInterval);
    }
    
    // Scroll window back to top
    window.scrollTo(0, 0);

  }, 150);
}

// ==========================================
// EVENT LISTENERS & INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Listen for hash routing
  window.addEventListener('hashchange', renderCurrentPage);
  window.addEventListener('load', renderCurrentPage);

  // Initialize badges and cart drawer contents
  updateHeaderBadges();
  renderCartDrawer();
  
  // Set up global search form handler
  const globalSearch = document.getElementById('global-search-form');
  if (globalSearch) {
    globalSearch.addEventListener('submit', (e) => {
      e.preventDefault();
      const catSelect = document.getElementById('search-category');
      const input = document.getElementById('search-input');
      
      activeFilters.category = catSelect ? catSelect.value : '';
      activeFilters.search = input ? input.value.trim() : '';
      
      updateShopUrl();
    });
  }

  // Setup click listeners for Cart Drawer
  const cartTrigger = document.getElementById('cart-trigger');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const drawerOverlay = document.getElementById('cart-drawer-overlay');

  if (cartTrigger) {
    cartTrigger.addEventListener('click', () => {
      renderCartDrawer();
      openCartDrawer();
    });
  }
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCartDrawer);
  }
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', (e) => {
      if (e.target === drawerOverlay) closeCartDrawer();
    });
  }

  // Setup Tracking Modal buttons
  const openTrackBtn = document.getElementById('open-tracking-btn');
  const trackingOverlay = document.getElementById('tracking-modal-overlay');
  const closeTrackBtn = document.getElementById('close-tracking-modal');

  if (openTrackBtn) {
    openTrackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (trackingOverlay) trackingOverlay.classList.add('active');
    });
  }
  if (closeTrackBtn) {
    closeTrackBtn.addEventListener('click', () => {
      if (trackingOverlay) trackingOverlay.classList.remove('active');
    });
  }
  if (trackingOverlay) {
    trackingOverlay.addEventListener('click', (e) => {
      if (e.target === trackingOverlay) trackingOverlay.classList.remove('active');
    });
  }
  initTrackingModal();

  // Setup Quick View Modal close
  const quickViewOverlay = document.getElementById('quick-view-overlay');
  const closeQuickViewBtn = document.getElementById('close-quick-view');

  if (closeQuickViewBtn) {
    closeQuickViewBtn.addEventListener('click', closeQuickView);
  }
  if (quickViewOverlay) {
    quickViewOverlay.addEventListener('click', (e) => {
      if (e.target === quickViewOverlay) closeQuickView();
    });
  }
});
