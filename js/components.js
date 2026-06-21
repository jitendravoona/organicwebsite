/**
 * GrownUp Organics - UI Components Templates
 */

// Helper to render rating stars
function renderStarsHTML(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  let html = '';
  for (let i = 0; i < fullStars; i++) html += '★';
  if (halfStar) html += '☆'; // Custom styling is handled in CSS, let's just use filled star symbols
  for (let i = 0; i < emptyStars; i++) html += '☆';
  return html;
}

// Render individual Product Card
function renderProductCardHTML(product, isWishlist = false) {
  const isInWishlist = window.wishlist && window.wishlist.includes(product.id);
  const discountPercent = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : 0;

  return `
    <article class="product-card" data-id="${product.id}">
      ${product.badge ? `<span class="product-badge sale">${product.badge}</span>` : ''}
      ${!product.badge && discountPercent > 0 ? `<span class="product-badge sale">${discountPercent}% OFF</span>` : ''}
      
      <button class="product-wishlist-btn ${isInWishlist ? 'active' : ''}" 
              onclick="event.stopPropagation(); toggleWishlist(${product.id})" 
              aria-label="Toggle Wishlist">
        <svg width="18" height="18" fill="${isInWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
      </button>

      <div class="product-image-container" onclick="navigateTo('#product/${product.id}')">
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?q=80&w=400'">
      </div>

      <div class="product-info">
        <span class="product-card-category">${product.categoryName}</span>
        <h3 class="product-card-title" onclick="navigateTo('#product/${product.id}')">${product.name}</h3>
        
        <div class="product-rating-wrap">
          <span class="stars">${renderStarsHTML(product.rating)}</span>
          <span class="rating-count">(${product.reviews})</span>
        </div>

        <div class="product-card-footer">
          <div class="product-price-block">
            <span class="product-price-current">₹${product.price.toFixed(2)}</span>
            ${product.oldPrice ? `<span class="product-price-old">₹${product.oldPrice.toFixed(2)}</span>` : ''}
          </div>
          <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${product.id}, 1)">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21a1 1 0 1 0 0 2 1 1 0 1 0 0-2z"></path><path d="M20 21a1 1 0 1 0 0 2 1 1 0 1 0 0-2z"></path><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            Add
          </button>
        </div>
      </div>
    </article>
  `;
}

