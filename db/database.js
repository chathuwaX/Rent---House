/* =========================================================
 * Negombo House Rentals – Database Module (sql.js)
 * Uses sql.js for pure-JS SQLite (no native compilation).
 * Creates tables and seeds 3 sample houses on first run.
 * ========================================================= */

const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'rentals.db');

let db = null;

/**
 * Initialize the database – create tables & seed data if needed.
 */
async function init() {
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const SQL = await initSqlJs();

  // Load existing DB or create new one
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA foreign_keys = ON');

  // ── Create Tables ──────────────────────────────────────────
  db.run(`
    CREATE TABLE IF NOT EXISTS houses (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      title         TEXT    NOT NULL,
      price         REAL    NOT NULL,
      description   TEXT,
      bedrooms      INTEGER,
      bathrooms     INTEGER,
      has_kitchen   INTEGER DEFAULT 1,
      has_parking   INTEGER DEFAULT 1,
      has_water     INTEGER DEFAULT 1,
      has_electricity INTEGER DEFAULT 1,
      location      TEXT    DEFAULT 'Negombo, Sri Lanka',
      google_link   TEXT,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS house_images (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      house_id   INTEGER NOT NULL,
      image_url  TEXT    NOT NULL,
      alt_text   TEXT,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (house_id) REFERENCES houses(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      house_id       INTEGER,
      full_name      TEXT NOT NULL,
      phone          TEXT NOT NULL,
      email          TEXT NOT NULL,
      preferred_date TEXT,
      message        TEXT,
      status         TEXT DEFAULT 'pending',
      created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (house_id) REFERENCES houses(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      house_id   INTEGER,
      full_name  TEXT NOT NULL,
      phone      TEXT,
      email      TEXT NOT NULL,
      message    TEXT NOT NULL,
      is_read    INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (house_id) REFERENCES houses(id)
    )
  `);

  // ── Seed Data (only if houses table is empty) ──────────────
  const result = db.exec('SELECT COUNT(*) AS c FROM houses');
  const count = result[0]?.values[0]?.[0] || 0;
  if (count === 0) seedData();

  saveDb();
  console.log('✅ Database initialized successfully.');
  return db;
}

/**
 * Save database to disk.
 */
function saveDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

/**
 * Insert 3 sample houses with 5 images each.
 */
