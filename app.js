/* =========================================================
 * Negombo House Rentals – Express Server
 * Main entry point. Serves static files and mounts API routes.
 * ========================================================= */

const express = require('express');
const cors = require('cors');
const path = require('path');
const { init } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, Images)
app.use(express.static(path.join(__dirname, 'public')));

// ── API Routes ───────────────────────────────────────────────
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// ── Serve HTML pages for clean URLs ──────────────────────────
const htmlPages = ['houses', 'house-details', 'booking', 'admin'];
htmlPages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
        res.sendFile(path.join(__dirname, 'public', `${page}.html`));
    });
});

// ── Initialize Database & Start Server ───────────────────────
async function startServer() {
    try {
        await init();
        app.listen(PORT, () => {
            console.log(`🏠 Negombo House Rentals server running at http://localhost:${PORT}`);
            console.log(`📂 Serving static files from: ${path.join(__dirname, 'public')}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}

startServer();