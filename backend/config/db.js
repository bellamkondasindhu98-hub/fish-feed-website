const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const env = require('./env');
const { initAndSeedDatabase } = require('../../database/seed/seed');

let db;

function getDb() {
    if (!db) {
        const dbFile = env.DB_PATH;
        const dbDir = path.dirname(dbFile);
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        db = new Database(dbFile);
        db.pragma('foreign_keys = ON');

        // Check if database is initialized by verifying users table
        try {
            const check = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
            if (!check) {
                console.log('Database tables not detected. Executing initial schema and seed...');
                initAndSeedDatabase();
            }
        } catch (e) {
            console.error('Error during database check:', e.message);
            initAndSeedDatabase();
        }
    }
    return db;
}

module.exports = { getDb };