// 1. HOME VIEW RENDERER
function renderHomeHTML() {
  // Let's filter some featured products (e.g. first 8 products)
  const featuredProducts = PRODUCTS.slice(0, 8);
  
  return `
    <!-- Hero Slider -->
    <section class="hero-slider" id="hero-slider-container">
      <div class="slide active" style="background-image: url('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1200')">
        <div class="slide-overlay"></div>
        <div class="slide-content">
          <span class="slide-tag">100% Cold Pressed</span>
          <h2 class="slide-title serif-font">Pure Wood Pressed Oils</h2>
          <p class="slide-desc">Retain natural aroma, vitamins, and health benefits with our cold pressed oils. Sourced from organic seeds.</p>
          <a href="#shop?category=cold-pressed-oils" class="btn-shop-now">Shop Oils Now</a>
        </div>
      </div>
      <div class="slide" style="background-image: url('https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=1200')">
        <div class="slide-overlay"></div>
        <div class="slide-content">
          <span class="slide-tag">Heritage Spices</span>
          <h2 class="slide-title serif-font">Authentic Hand-ground Spices</h2>
          <p class="slide-desc">Freshly blended spices following heritage recipes, dry roasted and ground to perfection.</p>
          <a href="#shop?category=spices" class="btn-shop-now">Browse Spices</a>
        </div>
      </div>
      <div class="slide" style="background-image: url('https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=1200')">
        <div class="slide-overlay"></div>
        <div class="slide-content">
          <span class="slide-tag">Ancient Superfoods</span>
          <h2 class="slide-title serif-font">Nutritious Organic Millets</h2>
          <p class="slide-desc">100% Gluten-free superfoods packed with dietary fiber, iron, calcium, and minerals. Perfect healthy alternative to white rice.</p>
          <a href="#shop?category=millets" class="btn-shop-now">Browse Millets</a>
        </div>
      </div>
      
      <div class="slider-dots">
        <span class="dot active" onclick="setSlide(0)"></span>
        <span class="dot" onclick="setSlide(1)"></span>
        <span class="dot" onclick="setSlide(2)"></span>
      </div>
    </section>

    <!-- Categories Circular Grid -->
    <section class="section-padding">
      <div class="section-header">
        <div class="section-title-wrap">
          <h2 class="serif-font">Shop By Categories</h2>
        </div>
      </div>
      <div class="grid grid-cols-3">
        <div class="category-card" onclick="navigateTo('#shop?category=cold-pressed-oils')">
          <div class="category-image-wrap">
            <img src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=200" alt="Oils" onerror="this.src='images/placeholder_category.jpg'">
          </div>
          <h3 class="category-name">Cold Pressed Oils</h3>
          <span class="category-count">6 Items</span>
        </div>
        <div class="category-card" onclick="navigateTo('#shop?category=spices')">
          <div class="category-image-wrap">
            <img src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=200" alt="Spices" onerror="this.src='images/placeholder_category.jpg'">
          </div>
          <h3 class="category-name">Organic Spices</h3>
          <span class="category-count">13 Items</span>
        </div>
        <div class="category-card" onclick="navigateTo('#shop?category=millets')">
          <div class="category-image-wrap">
            <img src="https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=200" alt="Millets" onerror="this.src='images/placeholder_category.jpg'">
          </div>
          <h3 class="category-name">Organic Millets</h3>
          <span class="category-count">8 Items</span>
        </div>
      </div>
    </section>

    <!-- Millets Showcase Section -->
    <section class="section-padding" style="background: #fdfcf9; border-top: 1px solid #eee; border-bottom: 1px solid #eee; margin-top: 20px; padding: 50px 0;">
      <div class="container">
        <div style="text-align: center; max-width: 700px; margin: 0 auto 45px auto;">
          <span class="slide-tag" style="background: var(--primary); color: #fff; padding: 5px 15px; border-radius: 50px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Ancient Grains</span>
          <h2 class="serif-font" style="color: var(--primary); margin-top: 15px; font-size: 2.3rem;">Explore Our Nutritious Millets</h2>
          <p style="color: #666; font-size: 1rem; line-height: 1.5; margin-top: 10px;">
            Discover the power of gluten-free ancient grains. Rich in essential minerals, dietary fiber, and protein, millets make a perfect daily alternative to white rice and refined wheat.
          </p>
        </div>
        
        <div class="grid grid-cols-4" style="gap: 20px; display: grid; grid-template-columns: repeat(4, 1fr); text-align: center;">
          <!-- 1. Ragi -->
          <div style="background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 25px; display: flex; flex-direction: column; align-items: center; gap: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.01);">
            <img src="images/products/ragi.svg" alt="Finger Millet (Ragi)" style="width: 60px; height: 60px; object-fit: contain;">
            <h4 style="margin: 5px 0 0 0; color: var(--primary); font-size: 1.05rem; font-weight: 700;">Finger Millet (Ragi)</h4>
            <p style="font-size: 0.8rem; color: #666; line-height: 1.45; margin: 0; flex-grow: 1;">Sprouted grains packed with calcium. Perfect for porridges, rotis, and dosa batter.</p>
            <a href="#shop?category=millets" style="font-size: 0.85rem; color: var(--secondary); text-decoration: none; font-weight: 700; margin-top: 10px; display: inline-block;">Shop Ragi →</a>
          </div>

          <!-- 2. Foxtail -->
          <div style="background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 25px; display: flex; flex-direction: column; align-items: center; gap: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.01);">
            <img src="images/products/foxtail_millet.svg" alt="Foxtail Millet" style="width: 60px; height: 60px; object-fit: contain;">
            <h4 style="margin: 5px 0 0 0; color: var(--primary); font-size: 1.05rem; font-weight: 700;">Foxtail Millet</h4>
            <p style="font-size: 0.8rem; color: #666; line-height: 1.45; margin: 0; flex-grow: 1;">Unpolished grains rich in protein and iron. Excellent low-glycemic replacement for white rice.</p>
            <a href="#shop?category=millets" style="font-size: 0.85rem; color: var(--secondary); text-decoration: none; font-weight: 700; margin-top: 10px; display: inline-block;">Shop Foxtail →</a>
          </div>

          <!-- 3. Bajra -->
          <div style="background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 25px; display: flex; flex-direction: column; align-items: center; gap: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.01);">
            <img src="images/products/bajra.svg" alt="Pearl Millet (Bajra)" style="width: 60px; height: 60px; object-fit: contain;">
            <h4 style="margin: 5px 0 0 0; color: var(--primary); font-size: 1.05rem; font-weight: 700;">Pearl Millet (Bajra)</h4>
            <p style="font-size: 0.8rem; color: #666; line-height: 1.45; margin: 0; flex-grow: 1;">Rich in magnesium and essential nutrients, ideal for traditional bajra rotis and porridge.</p>
            <a href="#shop?category=millets" style="font-size: 0.85rem; color: var(--secondary); text-decoration: none; font-weight: 700; margin-top: 10px; display: inline-block;">Shop Bajra →</a>
          </div>

          <!-- 4. Little Millet -->
          <div style="background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 25px; display: flex; flex-direction: column; align-items: center; gap: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.01);">
            <img src="images/products/little_millet.svg" alt="Little Millet" style="width: 60px; height: 60px; object-fit: contain;">
            <h4 style="margin: 5px 0 0 0; color: var(--primary); font-size: 1.05rem; font-weight: 700;">Little Millet (Kutki)</h4>
            <p style="font-size: 0.8rem; color: #666; line-height: 1.45; margin: 0; flex-grow: 1;">Highly nutritious, easy to digest, and rich in antioxidants. Perfect for upma, pongal, or kheer.</p>
            <a href="#shop?category=millets" style="font-size: 0.85rem; color: var(--secondary); text-decoration: none; font-weight: 700; margin-top: 10px; display: inline-block;">Shop Little →</a>
          </div>

          <!-- 5. Kodo -->
          <div style="background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 25px; display: flex; flex-direction: column; align-items: center; gap: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.01);">
            <img src="images/products/kodo_millet.svg" alt="Kodo Millet" style="width: 60px; height: 60px; object-fit: contain;">
            <h4 style="margin: 5px 0 0 0; color: var(--primary); font-size: 1.05rem; font-weight: 700;">Kodo Millet (Kodra)</h4>
            <p style="font-size: 0.8rem; color: #666; line-height: 1.45; margin: 0; flex-grow: 1;">Excellent source of dietary fiber, iron, and vitamin B6. Great for heart health and sugar control.</p>
            <a href="#shop?category=millets" style="font-size: 0.85rem; color: var(--secondary); text-decoration: none; font-weight: 700; margin-top: 10px; display: inline-block;">Shop Kodo →</a>
          </div>

          <!-- 6. Barnyard -->
          <div style="background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 25px; display: flex; flex-direction: column; align-items: center; gap: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.01);">
            <img src="images/products/barnyard_millet.svg" alt="Barnyard Millet" style="width: 60px; height: 60px; object-fit: contain;">
            <h4 style="margin: 5px 0 0 0; color: var(--primary); font-size: 1.05rem; font-weight: 700;">Barnyard Millet</h4>
            <p style="font-size: 0.8rem; color: #666; line-height: 1.45; margin: 0; flex-grow: 1;">Pesticide-free grains with low carbs and digestible proteins. Sourced for vrats and idli batters.</p>
            <a href="#shop?category=millets" style="font-size: 0.85rem; color: var(--secondary); text-decoration: none; font-weight: 700; margin-top: 10px; display: inline-block;">Shop Barnyard →</a>
          </div>

          <!-- 7. Browntop -->
          <div style="background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 25px; display: flex; flex-direction: column; align-items: center; gap: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.01);">
            <img src="images/products/browntop_millet.svg" alt="Browntop Millet" style="width: 60px; height: 60px; object-fit: contain;">
            <h4 style="margin: 5px 0 0 0; color: var(--primary); font-size: 1.05rem; font-weight: 700;">Browntop Millet</h4>
            <p style="font-size: 0.8rem; color: #666; line-height: 1.45; margin: 0; flex-grow: 1;">Highest fiber content (12.5%) among millets. Promotes digestive wellness and detoxification.</p>
            <a href="#shop?category=millets" style="font-size: 0.85rem; color: var(--secondary); text-decoration: none; font-weight: 700; margin-top: 10px; display: inline-block;">Shop Browntop →</a>
          </div>

          <!-- 8. Jowar -->
          <div style="background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 25px; display: flex; flex-direction: column; align-items: center; gap: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.01);">
            <img src="images/products/sorghum.svg" alt="Sorghum (Jowar)" style="width: 60px; height: 60px; object-fit: contain;">
            <h4 style="margin: 5px 0 0 0; color: var(--primary); font-size: 1.05rem; font-weight: 700;">Sorghum (Jowar)</h4>
            <p style="font-size: 0.8rem; color: #666; line-height: 1.45; margin: 0; flex-grow: 1;">Gluten-free grains rich in iron, protein, and copper. Perfect for grinding into jowar bhakri flour.</p>
            <a href="#shop?category=millets" style="font-size: 0.85rem; color: var(--secondary); text-decoration: none; font-weight: 700; margin-top: 10px; display: inline-block;">Shop Sorghum →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Promotional Banners -->
    <section class="promo-banners">
      <div class="promo-banner-card" style="background-image: url('https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=600')">
        <div class="promo-banner-overlay"></div>
        <div class="promo-banner-content">
          <span class="promo-tag">Organic Seasonings</span>
          <h3 class="promo-title serif-font">Pure Hand-ground Spices</h3>
          <p>Get turmeric, chili powder and traditional masalas ground slowly at low temps.</p>
          <a href="#shop?category=spices" class="promo-link">Shop Spices 
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
        </div>
      </div>
      <div class="promo-banner-card" style="background-image: url('https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=600')">
        <div class="promo-banner-overlay"></div>
        <div class="promo-banner-content">
          <span class="promo-tag">100% Organic</span>
          <h3 class="promo-title serif-font">Salem Turmeric & Bold Cardamom</h3>
          <p>Directly harvested from organic estates in Salem and Idukki.</p>
          <a href="#shop?category=spices" class="promo-link">Explore Spices 
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- Featured Products Tabs -->
    <section class="section-padding">
      <div class="section-header">
        <div class="section-title-wrap">
          <h2 class="serif-font">Featured Products</h2>
        </div>
        <div class="tabs-navigation">
          <button class="tab-btn active" onclick="filterHomeProducts('all', this)">All</button>
          <button class="tab-btn" onclick="filterHomeProducts('cold-pressed-oils', this)">Oils</button>
          <button class="tab-btn" onclick="filterHomeProducts('spices', this)">Spices</button>
          <button class="tab-btn" onclick="filterHomeProducts('millets', this)">Millets</button>
        </div>
      </div>
      
      <!-- Product Grid -->
      <div class="grid grid-cols-4" id="home-featured-grid">
        ${featuredProducts.map(p => renderProductCardHTML(p)).join('')}
      </div>
    </section>
  `;
}

