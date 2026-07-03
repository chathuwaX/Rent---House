/* =========================================================
 * Negombo House Rentals – House Details Page Logic
 * Handles: image gallery, facility rendering, booking/message
 * form submissions via WhatsApp. (Static – no server needed)
 * ========================================================= */

let currentImageIndex = 0;
let houseImages = [];

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const houseId = params.get('id');

    if (!houseId) {
        showToast('No house selected. Redirecting...', 'warning');
        setTimeout(() => window.location.href = 'houses.html', 2000);
        return;
    }

    const house = getHouseById(houseId);
    if (!house) {
        showToast('Property not found.', 'error');
        document.getElementById('houseTitle').textContent = 'Property Not Found';
        return;
    }

    renderHouseDetails(house);
    initGallery(house.images || []);
    setupForms(houseId);
});

// ── Render House Details ─────────────────────────────────────

function renderHouseDetails(house) {
    // Update title & breadcrumb
    document.title = `${house.title} – Negombo House Rentals`;
    document.getElementById('breadcrumbTitle').textContent = house.title;
    document.getElementById('houseTitle').textContent = house.title;
    document.getElementById('housePrice').innerHTML = `${formatPrice(house.price)} <span>/ month</span>`;
    document.getElementById('houseDescription').textContent = house.description || '';

    // Set house IDs in forms
    const bookingHouseId = document.getElementById('bookingHouseId');
    const msgHouseId = document.getElementById('msgHouseId');
    if (bookingHouseId) bookingHouseId.value = house.id;
    if (msgHouseId) msgHouseId.value = house.id;

    // Set Google Profile Link
    const googleProfileBtn = document.getElementById('googleProfileBtn');
    if (googleProfileBtn && house.google_link) {
        googleProfileBtn.href = house.google_link;
        googleProfileBtn.style.display = 'inline-flex';
    }

    // Render facilities
    const facilities = [];
    if (house.bedrooms) facilities.push({ icon: '🛏️', label: `${house.bedrooms} Bedrooms` });
    if (house.bathrooms) facilities.push({ icon: '🚿', label: `${house.bathrooms} Bathrooms` });
    if (house.has_kitchen) facilities.push({ icon: '🍳', label: 'Modern Kitchen' });
    if (house.has_parking) facilities.push({ icon: '🚗', label: 'Private Parking' });
    if (house.has_water) facilities.push({ icon: '💧', label: '24/7 Water Supply' });
    if (house.has_electricity) facilities.push({ icon: '⚡', label: 'Electricity Included' });

    const facilitiesGrid = document.getElementById('facilitiesGrid');
    if (facilitiesGrid) {
        facilitiesGrid.innerHTML = facilities.map(f => `
      <div class="facility-card">
        <div class="icon">${f.icon}</div>
        <div class="label">${f.label}</div>
      </div>
    `).join('');
    }
}

// ── Image Gallery ────────────────────────────────────────────

function initGallery(images) {
    houseImages = images;
    const mainContainer = document.getElementById('galleryMain');
    const thumbsContainer = document.getElementById('galleryThumbs');

    if (!mainContainer || images.length === 0) return;

    // Render main images
    mainContainer.innerHTML = images.map((img, i) => `
    <img src="${img.image_url}" alt="${img.alt_text || 'House photo'}" 
         class="${i === 0 ? '' : 'hidden'}" data-index="${i}">
  `).join('');

    // Render thumbnails
    if (thumbsContainer) {
        thumbsContainer.innerHTML = images.map((img, i) => `
      <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-index="${i}" onclick="goToImage(${i})">
        <img src="${img.image_url}" alt="${img.alt_text || 'Thumbnail'}">
      </div>
    `).join('');
    }

    // Button event listeners
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    if (prevBtn) prevBtn.addEventListener('click', () => changeImage(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changeImage(1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') changeImage(-1);
        if (e.key === 'ArrowRight') changeImage(1);
    });

    // Auto-play (every 5 seconds)
    setInterval(() => changeImage(1), 5000);
}

function changeImage(direction) {
    const total = houseImages.length;
    if (total === 0) return;

    currentImageIndex = (currentImageIndex + direction + total) % total;
    goToImage(currentImageIndex);
}

function goToImage(index) {
    currentImageIndex = index;
    const mainContainer = document.getElementById('galleryMain');
    const thumbsContainer = document.getElementById('galleryThumbs');

    if (mainContainer) {
        mainContainer.querySelectorAll('img').forEach((img, i) => {
            img.classList.toggle('hidden', i !== index);
        });
    }

    if (thumbsContainer) {
        thumbsContainer.querySelectorAll('.gallery-thumb').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }
}

// ── Form Setup ───────────────────────────────────────────────

function setupForms(houseId) {
    // ── Booking Form ──
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearAllErrors(bookingForm);

            const name = document.getElementById('bookingName').value.trim();
            const phone = document.getElementById('bookingPhone').value.trim();
            const email = document.getElementById('bookingEmail').value.trim();
            const date = document.getElementById('bookingDate').value;
            const message = document.getElementById('bookingMessage').value.trim();

            // Validate
            let hasError = false;
            if (name.length < 2) { showFieldError('bookingName', 'bookingNameError', 'Name must be at least 2 characters.'); hasError = true; }
            if (!isValidPhone(phone)) { showFieldError('bookingPhone', 'bookingPhoneError', 'Enter a valid phone number.'); hasError = true; }
            if (!isValidEmail(email)) { showFieldError('bookingEmail', 'bookingEmailError', 'Enter a valid email address.'); hasError = true; }
            if (hasError) return;

            showToast('Redirecting to WhatsApp...', 'success');
            
            const whatsappNumber = '+33665206412';
            const houseTitle = document.getElementById('houseTitle').textContent;
            
            const waText = `Hello! I would like to book a property.\n\nProperty: ${houseTitle}\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nPreferred Date: ${date || 'Not specified'}\nMessage: ${message || 'None'}`;
            const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waText)}`;
            window.open(waUrl, '_blank');
            
            bookingForm.reset();
            document.getElementById('bookingHouseId').value = houseId;
        });
    }

    // ── Message Form ──
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearAllErrors(messageForm);

            const name = document.getElementById('msgName').value.trim();
            const phone = document.getElementById('msgPhone').value.trim();
            const email = document.getElementById('msgEmail').value.trim();
            const message = document.getElementById('msgMessage').value.trim();

            // Validate
            let hasError = false;
            if (name.length < 2) { showFieldError('msgName', 'msgNameError', 'Name must be at least 2 characters.'); hasError = true; }
            if (!isValidEmail(email)) { showFieldError('msgEmail', 'msgEmailError', 'Enter a valid email address.'); hasError = true; }
            if (message.length < 5) { showFieldError('msgMessage', 'msgMessageError', 'Message must be at least 5 characters.'); hasError = true; }
            if (hasError) return;

            showToast('Redirecting to WhatsApp...', 'success');
            
            const whatsappNumber = '+33665206412';
            const houseTitle = document.getElementById('houseTitle').textContent;
            
            const waText = `Hello! I have a question about a property.\n\nProperty: ${houseTitle}\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`;
            const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waText)}`;
            window.open(waUrl, '_blank');
            
            messageForm.reset();
            document.getElementById('msgHouseId').value = houseId;
        });
    }
}