function seedData() {
  const houses = [
    {
      title: 'DALUWAKOTUWA VILLA',
      price: 995,
      description: 'A beautifully designed modern family house located in a quiet residential area of Negombo. Features spacious rooms, a well-equipped kitchen, private parking, and a lovely garden. Perfect for families looking for comfort and convenience, just 10 minutes from Negombo beach and close to schools, markets, and public transport.',
      bedrooms: 3, bathrooms: 2,
      has_kitchen: 1, has_parking: 1, has_water: 1, has_electricity: 1,
      location: 'Negombo, Sri Lanka',
      google_link: 'https://www.google.com/search?kgmid=/g/11y19j47nv&hl=en-LK&q=Indrajithhome&shndl=17&source=sh/x/kp/osrp/m1/2&kgs=56e086c4aa6c7d85&shem=shrtsdl&utm_source=shrtsdl,sh/x/kp/osrp/m1/2',
      images: [
        { url: '/images/DALUWAKOTUWA VILLA/1.jpg', alt: 'DALUWAKOTUWA VILLA – View 1' },
        { url: '/images/DALUWAKOTUWA VILLA/2.jpg', alt: 'DALUWAKOTUWA VILLA – View 2' },
        { url: '/images/DALUWAKOTUWA VILLA/3.jpg', alt: 'DALUWAKOTUWA VILLA – View 3' },
        { url: '/images/DALUWAKOTUWA VILLA/4.jpg', alt: 'DALUWAKOTUWA VILLA – View 4' },
        { url: '/images/DALUWAKOTUWA VILLA/5.jpg', alt: 'DALUWAKOTUWA VILLA – View 5' },
        { url: '/images/DALUWAKOTUWA VILLA/6.jpg', alt: 'DALUWAKOTUWA VILLA – View 6' },
      ]
    },
    {
      title: 'KOCHCHIKADE VILLA',
      price: 695,
      description: 'A charming beach-style villa with tropical vibes, located just a short walk from the Negombo coastline. Features natural wooden finishes, open-plan living, and a serene garden. Ideal for couples or small families who love the coastal lifestyle. Enjoy ocean breezes and stunning sunsets from the comfort of your own home.',
      bedrooms: 2, bathrooms: 1,
      has_kitchen: 1, has_parking: 1, has_water: 1, has_electricity: 1,
      location: 'Negombo, Sri Lanka',
      google_link: 'https://www.google.lk/search?kgmid=/g/11mkxtwzjr&hl=en-LK&q=Indrajith+Home&shndl=17&source=sh/x/kp/osrp/m1/2&kgs=ae74a70adbd7f374&shem=shrtsdl&utm_source=shrtsdl,sh/x/kp/osrp/m1/2',
      images: [
        { url: '/images/KOCHCHIKADE VILLA/1.jpg', alt: 'KOCHCHIKADE VILLA – View 1' },
        { url: '/images/KOCHCHIKADE VILLA/2.jpg', alt: 'KOCHCHIKADE VILLA – View 2' },
        { url: '/images/KOCHCHIKADE VILLA/3.jpg', alt: 'KOCHCHIKADE VILLA – View 3' },
        { url: '/images/KOCHCHIKADE VILLA/4.jpg', alt: 'KOCHCHIKADE VILLA – View 4' },
        { url: '/images/KOCHCHIKADE VILLA/5.jpg', alt: 'KOCHCHIKADE VILLA – View 5' },
        { url: '/images/KOCHCHIKADE VILLA/6.jpg', alt: 'KOCHCHIKADE VILLA – View 6' },
      ]
    },
    {
      title: 'PALANGATHURE VILLA',
      price: 995,
      description: 'A premium two-story home set in a lush tropical garden in one of Negombo\'s finest neighborhoods. Featuring 4 spacious bedrooms, 3 modern bathrooms, a gourmet kitchen, and ample parking for multiple vehicles. The expansive garden offers a private retreat with space for outdoor dining and relaxation. Close to international schools and Negombo town centre.',
      bedrooms: 4, bathrooms: 3,
      has_kitchen: 1, has_parking: 1, has_water: 1, has_electricity: 1,
      location: 'Negombo, Sri Lanka',
      google_link: 'https://www.google.com/search?kgmid=/g/11ylplh23s&hl=en-LK&q=Indrajith+Home+%231&shndl=17&source=sh/x/kp/osrp/m1/2&kgs=7618554f087b24be&shem=shrtsdl&utm_source=shrtsdl,sh/x/kp/osrp/m1/2',
      images: [
        { url: '/images/PALANGATHURE VILLA/1.jpg', alt: 'PALANGATHURE VILLA – View 1' },
        { url: '/images/PALANGATHURE VILLA/2.jpg', alt: 'PALANGATHURE VILLA – View 2' },
        { url: '/images/PALANGATHURE VILLA/3.jpg', alt: 'PALANGATHURE VILLA – View 3' },
        { url: '/images/PALANGATHURE VILLA/4.jpg', alt: 'PALANGATHURE VILLA – View 4' },
        { url: '/images/PALANGATHURE VILLA/5.jpg', alt: 'PALANGATHURE VILLA – View 5' },
        { url: '/images/PALANGATHURE VILLA/6.jpg', alt: 'PALANGATHURE VILLA – View 6' },
      ]
    }
  ];

  for (const h of houses) {
    db.run(
      `INSERT INTO houses (title, price, description, bedrooms, bathrooms, has_kitchen, has_parking, has_water, has_electricity, location, google_link)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [h.title, h.price, h.description, h.bedrooms, h.bathrooms, h.has_kitchen, h.has_parking, h.has_water, h.has_electricity, h.location, h.google_link]
    );

    // Get the last inserted house ID
    const idResult = db.exec('SELECT last_insert_rowid()');
    const houseId = idResult[0].values[0][0];

    h.images.forEach((img, i) => {
      db.run(
        'INSERT INTO house_images (house_id, image_url, alt_text, sort_order) VALUES (?, ?, ?, ?)',
        [houseId, img.url, img.alt, i]
      );
    });
  }

  saveDb();
  console.log('✅ Database seeded with 3 houses and 15 images.');
}

/**
 * Get the database instance.
 */
function getDb() {
  return db;
}

module.exports = { init, getDb, saveDb };