// 2. SHOP VIEW RENDERER
function renderShopHTML(products, selectedCat = '', selectedBrand = '', activeSort = 'default') {
  const categories = [
    { id: 'cold-pressed-oils', name: 'Cold Pressed Oils' },
    { id: 'spices', name: 'Spices' },
    { id: 'millets', name: 'Organic Millets' }
  ];

  const brands = [
    { id: 'grownup-organics-1', name: 'GrownUp Organics 1' },
    { id: 'grownup-organics-2', name: 'GrownUp Organics 2' },
    { id: 'grownup-organics-3', name: 'GrownUp Organics 3' },
    { id: 'grownup-organics-4', name: 'GrownUp Organics 4' }
  ];

  return `
    <div style="margin-top: 20px;">
      <span class="text-muted" style="font-size:0.9rem;"><a href="#home">Home</a> &nbsp;/&nbsp; <strong style="color:var(--primary);">Shop</strong></span>
    </div>

    <div class="shop-layout">
      <!-- Sidebar Filters -->
      <aside class="shop-sidebar">
        <div class="filter-group">
          <h3 class="filter-title">Product Category</h3>
          <div class="filter-list">
            <div class="filter-item ${!selectedCat ? 'active' : ''}" onclick="applyFilter('category', '')">
              <span class="filter-checkbox"></span>
              All Categories
            </div>
            ${categories.map(cat => `
              <div class="filter-item ${selectedCat === cat.id ? 'active' : ''}" onclick="applyFilter('category', '${cat.id}')">
                <span class="filter-checkbox"></span>
                ${cat.name}
              </div>
            `).join('')}
          </div>
        </div>


        <button class="btn-checkout" style="padding: 10px; margin-top: 10px;" onclick="clearAllFilters()">Clear Filters</button>
      </aside>

      <!-- Main Shop Body -->
      <section>
        <header class="shop-main-header">
          <span style="font-weight:600; color:var(--light-text);">${products.length} Products Found</span>
          
          <div class="sort-select-wrapper">
            <span>Sort By:</span>
            <select class="sort-select" onchange="applySort(this.value)">
              <option value="default" ${activeSort === 'default' ? 'selected' : ''}>Default</option>
              <option value="price-low" ${activeSort === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
              <option value="price-high" ${activeSort === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
              <option value="name-asc" ${activeSort === 'name-asc' ? 'selected' : ''}>Name: A to Z</option>
            </select>
          </div>
        </header>

        <!-- Shop Products Grid -->
        <div class="grid grid-cols-3" id="shop-products-grid">
          ${products.length > 0 
            ? products.map(p => renderProductCardHTML(p)).join('') 
            : `<div style="grid-column: span 3; text-align: center; padding: 60px 0; color: var(--muted-text);">
                 <h3>No products matches found.</h3>
                 <p style="margin-top:10px;">Try adjusting your search query or filters.</p>
               </div>`
          }
        </div>
      </section>
    </div>
  `;
}

