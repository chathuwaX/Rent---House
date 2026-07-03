/* =========================================================
 * Negombo House Rentals – Admin Dashboard Logic
 * Password gate, tab switching.
 * Since all bookings/messages go to WhatsApp, the admin
 * dashboard shows instructions to check WhatsApp.
 * (Static – no server needed)
 * ========================================================= */

const ADMIN_PASSWORD = 'admin123';

document.addEventListener('DOMContentLoaded', () => {
    setupAdminLogin();
    setupAdminTabs();
});

// ── Admin Login Gate ─────────────────────────────────────────

function setupAdminLogin() {
    const form = document.getElementById('adminLoginForm');
    if (!form) return;

    // Check if already logged in (session)
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        showDashboard();
        return;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;
        const errorEl = document.getElementById('adminPasswordError');

        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            showDashboard();
            showToast('Welcome to the admin dashboard!', 'success');
        } else {
            errorEl.textContent = 'Incorrect password. Please try again.';
            errorEl.classList.add('show');
            document.getElementById('adminPassword').classList.add('error');
        }
    });
}

// ── Show Dashboard ───────────────────────────────────────────

function showDashboard() {
    const loginSection = document.getElementById('adminLoginSection');
    const dashboard = document.getElementById('adminDashboard');

    if (loginSection) loginSection.style.display = 'none';
    if (dashboard) dashboard.style.display = 'block';

    // Show WhatsApp info in tables
    showWhatsAppInfo();
}

// ── Tab Switching ────────────────────────────────────────────

function setupAdminTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            // Update tab active state
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show/hide panels
            document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
            const panel = document.getElementById(`panel${targetTab.charAt(0).toUpperCase() + targetTab.slice(1)}`);
            if (panel) panel.classList.add('active');
        });
    });
}

// ── Show WhatsApp Info ───────────────────────────────────────

function showWhatsAppInfo() {
    const bookingsTbody = document.getElementById('bookingsTableBody');
    const messagesTbody = document.getElementById('messagesTableBody');
    const totalBookings = document.getElementById('totalBookings');
    const totalMessages = document.getElementById('totalMessages');

    if (totalBookings) totalBookings.textContent = '📱';
    if (totalMessages) totalMessages.textContent = '📱';

    const whatsappMsg = `
      <tr class="empty-row">
        <td colspan="9" style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 3rem; margin-bottom: 15px;">📱</div>
          <strong style="font-size: 1.1rem;">All bookings and messages are sent to WhatsApp</strong><br><br>
          <p style="color: var(--text-light); max-width: 500px; margin: 0 auto;">
            Check your WhatsApp chat for new booking requests and messages from customers.
            All form submissions are redirected directly to your WhatsApp number.
          </p>
          <br>
          <a href="https://wa.me/+33665206412" target="_blank" 
             style="display: inline-block; padding: 10px 25px; background: #25D366; color: white; border-radius: 8px; text-decoration: none; font-weight: 600;">
            📱 Open WhatsApp
          </a>
        </td>
      </tr>
    `;

    if (bookingsTbody) bookingsTbody.innerHTML = whatsappMsg;
    if (messagesTbody) messagesTbody.innerHTML = whatsappMsg.replace('colspan="9"', 'colspan="7"');
}

// ── HTML Escape ──────────────────────────────────────────────

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
