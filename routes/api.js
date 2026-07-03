/* =========================================================
 * Negombo House Rentals – API Routes (sql.js compatible)
 * RESTful endpoints for houses, bookings, and messages.
 * All queries use parameterized statements (SQL injection safe).
 * ========================================================= */

const express = require('express');
const router = express.Router();
const { getDb, saveDb } = require('../db/database');

// ── Validation Helpers ───────────────────────────────────────

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[\d\s\+\-()]{7,20}$/.test(phone);
}

function sanitize(str) {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Helper: run a SELECT query and return array of objects.
 * sql.js returns { columns: [...], values: [[...], ...] }
 */
function queryAll(sql, params = []) {
    const db = getDb();
    const stmt = db.prepare(sql);
    if (params.length) stmt.bind(params);

    const rows = [];
    while (stmt.step()) {
        rows.push(stmt.getAsObject());
    }
    stmt.free();
    return rows;
}

/**
 * Helper: run a SELECT query and return first row as object.
 */
function queryOne(sql, params = []) {
    const rows = queryAll(sql, params);
    return rows[0] || null;
}

// ── GET /api/houses ──────────────────────────────────────────
router.get('/houses', (req, res) => {
    try {
        const houses = queryAll(`
      SELECT h.*,
             (SELECT image_url FROM house_images WHERE house_id = h.id ORDER BY sort_order LIMIT 1) AS thumbnail
      FROM houses h
      ORDER BY h.id
    `);
        res.json({ success: true, data: houses });
    } catch (err) {
        console.error('Error fetching houses:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch houses.' });
    }
});

// ── GET /api/houses/:id ──────────────────────────────────────
router.get('/houses/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid house ID.' });

        const house = queryOne('SELECT * FROM houses WHERE id = ?', [id]);
        if (!house) return res.status(404).json({ success: false, error: 'House not found.' });

        const images = queryAll('SELECT * FROM house_images WHERE house_id = ? ORDER BY sort_order', [id]);
        house.images = images;

        res.json({ success: true, data: house });
    } catch (err) {
        console.error('Error fetching house:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch house details.' });
    }
});

// ── POST /api/bookings ───────────────────────────────────────
router.post('/bookings', (req, res) => {
    try {
        const db = getDb();
        const { house_id, full_name, phone, email, preferred_date, message } = req.body;

        // Validation
        const errors = [];
        if (!full_name || full_name.trim().length < 2) errors.push('Full name is required (min 2 characters).');
        if (!phone || !isValidPhone(phone)) errors.push('Valid phone number is required.');
        if (!email || !isValidEmail(email)) errors.push('Valid email address is required.');
        if (!house_id) errors.push('Please select a house.');

        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        db.run(
            `INSERT INTO bookings (house_id, full_name, phone, email, preferred_date, message)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [parseInt(house_id, 10), sanitize(full_name), sanitize(phone), sanitize(email), sanitize(preferred_date || ''), sanitize(message || '')]
        );

        saveDb();

        const idResult = db.exec('SELECT last_insert_rowid()');
        const bookingId = idResult[0]?.values[0]?.[0];

        res.status(201).json({
            success: true,
            message: 'Booking request submitted successfully! We will contact you shortly.',
            bookingId
        });
    } catch (err) {
        console.error('Error creating booking:', err);
        res.status(500).json({ success: false, error: 'Failed to submit booking.' });
    }
});

// ── POST /api/messages ───────────────────────────────────────
router.post('/messages', (req, res) => {
    try {
        const db = getDb();
        const { house_id, full_name, phone, email, message } = req.body;

        // Validation
        const errors = [];
        if (!full_name || full_name.trim().length < 2) errors.push('Full name is required (min 2 characters).');
        if (!email || !isValidEmail(email)) errors.push('Valid email address is required.');
        if (!message || message.trim().length < 5) errors.push('Message is required (min 5 characters).');

        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        db.run(
            `INSERT INTO messages (house_id, full_name, phone, email, message)
       VALUES (?, ?, ?, ?, ?)`,
            [house_id ? parseInt(house_id, 10) : null, sanitize(full_name), sanitize(phone || ''), sanitize(email), sanitize(message)]
        );

        saveDb();

        const idResult = db.exec('SELECT last_insert_rowid()');
        const messageId = idResult[0]?.values[0]?.[0];

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully! We will get back to you soon.',
            messageId
        });
    } catch (err) {
        console.error('Error creating message:', err);
        res.status(500).json({ success: false, error: 'Failed to send message.' });
    }
});

// ── GET /api/admin/bookings ──────────────────────────────────
router.get('/admin/bookings', (req, res) => {
    try {
        const bookings = queryAll(`
      SELECT b.*, h.title AS house_title
      FROM bookings b
      LEFT JOIN houses h ON b.house_id = h.id
      ORDER BY b.created_at DESC
    `);
        res.json({ success: true, data: bookings });
    } catch (err) {
        console.error('Error fetching bookings:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch bookings.' });
    }
});

// ── GET /api/admin/messages ──────────────────────────────────
router.get('/admin/messages', (req, res) => {
    try {
        const messages = queryAll(`
      SELECT m.*, h.title AS house_title
      FROM messages m
      LEFT JOIN houses h ON m.house_id = h.id
      ORDER BY m.created_at DESC
    `);
        res.json({ success: true, data: messages });
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch messages.' });
    }
});

module.exports = router;
