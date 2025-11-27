/**
 * E-Commerce Website - JavaScript Functionality
 * Week 3: Basic Interactivity Implementation
 * 
 * Features:
 * - Countdown Timer
 * - Search Bar Functionality
 * - Dropdown Menus
 * - Product View Toggles
 * - Product Image Gallery
 * - Size & Color Selectors
 * - Tab Navigation
 * - Form Handling
 * - Cart Functionality
 */

// =========================================
// UTILITY FUNCTIONS
// =========================================

/**
 * Debounce function to limit function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    // Remove any existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button class="toast-close">&times;</button>
    `;
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00B517' : type === 'error' ? '#FA3434' : '#0D6EFD'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    // Close button functionality
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }
    }, 3000);
}

// Add toast animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(styleSheet);

// =========================================
// COUNTDOWN TIMER
// =========================================

function initCountdown() {
    const countdownTimer = document.getElementById('countdown-timer');
    if (!countdownTimer) return;

    const targetDate = new Date(countdownTimer.dataset.target).getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            document.querySelectorAll('.countdown-value').forEach(el => el.textContent = '00');
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// =========================================
// SEARCH BAR FUNCTIONALITY
// =========================================

function initSearchBar() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const categorySelect = document.getElementById('category-select');

    if (!searchInput || !searchBtn) return;

    // Search button click handler
    searchBtn.addEventListener('click', performSearch);

    // Enter key handler
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    function performSearch() {
        const query = searchInput.value.trim();
        const category = categorySelect ? categorySelect.value : '';

        if (query) {
            // In a real application, this would navigate to search results
            showToast(`Searching for "${query}"${category ? ` in ${category}` : ''}...`, 'info');
            
            // Simulate search - redirect to products page
            // window.location.href = `products.html?search=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`;
        } else {
            showToast('Please enter a search term', 'error');
        }
    }

    // Add search suggestions (demo)
    const suggestions = ['Smart Watch', 'Laptop', 'Headphones', 'Camera', 'iPhone'];
    
    searchInput.addEventListener('input', debounce((e) => {
        const value = e.target.value.toLowerCase();
        if (value.length > 1) {
            const matches = suggestions.filter(s => s.toLowerCase().includes(value));
            // Could show suggestions dropdown here
            console.log('Suggestions:', matches);
        }
    }, 300));
}

// =========================================
// DROPDOWN MENUS
// =========================================

function initDropdowns() {
    const dropdowns = document.querySelectorAll('.nav-item.dropdown');

    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        if (!menu) return;

        // Show on hover (desktop)
        dropdown.addEventListener('mouseenter', () => {
            menu.classList.add('active');
        });

        dropdown.addEventListener('mouseleave', () => {
            menu.classList.remove('active');
        });

        // Click handler for items
        menu.querySelectorAll('li').forEach(item => {
            item.addEventListener('click', () => {
                showToast(`Selected: ${item.textContent}`, 'info');
                menu.classList.remove('active');
            });
        });
    });

    // Language/Currency dropdowns
    const rightNavDropdowns = document.querySelectorAll('.right-nav .dropdown');
    rightNavDropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', () => {
            showToast('Language/Region selector clicked', 'info');
        });
    });
}

// =========================================
// PRODUCT VIEW TOGGLES
// =========================================

function initViewToggles() {
    const viewBtns = document.querySelectorAll('.view-toggles .view-btn');
    const productsGrid = document.getElementById('products-grid');

    if (!viewBtns.length || !productsGrid) return;

    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;

            // Update active button
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Toggle grid/list view
            if (view === 'list') {
                productsGrid.classList.add('list-view');
            } else {
                productsGrid.classList.remove('list-view');
            }
        });
    });
}

// =========================================
// PRODUCT IMAGE GALLERY
// =========================================

function initImageGallery() {
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');

    if (!mainImage || !thumbnails.length) return;

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            // Update main image
            const newImageSrc = thumb.dataset.image;
            if (newImageSrc) {
                mainImage.src = newImageSrc;
                mainImage.style.opacity = '0';
                setTimeout(() => {
                    mainImage.style.opacity = '1';
                }, 100);
            }

            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });
}

// =========================================
// SIZE SELECTOR
// =========================================

function initSizeSelector() {
    const sizeBtns = document.querySelectorAll('.size-btn');

    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const size = btn.dataset.size;

            // Update active state
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            showToast(`Size selected: ${btn.textContent}`, 'success');
        });
    });
}

// =========================================
// COLOR SELECTOR
// =========================================

function initColorSelector() {
    const colorBtns = document.querySelectorAll('.color-btn');

    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;

            // Update active state
            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            showToast(`Color selected: ${color}`, 'success');
        });
    });
}

// =========================================
// TAB NAVIGATION
// =========================================

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (!tabBtns.length || !tabContents.length) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;

            // Update active button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show corresponding content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// =========================================
// CART FUNCTIONALITY
// =========================================

let cartCount = 3; // Initial cart count

function initCart() {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const cartBadge = document.querySelector('.cart-badge');

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            cartCount++;
            if (cartBadge) {
                cartBadge.textContent = cartCount;
                cartBadge.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    cartBadge.style.transform = 'scale(1)';
                }, 200);
            }
            showToast('Item added to cart!', 'success');
        });
    }

    // Product card Buy Now buttons
    document.querySelectorAll('.product-card .view-btn, .product-card button').forEach(btn => {
        if (btn.textContent.includes('Buy Now')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                cartCount++;
                if (cartBadge) {
                    cartBadge.textContent = cartCount;
                }
                showToast('Item added to cart!', 'success');
            });
        }
    });
}

// =========================================
// WISHLIST FUNCTIONALITY
// =========================================

function initWishlist() {
    const addToWishlistBtn = document.getElementById('add-to-wishlist-btn');
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');

    if (addToWishlistBtn) {
        addToWishlistBtn.addEventListener('click', () => {
            addToWishlistBtn.classList.toggle('active');
            const isActive = addToWishlistBtn.classList.contains('active');
            showToast(isActive ? 'Added to wishlist!' : 'Removed from wishlist', isActive ? 'success' : 'info');
        });
    }

    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            btn.classList.toggle('active');
            const svg = btn.querySelector('svg');
            if (btn.classList.contains('active')) {
                svg.setAttribute('fill', '#FA3434');
                showToast('Added to wishlist!', 'success');
            } else {
                svg.setAttribute('fill', 'none');
                showToast('Removed from wishlist', 'info');
            }
        });
    });
}

// =========================================
// FORM HANDLING
// =========================================

function initForms() {
    // Quote Form
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(quoteForm);
            const item = quoteForm.querySelector('.item-input')?.value;
            
            if (item) {
                showToast('Quote request sent successfully!', 'success');
                quoteForm.reset();
            } else {
                showToast('Please fill in all required fields', 'error');
            }
        });
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]')?.value;
            
            if (email && email.includes('@')) {
                showToast('Thank you for subscribing!', 'success');
                newsletterForm.reset();
            } else {
                showToast('Please enter a valid email address', 'error');
            }
        });
    }
}

// =========================================
// PAGINATION
// =========================================

function initPagination() {
    const pageNums = document.querySelectorAll('.pagination .page-num');
    const prevBtn = document.querySelector('.pagination button:first-child');
    const nextBtn = document.querySelector('.pagination button:last-child');

    pageNums.forEach(btn => {
        btn.addEventListener('click', () => {
            pageNums.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showToast(`Page ${btn.textContent} selected`, 'info');
            // Scroll to top of products
            document.querySelector('.products-header')?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (!prevBtn.disabled) {
                showToast('Previous page', 'info');
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showToast('Next page', 'info');
        });
    }
}

// =========================================
// FILTER FUNCTIONALITY
// =========================================

function initFilters() {
    const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    const filterRadios = document.querySelectorAll('.filter-options input[type="radio"]');
    const applyBtn = document.querySelector('.filter-sidebar .apply-btn');

    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            console.log('Filter changed:', checkbox.parentElement.textContent.trim(), checkbox.checked);
        });
    });

    filterRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            console.log('Condition changed:', radio.parentElement.textContent.trim());
        });
    });

    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const minPrice = document.querySelector('.price-inputs input:first-child')?.value || 0;
            const maxPrice = document.querySelector('.price-inputs input:last-child')?.value || 999999;
            showToast(`Price filter applied: $${minPrice} - $${maxPrice}`, 'success');
        });
    }
}

// =========================================
// SORT FUNCTIONALITY
// =========================================

function initSort() {
    const sortSelect = document.querySelector('.sort-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const sortValue = sortSelect.value;
            showToast(`Sorted by: ${sortValue}`, 'info');
            // In a real app, this would re-sort the products
        });
    }
}

// =========================================
// HOVER EFFECTS
// =========================================

function initHoverEffects() {
    // Product cards hover animation
    const productCards = document.querySelectorAll('.product-card, .recommended-card, .deal-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
            card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Category sidebar hover
    const categoryItems = document.querySelectorAll('.categories-sidebar li');
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            categoryItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

// =========================================
// CLICKABLE PRODUCT CARDS
// =========================================

function initClickableCards() {
    // Make product cards on products page fully clickable
    const productCards = document.querySelectorAll('.products-grid .product-card');
    
    productCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking on wishlist button
            if (e.target.closest('.wishlist-btn')) {
                return;
            }
            // Find the view details link and navigate to it
            const viewBtn = card.querySelector('.view-btn');
            if (viewBtn && viewBtn.href) {
                window.location.href = viewBtn.href;
            } else {
                window.location.href = 'product-details.html';
            }
        });
    });

    // Make related products clickable
    const relatedProducts = document.querySelectorAll('.related-product-card');
    relatedProducts.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            window.location.href = 'product-details.html';
        });
    });
}

// =========================================
// SMOOTH SCROLL
// =========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// =========================================
// CATEGORY SIDEBAR NAVIGATION
// =========================================

function initCategorySidebar() {
    const categories = document.querySelectorAll('.categories-sidebar li');
    
    categories.forEach(category => {
        category.addEventListener('click', () => {
            categories.forEach(c => c.classList.remove('active'));
            category.classList.add('active');
            
            const categoryName = category.textContent.trim();
            showToast(`Category: ${categoryName}`, 'info');
        });
    });
}

// =========================================
// SUPPLIER BUTTONS
// =========================================

function initSupplierButtons() {
    const sendInquiryBtn = document.querySelector('.btn-supplier');
    const sellerProfileBtn = document.querySelector('.btn-profile');

    if (sendInquiryBtn) {
        sendInquiryBtn.addEventListener('click', () => {
            showToast('Inquiry form opened', 'info');
        });
    }

    if (sellerProfileBtn) {
        sellerProfileBtn.addEventListener('click', () => {
            showToast('Navigating to seller profile...', 'info');
        });
    }
}

// =========================================
// MOBILE MENU FUNCTIONALITY
// =========================================

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileOverlay = document.getElementById('mobile-overlay');

    if (!mobileMenuBtn || !mobileMenu) return;

    // Open mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        if (mobileOverlay) mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close mobile menu
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-menu-nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
}

// =========================================
// INITIALIZE ALL FUNCTIONS
// =========================================

function init() {
    initCountdown();
    initSearchBar();
    initDropdowns();
    initViewToggles();
    initImageGallery();
    initSizeSelector();
    initColorSelector();
    initTabs();
    initCart();
    initWishlist();
    initForms();
    initPagination();
    initFilters();
    initSort();
    initHoverEffects();
    initSmoothScroll();
    initCategorySidebar();
    initSupplierButtons();
    initMobileMenu();
    initClickableCards();
    
    console.log('E-Commerce Website initialized successfully!');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
