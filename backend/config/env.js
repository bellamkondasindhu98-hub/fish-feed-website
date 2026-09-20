const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

module.exports = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_PATH: process.env.DATABASE_URL || path.resolve(__dirname, '../fish_feed.db'),
    JWT_SECRET: process.env.JWT_SECRET || 'aquagrow_super_secure_jwt_secret_key_2026_x89!',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    COMPANY_WHATSAPP_NUMBER: process.env.COMPANY_WHATSAPP_NUMBER || '+919876543210',
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};
