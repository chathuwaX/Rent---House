/* =========================================================
 * Negombo House Rentals – Shared App Utilities
 * Common functions: toast notifications, form validation,
 * mobile nav toggle. (Static version – no API server needed)
 * ========================================================= */

// ── Toast Notifications ──────────────────────────────────────

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'success'|'error'|'warning'} type
 * @param {number} duration – ms before auto-remove
 */
function showToast(message, type = 'success', duration = 5000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = { success: '✅', error: '❌', warning: '⚠️' };
    toast.innerHTML = `<span>${icons[type] || ''}</span> ${message}`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ── Form Validation ──────────────────────────────────────────

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[\d\s\+\-()]{7,20}$/.test(phone);
}

/**
 * Show/clear a field error.
 */
function showFieldError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(errorId);
    if (field) field.classList.add('error');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('show');
    }
}

function clearFieldError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(errorId);
    if (field) field.classList.remove('error');
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('show');
    }
}

function clearAllErrors(form) {
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.error-msg').forEach(el => {
        el.textContent = '';
        el.classList.remove('show');
    });
}

// ── Format Currency ──────────────────────────────────────────

function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

// ── Format Date ──────────────────────────────────────────────

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

// ── Mobile Nav Toggle ────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    if (toggle && links) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            links.classList.toggle('active');
        });

        // Close nav when a link is clicked
        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                toggle.classList.remove('active');
                links.classList.remove('active');
            });
        });
    }

    // Scroll-based navbar opacity
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(26, 39, 68, 0.98)';
            } else {
                navbar.style.background = 'rgba(26, 39, 68, 0.95)';
            }
        });
    }
});

// ── Create House Card HTML ───────────────────────────────────

function createHouseCard(house) {
    const thumbnail = house.thumbnail || 'images/house1-1.jpg';
    return `
    <div class="house-card fade-in" onclick="window.location.href='house-details.html?id=${house.id}'">
      <div class="house-card__image">
        <img src="${thumbnail}" alt="${house.title}" loading="lazy">
        <div class="house-card__badge">For Rent</div>
      </div>
      <div class="house-card__body">
        <div class="house-card__location">📍 ${house.location || 'Negombo, Sri Lanka'}</div>
        <h3 class="house-card__title">${house.title}</h3>
        <p class="house-card__description">${house.description || ''}</p>
        <div class="house-card__facilities">
          <div class="facility"><span class="facility-icon">🛏️</span> ${house.bedrooms} Beds</div>
          <div class="facility"><span class="facility-icon">🚿</span> ${house.bathrooms} Baths</div>
          ${house.has_parking ? '<div class="facility"><span class="facility-icon">🚗</span> Parking</div>' : ''}
        </div>
        <div class="house-card__footer">
          <div class="house-card__price">${formatPrice(house.price)} <span>/ month</span></div>
          <a href="house-details.html?id=${house.id}" class="btn btn-sm btn-primary">View Details</a>
        </div>
      </div>
    </div>
  `;
}
