/* =========================================================
 * Negombo House Rentals – Booking Page Logic
 * Populates house dropdown from embedded data, handles
 * booking form and quick message form via WhatsApp.
 * (Static – no server needed)
 * ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    populateHouseDropdown();
    setupBookingPageForms();
});

// ── Populate House Selector ──────────────────────────────────

function populateHouseDropdown() {
    const select = document.getElementById('selectHouse');
    if (!select) return;

    const houses = getAllHouses();
    houses.forEach(house => {
        const opt = document.createElement('option');
        opt.value = house.id;
        opt.textContent = `${house.title} – ${formatPrice(house.price)}/month`;
        select.appendChild(opt);
    });

    // Pre-select if coming from a house details page
    const params = new URLSearchParams(window.location.search);
    const preselect = params.get('house');
    if (preselect) select.value = preselect;
}

// ── Form Handlers ────────────────────────────────────────────

function setupBookingPageForms() {
    // ── Main Booking Form ──
    const bookingForm = document.getElementById('bookingFormPage');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearAllErrors(bookingForm);

            const houseId = document.getElementById('selectHouse').value;
            const name = document.getElementById('bpName').value.trim();
            const phone = document.getElementById('bpPhone').value.trim();
            const email = document.getElementById('bpEmail').value.trim();
            const date = document.getElementById('bpDate').value;
            const message = document.getElementById('bpMessage').value.trim();

            // Validate
            let hasError = false;
            if (!houseId) { showFieldError('selectHouse', 'selectHouseError', 'Please select a property.'); hasError = true; }
            if (name.length < 2) { showFieldError('bpName', 'bpNameError', 'Name must be at least 2 characters.'); hasError = true; }
            if (!isValidPhone(phone)) { showFieldError('bpPhone', 'bpPhoneError', 'Enter a valid phone number.'); hasError = true; }
            if (!isValidEmail(email)) { showFieldError('bpEmail', 'bpEmailError', 'Enter a valid email address.'); hasError = true; }
            if (hasError) return;

            // Disable button during submission
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            showToast('Redirecting to WhatsApp...', 'success');

            const whatsappNumber = '+33665206412';
            const houseSelect = document.getElementById('selectHouse');
            const houseTitle = houseSelect.options[houseSelect.selectedIndex].text;

            const waText = `Hello! I would like to book a property.\n\nProperty: ${houseTitle}\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nPreferred Date: ${date || 'Not specified'}\nMessage: ${message || 'None'}`;
            const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waText)}`;
            window.open(waUrl, '_blank');

            bookingForm.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Booking Request';
        });
    }

    // ── Quick Message Form ──
    const msgForm = document.getElementById('quickMessageForm');
    if (msgForm) {
        msgForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('qmName').value.trim();
            const email = document.getElementById('qmEmail').value.trim();
            const message = document.getElementById('qmMessage').value.trim();

            if (name.length < 2 || !isValidEmail(email) || message.length < 5) {
                showToast('Please fill all fields correctly.', 'error');
                return;
            }

            const submitBtn = msgForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            showToast('Redirecting to WhatsApp...', 'success');

            const whatsappNumber = '+33665206412';
            const waText = `Hello! I have a general inquiry.\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
            const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waText)}`;
            window.open(waUrl, '_blank');

            msgForm.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        });
    }
}