// 3. PRODUCT DETAIL VIEW RENDERER
function renderProductDetailHTML(product) {
  if (!product) return `<div class="text-center section-padding"><h3>Product not found.</h3></div>`;
  const isInWishlist = window.wishlist && window.wishlist.includes(product.id);
  const discountPercent = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : 0;

  return `
    <div style="margin-top: 20px;">
      <span class="text-muted" style="font-size:0.9rem;">
        <a href="#home">Home</a> &nbsp;/&nbsp; 
        <a href="#shop">Shop</a> &nbsp;/&nbsp; 
        <a href="#shop?category=${product.category}">${product.categoryName}</a> &nbsp;/&nbsp;
        <strong style="color:var(--primary);">${product.name}</strong>
      </span>
    </div>

    <div class="detail-layout">
      <!-- Left side Gallery -->
      <div class="detail-gallery">
        <div class="detail-main-img-wrap">
          <img id="detail-main-image" src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?q=80&w=600'">
        </div>
        <div class="detail-thumbnails">
          <div class="thumb-img-wrap active" onclick="setDetailImage('${product.image}', this)">
            <img src="${product.image}" alt="Thumb 1">
          </div>
          <!-- Additional mock gallery thumbnails -->
          <div class="thumb-img-wrap" onclick="setDetailImage('https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?q=80&w=600', this)">
            <img src="https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?q=80&w=200" alt="Thumb 2">
          </div>
          <div class="thumb-img-wrap" onclick="setDetailImage('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600', this)">
            <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=200" alt="Thumb 3">
          </div>
        </div>
      </div>

      <!-- Right side info block -->
      <div class="detail-info">
        <div class="detail-badge-row">
          <span class="detail-category-label">${product.categoryName}</span>
          ${product.oldPrice ? `<span class="detail-save-badge">${discountPercent}% Off</span>` : ''}
        </div>
        <h1 class="detail-title serif-font">${product.name}</h1>
        
        <div class="detail-rating-row">
          <span class="stars" style="font-size:1.1rem;">${renderStarsHTML(product.rating)}</span>
          <span class="rating-count" style="font-size:0.9rem;"><strong>${product.rating}</strong> (${product.reviews} customer reviews)</span>
        </div>

        <div class="detail-price-row">
          <span class="detail-price">₹${product.price.toFixed(2)}</span>
          ${product.oldPrice ? `<span class="detail-price-old">₹${product.oldPrice.toFixed(2)}</span>` : ''}
        </div>

        <p class="detail-desc">${product.description}</p>

        <!-- Product Actions -->
        <div class="detail-actions">
          <div class="detail-qty-selector">
            <button class="btn-detail-qty" onclick="changeDetailQty(-1)">-</button>
            <span class="detail-qty-val" id="detail-qty-count">1</span>
            <button class="btn-detail-qty" onclick="changeDetailQty(1)">+</button>
          </div>
          
          <button class="btn-add-cart-large" onclick="addDetailToCart(${product.id})">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21a1 1 0 1 0 0 2 1 1 0 1 0 0-2z"></path><path d="M20 21a1 1 0 1 0 0 2 1 1 0 1 0 0-2z"></path><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            Add to Cart
          </button>
          
          <button class="btn-wishlist-large ${isInWishlist ? 'active' : ''}" onclick="toggleWishlist(${product.id}); this.classList.toggle('active')" aria-label="Toggle Wishlist">
            <svg width="20" height="20" fill="${isInWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        </div>

        <!-- Product Specs Metadata -->
        <div class="detail-meta">
          <div class="detail-meta-item">
            <span class="detail-meta-label">Brand:</span>
            <span class="text-brand" style="font-weight:600;"><a href="#shop?brand=${product.brand}">${product.brandName}</a></span>
          </div>
          ${Object.entries(product.specs).map(([key, val]) => `
            <div class="detail-meta-item">
              <span class="detail-meta-label">${key}:</span>
              <span style="color: var(--dark-text);">${val}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// 4. DETAILED CART VIEW RENDERER
function renderCartHTML(cartItems, couponDiscount = 0) {
  if (cartItems.length === 0) {
    return `
      <div class="text-center section-padding">
        <h2 class="serif-font" style="margin-bottom:15px; color:var(--primary);">Your Cart is Empty</h2>
        <p class="text-muted" style="margin-bottom:30px;">Add organic goodness from our catalog to get started.</p>
        <a href="#shop" class="btn-shop-now">Go Shop Products</a>
      </div>
    `;
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountAmount = subtotal * couponDiscount;
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
  const finalTotal = subtotal - discountAmount + shipping;

  return `
    <div style="margin-top: 20px;">
      <span class="text-muted" style="font-size:0.9rem;"><a href="#home">Home</a> &nbsp;/&nbsp; <strong style="color:var(--primary);">Shopping Cart</strong></span>
    </div>

    <div class="cart-layout">
      <!-- Cart Table -->
      <div class="cart-table-container">
        <table class="cart-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${cartItems.map(item => `
              <tr>
                <td>
                  <div class="d-flex align-items-center" style="gap:15px;">
                    <div style="width:60px; height:60px; border-radius:6px; overflow:hidden; border:1px solid var(--border-color); flex-shrink:0;">
                      <img src="${item.product.image}" alt="${item.product.name}" style="width:100%; height:100%; object-fit:cover;">
                    </div>
                    <div>
                      <h4 style="font-size:0.95rem; font-weight:700;"><a href="#product/${item.product.id}">${item.product.name}</a></h4>
                      <span class="text-muted" style="font-size:0.75rem;">Brand: ${item.product.brandName}</span>
                    </div>
                  </div>
                </td>
                <td style="font-weight:600;">₹${item.product.price.toFixed(2)}</td>
                <td>
                  <div class="cart-qty-selector">
                    <button class="btn-qty" onclick="updateCartQty(${item.product.id}, ${item.quantity - 1})">-</button>
                    <span class="qty-val">${item.quantity}</span>
                    <button class="btn-qty" onclick="updateCartQty(${item.product.id}, ${item.quantity + 1})">+</button>
                  </div>
                </td>
                <td style="font-weight:700; color:var(--primary);">₹${(item.product.price * item.quantity).toFixed(2)}</td>
                <td>
                  <button class="btn-remove-item" onclick="removeFromCart(${item.product.id})" aria-label="Remove item">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Summary Block -->
      <aside class="summary-card">
        <h3 class="summary-title serif-font">Order Summary</h3>
        <div class="cart-summary-row">
          <span>Cart Subtotal</span>
          <strong>₹${subtotal.toFixed(2)}</strong>
        </div>
        ${couponDiscount > 0 ? `
          <div class="cart-summary-row" style="color: var(--accent);">
            <span>Coupon Discount (${couponDiscount * 100}%)</span>
            <strong>- ₹${discountAmount.toFixed(2)}</strong>
          </div>
        ` : ''}
        <div class="cart-summary-row">
          <span>Shipping Charges</span>
          <span>${shipping === 0 ? '<strong style="color:var(--primary);">FREE</strong>' : `₹${shipping.toFixed(2)}`}</span>
        </div>
        
        <!-- Coupon input -->
        <div style="margin: 20px 0; border-top:1px solid var(--border-light); padding-top:15px;">
          <label for="coupon-input-code" style="font-size:0.8rem; font-weight:700; display:block; margin-bottom:8px;">Apply Promo Coupon</label>
          <div class="d-flex" style="gap:8px;">
            <input type="text" id="coupon-input-code" class="form-input" style="padding:8px 12px; font-size:0.85rem;" placeholder="e.g. ORGANIC10">
            <button class="btn-add-cart" style="padding:0 15px; flex-shrink:0;" onclick="applyCouponCode()">Apply</button>
          </div>
          <span id="coupon-feedback" style="font-size:0.75rem; display:block; margin-top:5px; font-weight:600;"></span>
        </div>

        <div class="cart-summary-row cart-summary-total" style="margin-bottom:20px;">
          <strong>Order Total</strong>
          <strong style="color:var(--primary); font-size:1.3rem;">₹${finalTotal.toFixed(2)}</strong>
        </div>

        <a href="#checkout" class="btn-checkout" style="text-align:center;">Proceed to Checkout</a>
        <a href="#shop" class="btn-view-cart" style="text-align:center;">Continue Shopping</a>
      </aside>
    </div>
  `;
}

// 5. WISHLIST VIEW RENDERER
function renderWishlistHTML(wishlistProducts) {
  if (wishlistProducts.length === 0) {
    return `
      <div class="text-center section-padding">
        <h2 class="serif-font" style="margin-bottom:15px; color:var(--primary);">Your Wishlist is Empty</h2>
        <p class="text-muted" style="margin-bottom:30px;">Click the heart icon on products to save them for later.</p>
        <a href="#shop" class="btn-shop-now">Go Shop Products</a>
      </div>
    `;
  }

  return `
    <div style="margin-top: 20px;">
      <span class="text-muted" style="font-size:0.9rem;"><a href="#home">Home</a> &nbsp;/&nbsp; <strong style="color:var(--primary);">Wishlist</strong></span>
    </div>

    <section class="section-padding">
      <div class="section-header">
        <div class="section-title-wrap">
          <h2 class="serif-font">My Wishlist Products</h2>
        </div>
      </div>
      
      <div class="grid grid-cols-4">
        ${wishlistProducts.map(p => renderProductCardHTML(p)).join('')}
      </div>
    </section>
  `;
}

// 6. CHECKOUT VIEW RENDERER
function renderCheckoutHTML(cartItems, couponDiscount = 0) {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountAmount = subtotal * couponDiscount;
  const shipping = subtotal > 500 ? 0 : 50;
  const finalTotal = subtotal - discountAmount + shipping;

  return `
    <div style="margin-top: 20px;">
      <span class="text-muted" style="font-size:0.9rem;"><a href="#home">Home</a> &nbsp;/&nbsp; <strong style="color:var(--primary);">Checkout</strong></span>
    </div>

    <div class="checkout-layout">
      <!-- Checkout Address and Payment Forms -->
      <div>
        <form id="checkout-address-form" onsubmit="handlePlaceOrder(event)">
          <div class="checkout-section">
            <h3 class="checkout-section-title serif-font" style="color:var(--primary);">
              <span>1.</span> Billing & Shipping Address
            </h3>
            <div class="form-grid">
              <div>
                <label for="bill-fname" class="input-label">First Name *</label>
                <input type="text" id="bill-fname" class="form-input" required placeholder="Enter first name">
              </div>
              <div>
                <label for="bill-lname" class="input-label">Last Name *</label>
                <input type="text" id="bill-lname" class="form-input" required placeholder="Enter last name">
              </div>
              <div class="form-group-full">
                <label for="bill-address" class="input-label">Street Address *</label>
                <input type="text" id="bill-address" class="form-input" required placeholder="House number and street name">
              </div>
              <div>
                <label for="bill-city" class="input-label">Town / City *</label>
                <input type="text" id="bill-city" class="form-input" required placeholder="e.g. Bangalore">
              </div>
              <div>
                <label for="bill-pincode" class="input-label">Pincode *</label>
                <input type="text" id="bill-pincode" class="form-input" required pattern="[0-9]{6}" placeholder="6-digit Pincode">
              </div>
              <div>
                <label for="bill-phone" class="input-label">Phone Number *</label>
                <input type="tel" id="bill-phone" class="form-input" required pattern="[0-9]{10}" placeholder="10-digit Mobile">
              </div>
              <div>
                <label for="bill-email" class="input-label">Email Address *</label>
                <input type="email" id="bill-email" class="form-input" required placeholder="e.g. name@domain.com">
              </div>
            </div>
          </div>

          <div class="checkout-section">
            <h3 class="checkout-section-title serif-font" style="color:var(--primary);">
              <span>2.</span> Payment Method Selection
            </h3>
            <div class="payment-methods">
              <div class="payment-method-item active" onclick="setPaymentMethod('cod', this)">
                <input type="radio" name="payment_mode" value="cod" class="payment-radio" checked id="pay-cod">
                <div class="payment-details">
                  <label for="pay-cod"><h5>Cash on Delivery (COD)</h5></label>
                  <p>Pay with cash directly to the delivery personnel upon receiving your organic products.</p>
                </div>
              </div>
              <div class="payment-method-item" onclick="setPaymentMethod('online', this)">
                <input type="radio" name="payment_mode" value="online" class="payment-radio" id="pay-online">
                <div class="payment-details">
                  <label for="pay-online"><h5>Mock Online Payment (Cards/UPI)</h5></label>
                  <p>Simulate instant payment via credit/debit card, netbanking, or UPI wallets.</p>
                </div>
              </div>
            </div>
            
            <button type="submit" class="btn-checkout" style="padding:15px; margin-top:25px; font-size:1.1rem;">Place Order Now (₹${finalTotal.toFixed(2)})</button>
          </div>
        </form>
      </div>

      <!-- Order Review Sidebar -->
      <aside class="summary-card">
        <h3 class="summary-title serif-font">Review Your Order</h3>
        
        <!-- List Items -->
        <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px; max-height:260px; overflow-y:auto; padding-right:5px;">
          ${cartItems.map(item => `
            <div class="d-flex align-items-center justify-content-between" style="gap:10px; font-size:0.85rem; padding-bottom:8px; border-bottom:1px solid var(--border-light);">
              <div class="d-flex align-items-center" style="gap:8px;">
                <div style="width:40px; height:40px; border-radius:4px; overflow:hidden; flex-shrink:0;">
                  <img src="${item.product.image}" alt="" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <div>
                  <span style="font-weight:700;">${item.product.name}</span>
                  <span class="text-muted" style="display:block; font-size:0.75rem;">Qty: ${item.quantity}</span>
                </div>
              </div>
              <span style="font-weight:700; color:var(--primary);">₹${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>

        <div class="cart-summary-row" style="font-size:0.9rem;">
          <span>Subtotal:</span>
          <strong>₹${subtotal.toFixed(2)}</strong>
        </div>
        ${couponDiscount > 0 ? `
          <div class="cart-summary-row" style="color:var(--accent); font-size:0.9rem;">
            <span>Coupon Discount:</span>
            <strong>- ₹${discountAmount.toFixed(2)}</strong>
          </div>
        ` : ''}
        <div class="cart-summary-row" style="font-size:0.9rem;">
          <span>Shipping:</span>
          <span>${shipping === 0 ? '<strong style="color:var(--primary);">FREE</strong>' : `₹${shipping.toFixed(2)}`}</span>
        </div>
        <div class="cart-summary-row cart-summary-total">
          <strong>Final Total:</strong>
          <strong style="color:var(--primary); font-size:1.25rem;">₹${finalTotal.toFixed(2)}</strong>
        </div>
      </aside>
    </div>
  `;
}

// 7. ORDER TRACKING VIEW RENDERER (invoice & stepper timeline)
function renderOrderTrackingHTML(order) {
  if (!order) {
    return `
      <div class="tracking-wrapper">
        <h2 class="serif-font text-center" style="color:var(--primary); margin-bottom:10px;">Track Your Order</h2>
        <p class="text-muted text-center" style="margin-bottom:30px;">Input details below to check order status, delivery stages and view invoice.</p>
        <form id="tracking-page-form" onsubmit="handleTrackingSearch(event)">
          <div class="form-group-full" style="margin-bottom: 20px;">
            <label for="track-page-email" class="input-label">Email / Mobile Number</label>
            <input type="text" class="form-input" id="track-page-email" required placeholder="e.g. customer@email.com">
          </div>
          <div class="form-group-full" style="margin-bottom: 20px;">
            <label for="track-page-id" class="input-label">Order Invoice ID</label>
            <input type="text" class="form-input" id="track-page-id" required placeholder="e.g. VO-12345678">
          </div>
          <button type="submit" class="btn-checkout">Track Status</button>
        </form>
        <div id="tracking-page-error" style="color:var(--accent); text-align:center; font-weight:600; margin-top:15px;"></div>
      </div>
    `;
  }

  // Visual Stepper stages based on order time
  // For demo: order status is "Processing" or "Shipped" or "Delivered" based on local time difference, or simply hardcoded
  const stage = order.status || "Processing";
  const stages = [
    { key: "Ordered", title: "Order Placed", desc: "Order details received and confirmed.", time: order.date },
    { key: "Processing", title: "Under Processing", desc: "Your products are being freshly packed in our warehouse.", time: "Within 4 hours" },
    { key: "Shipped", title: "Out for Delivery", desc: "Dispatched from Palakonda hub with tracking courier details.", time: "Within 24 hours" },
    { key: "Delivered", title: "Successfully Delivered", desc: "Package handed over to the consignee.", time: "Estimated 2-3 Days" }
  ];

  let currentStageIndex = 0;
  if (stage === "Processing") currentStageIndex = 1;
  if (stage === "Shipped") currentStageIndex = 2;
  if (stage === "Delivered") currentStageIndex = 3;

  return `
    <div style="margin-top: 20px;">
      <span class="text-muted" style="font-size:0.9rem;"><a href="#home">Home</a> &nbsp;/&nbsp; <strong style="color:var(--primary);">Order Status</strong></span>
    </div>

    <div class="contact-layout" style="margin-top:30px;">
      <!-- Left side timeline status -->
      <div class="tracking-info-card" style="background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: 30px;">
        <h3 class="serif-font" style="color:var(--primary); margin-bottom:25px; border-bottom:1px solid var(--border-light); padding-bottom:12px;">Delivery Timeline</h3>
        
        <div class="timeline">
          ${stages.map((st, index) => {
            const isCompleted = index < currentStageIndex;
            const isActive = index === currentStageIndex;
            return `
              <div class="timeline-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}">
                <span class="timeline-dot"></span>
                <div class="timeline-content">
                  <div>
                    <h4 class="timeline-title">${st.title}</h4>
                    <p class="timeline-desc">${st.desc}</p>
                  </div>
                  <span class="timeline-time">${isCompleted ? 'Completed' : st.time}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Right side invoice summary -->
      <div style="background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: 30px;">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-light); padding-bottom:15px; margin-bottom:20px;">
          <div>
            <h3 class="serif-font" style="color:var(--primary);">Order Invoice</h3>
            <span class="text-muted" style="font-size:0.8rem;">ID: <strong>${order.id}</strong></span>
          </div>
          <span style="background-color:var(--primary-light); color:var(--primary); font-weight:700; padding:6px 12px; border-radius:18px; font-size:0.85rem;">
            ${stage.toUpperCase()}
          </span>
        </div>

        <div style="font-size:0.9rem; margin-bottom:20px; line-height:1.5;">
          <p><strong>Customer Name:</strong> ${order.fname} ${order.lname}</p>
          <p><strong>Shipping Address:</strong> ${order.address}, ${order.city} - ${order.pincode}</p>
          <p><strong>Phone Number:</strong> +91 ${order.phone}</p>
          <p><strong>Payment Mode:</strong> ${order.paymentMode === 'cod' ? 'Cash on Delivery (COD)' : 'Online Card/UPI'}</p>
        </div>

        <div style="border-top:1px solid var(--border-light); padding-top:15px;">
          <h4 style="font-size:0.95rem; font-weight:700; margin-bottom:12px;">Items Summary</h4>
          <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
            ${order.items.map(item => `
              <div class="d-flex justify-content-between align-items-center" style="font-size:0.85rem; border-bottom:1px dashed var(--border-light); padding-bottom:8px;">
                <span>${item.product.name} (x${item.quantity})</span>
                <span style="font-weight:700;">₹${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          
          <div class="cart-summary-row" style="font-size:0.85rem;">
            <span>Subtotal:</span>
            <span>₹${order.subtotal.toFixed(2)}</span>
          </div>
          ${order.discountAmount > 0 ? `
            <div class="cart-summary-row" style="color:var(--accent); font-size:0.85rem;">
              <span>Coupon Discount:</span>
              <span>- ₹${order.discountAmount.toFixed(2)}</span>
            </div>
          ` : ''}
          <div class="cart-summary-row" style="font-size:0.85rem;">
            <span>Shipping:</span>
            <span>₹${order.shipping.toFixed(2)}</span>
          </div>
          <div class="cart-summary-row" style="font-size:1.05rem; font-weight:800; border-top:1px dashed var(--border-color); padding-top:8px;">
            <span>Grand Total Paid:</span>
            <span style="color:var(--primary);">₹${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 8. QUICK VIEW MODAL CONTENT RENDERER
function renderQuickViewHTML(product) {
  return `
    <div class="detail-layout" style="margin-top: 10px;">
      <!-- Left side Image -->
      <div>
        <div class="detail-main-img-wrap" style="height: 320px;">
          <img src="${product.image}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover;">
        </div>
      </div>

      <!-- Right side Info -->
      <div class="detail-info">
        <span class="detail-category-label" style="font-size:0.75rem; margin-bottom:5px;">${product.categoryName}</span>
        <h2 class="serif-font" style="font-size: 1.5rem; margin-bottom:10px;">${product.name}</h2>
        
        <div class="detail-rating-row" style="margin-bottom:12px; padding-bottom:10px;">
          <span class="stars">${renderStarsHTML(product.rating)}</span>
          <span class="rating-count" style="font-size:0.8rem;">(${product.reviews} reviews)</span>
        </div>

        <div class="detail-price-row" style="margin-bottom:15px;">
          <span class="detail-price" style="font-size:1.5rem;">₹${product.price.toFixed(2)}</span>
          ${product.oldPrice ? `<span class="detail-price-old" style="font-size:1.1rem;">₹${product.oldPrice.toFixed(2)}</span>` : ''}
        </div>

        <p class="detail-desc" style="font-size:0.85rem; margin-bottom:20px; line-height:1.5;">${product.description.substring(0, 150)}...</p>

        <div class="detail-actions" style="margin-bottom:20px;">
          <div class="detail-qty-selector" style="height:40px;">
            <button class="btn-detail-qty" style="width:40px;" onclick="changeQuickViewQty(-1)">-</button>
            <span class="detail-qty-val" style="padding:0 12px; font-size:0.9rem;" id="quick-view-qty-count">1</span>
            <button class="btn-detail-qty" style="width:40px;" onclick="changeQuickViewQty(1)">+</button>
          </div>
          
          <button class="btn-add-cart-large" style="height:40px; font-size:0.9rem;" onclick="addQuickViewToCart(${product.id})">
            Add to Cart
          </button>
        </div>
        
        <div style="font-size:0.8rem; border-top:1px solid var(--border-light); padding-top:10px;">
          <span style="color:var(--light-text); font-weight:600;">Brand:</span>
          <span class="text-brand">${product.brandName}</span>
        </div>
      </div>
    </div>
  `;
}

// 9. ABOUT US PAGE RENDERER
function renderAboutHTML() {
  return `
    <div style="margin-top: 20px;">
      <span class="text-muted" style="font-size:0.9rem;"><a href="#home">Home</a> &nbsp;/&nbsp; <strong style="color:var(--primary);">About Us</strong></span>
    </div>

    <div style="max-width: 900px; margin: 30px auto 0 auto; text-align: left; line-height: 1.65; color: #444;">
      <div style="text-align: center; margin-bottom: 40px;">
        <span class="slide-tag" style="background: var(--primary); color: #fff; padding: 5px 15px; border-radius: 50px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Rooted in Purity</span>
        <h1 class="serif-font" style="color: var(--primary); margin-top: 15px; font-size: 2.6rem;">The Story of GrownUp Organics</h1>
      </div>
      
      <div style="background: #faf8f5; border-radius: 8px; padding: 35px; border-left: 5px solid var(--secondary); margin-bottom: 40px; box-shadow: 0 4px 15px rgba(0,0,0,0.01);">
        <h3 class="serif-font" style="color: var(--primary); margin: 0 0 10px 0; font-size: 1.3rem;">Connecting Fields to Kitchens</h3>
        <p style="margin: 0; font-size: 1.05rem; color: #555;">
          GrownUp Organics is born from a simple yet profound desire: to reconnect modern lives with the absolute purity of traditional, farm-grown nourishment. Located in **Palakonda, Manyam district**, we are situated in a landscape rich in agrarian heritage. We bridge the gap between hard-working rural farmers and health-conscious households, bringing you foods that are completely natural, unrefined, and chemical-free.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1.1fr; gap: 40px; margin-bottom: 45px; align-items: center;">
        <div>
          <h3 class="serif-font" style="color: var(--primary); font-size: 1.6rem; margin-bottom: 12px;">Direct Farm Partnerships</h3>
          <p style="margin-bottom: 15px;">
            We collaborate directly with local farmer families across fertile agricultural belts. By sourcing directly from the fields of Manyam district, Salem, and coastal regions, we eliminate complex supply chains.
          </p>
          <p>
            This ensures our farmers receive fair compensation and you receive the freshest harvest, keeping the integrity of organic farming alive.
          </p>
        </div>
        <div style="background: #fdfcf9; padding: 10px; border-radius: 12px; border: 1px solid #eee;">
          <img src="https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=450" alt="Farmer Sourcing" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 40px; margin-bottom: 45px; align-items: center;">
        <div style="background: #fdfcf9; padding: 10px; border-radius: 12px; border: 1px solid #eee;">
          <img src="images/traditional_wood_press.png" alt="Traditional Extraction" style="width: 100%; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        </div>
        <div>
          <h3 class="serif-font" style="color: var(--primary); font-size: 1.6rem; margin-bottom: 12px;">Time-Tested Heritage Extraction</h3>
          <p style="margin-bottom: 15px;">
            Modern refined products are processed using high heat and chemical solvents which strip away important nutrients, healthy fats, and natural aromas.
          </p>
          <p>
            Our oils are extracted using traditional wooden mills (*Lakdi Ghani*) at slow, cold temperatures, ensuring they never heat up and retain their essential fats and vitamins. Our spices are ground slowly at low temperatures to lock in their natural volatile oils, aromas, and flavors.
          </p>
        </div>
      </div>

      <div style="background: var(--primary); color: #fff; border-radius: 8px; padding: 35px 25px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-bottom: 15px;">
        <h3 class="serif-font" style="color: #fff; margin: 0 0 10px 0; font-size: 1.6rem; letter-spacing: 0.5px;">The GrownUp Organics Promise</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 25px; margin-top: 30px;">
          <div>
            <div style="font-size: 2.4rem; margin-bottom: 8px;">🌱</div>
            <strong style="display: block; margin-bottom: 5px; font-size: 1.05rem;">100% Organic Sourcing</strong>
            <span style="font-size: 0.85rem; opacity: 0.85; line-height: 1.4; display: block;">Grown without synthetic pesticides or harmful chemical fertilizers.</span>
          </div>
          <div>
            <div style="font-size: 2.4rem; margin-bottom: 8px;">🪵</div>
            <strong style="display: block; margin-bottom: 5px; font-size: 1.05rem;">Lakdi Ghani Cold-Press</strong>
            <span style="font-size: 0.85rem; opacity: 0.85; line-height: 1.4; display: block;">Slow wood pressed extraction keeping original health benefits and aromas intact.</span>
          </div>
          <div>
            <div style="font-size: 2.4rem; margin-bottom: 8px;">🧪</div>
            <strong style="display: block; margin-bottom: 5px; font-size: 1.05rem;">Zero Additive Guarantee</strong>
            <span style="font-size: 0.85rem; opacity: 0.85; line-height: 1.4; display: block;">No artificial coloring agents, stabilizers, chemical preservatives, or fillers.</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 10. CONTACT PAGE RENDERER
function renderContactHTML() {
  return `
    <div style="margin-top: 20px;">
      <span class="text-muted" style="font-size:0.9rem;"><a href="#home">Home</a> &nbsp;/&nbsp; <strong style="color:var(--primary);">Contact Us</strong></span>
    </div>

    <div class="contact-layout">
      <!-- Contact details -->
      <aside class="contact-info-card">
        <h2 class="serif-font" style="color:var(--primary); margin-bottom:20px;">Get in Touch</h2>
        <p class="text-muted" style="font-size:0.9rem; margin-bottom:30px;">Have questions about our sourcing, shipping, or bulk orders? Connect with our customer support team.</p>
        
        <div class="contact-info-item">
          <div class="contact-info-icon">📍</div>
          <div>
            <h4 class="contact-info-title">Our Office</h4>
            <p class="contact-info-desc">GrownUp Organics HQ, Palakonda, Manyam district</p>
          </div>
        </div>

        <div class="contact-info-item">
          <div class="contact-info-icon">📞</div>
          <div>
            <h4 class="contact-info-title">Phone Sourcing</h4>
            <p class="contact-info-desc">+91 9701804868<br><span style="font-size:0.75rem;">(Available 9:00 AM - 7:00 PM IST)</span></p>
          </div>
        </div>

        <div class="contact-info-item">
          <div class="contact-info-icon">✉️</div>
          <div>
            <h4 class="contact-info-title">Email Inquiries</h4>
            <p class="contact-info-desc">support@grownuporganics.in<br>sales@grownuporganics.in</p>
          </div>
        </div>
      </aside>

      <!-- Contact Form -->
      <section style="background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: 30px;">
        <h3 class="serif-font" style="color:var(--primary); margin-bottom:20px; border-bottom:1px solid var(--border-light); padding-bottom:12px;">Send Us a Message</h3>
        <form id="contact-form-element" onsubmit="handleContactSubmit(event)">
          <div class="form-grid">
            <div>
              <label for="contact-name" class="input-label">Full Name *</label>
              <input type="text" id="contact-name" class="form-input" required placeholder="Your Name">
            </div>
            <div>
              <label for="contact-email" class="input-label">Email Address *</label>
              <input type="email" id="contact-email" class="form-input" required placeholder="e.g. name@domain.com">
            </div>
            <div class="form-group-full">
              <label for="contact-phone" class="input-label">Phone Number</label>
              <input type="tel" id="contact-phone" class="form-input" placeholder="e.g. 9876543210">
            </div>
            <div class="form-group-full">
              <label for="contact-msg" class="input-label">Message / Query *</label>
              <textarea id="contact-msg" class="form-input" required rows="5" placeholder="How can we help you?" style="resize:vertical;"></textarea>
            </div>
          </div>
          <button type="submit" class="btn-checkout" style="margin-top:20px; padding:12px;">Send Message</button>
        </form>
        <div id="contact-form-feedback" style="color:var(--primary); text-align:center; font-weight:600; margin-top:15px;"></div>
      </section>
    </div>
  `;
}

// 11. LOGIN PAGE RENDERER
function renderLoginHTML() {
  return `
    <div class="tracking-wrapper" style="margin-top:50px;">
      <h2 class="serif-font text-center" style="color:var(--primary); margin-bottom:10px;">Login / Register</h2>
      <p class="text-muted text-center" style="margin-bottom:30px;">Access your orders, wishlists and faster checkout.</p>
      
      <form id="login-form-element" onsubmit="handleLoginSubmit(event)">
        <div class="form-group-full" style="margin-bottom: 20px;">
          <label for="login-email" class="input-label">Email Address *</label>
          <input type="email" class="form-input" id="login-email" required placeholder="customer@domain.com">
        </div>
        <div class="form-group-full" style="margin-bottom: 20px;">
          <label for="login-pass" class="input-label">Password *</label>
          <input type="password" class="form-input" id="login-pass" required placeholder="••••••••">
        </div>
        <button type="submit" class="btn-checkout">Sign In</button>
      </form>
      
      <div style="text-align:center; font-size:0.85rem; margin-top:20px; color:var(--light-text);">
        Don't have an account? <a href="#login" style="color:var(--primary); font-weight:600;">Create Account</a>
      </div>
    </div>
  `;
}
