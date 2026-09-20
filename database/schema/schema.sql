-- ==========================================================
-- FISH FEED COMPANY - SQL SCHEMA (SQLite / PostgreSQL compatible)
-- ==========================================================

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'ADMIN')),
    profileImage TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    packSize TEXT NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    fishType TEXT NOT NULL,
    protein REAL NOT NULL,
    fat REAL NOT NULL,
    feedType TEXT NOT NULL,
    recommendedFishSize TEXT NOT NULL,
    feedingInstructions TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'IN_STOCK' CHECK (status IN ('IN_STOCK', 'OUT_OF_STOCK')),
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    isApproved INTEGER NOT NULL DEFAULT 1 CHECK (isApproved IN (0, 1)),
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS company (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    companyName TEXT NOT NULL,
    logo TEXT NOT NULL,
    description TEXT NOT NULL,
    gstNumber TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsappNumber TEXT NOT NULL,
    ceoName TEXT NOT NULL,
    ceoImage TEXT NOT NULL,
    ceoPhone TEXT NOT NULL,
    ceoEmail TEXT NOT NULL,
    ceoBio TEXT NOT NULL,
    mission TEXT NOT NULL,
    vision TEXT NOT NULL,
    whyChooseUs TEXT NOT NULL,
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    sortOrder INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS website_feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    message TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS comparison_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER NOT NULL,
    competitorName TEXT NOT NULL,
    competitorProductName TEXT NOT NULL,
    price REAL NOT NULL,
    packSize TEXT NOT NULL,
    protein REAL NOT NULL,
    fat REAL NOT NULL,
    fishType TEXT NOT NULL,
    feedType TEXT NOT NULL,
    rating REAL NOT NULL DEFAULT 4.0,
    source TEXT NOT NULL DEFAULT 'Market Benchmark',
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_fishType ON products(fishType);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_reviews_productId ON reviews(productId);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
