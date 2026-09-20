const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const env = require('./config/env');
const { getDb } = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const companyRoutes = require('./routes/companyRoutes');
const faqRoutes = require('./routes/faqRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const comparisonRoutes = require('./routes/comparisonRoutes');
const adminRoutes = require('./routes/adminRoutes');

const { notFoundHandler, errorHandler } = require('./middleware/error');

const app = express();

// Security Headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes.'
    }
});
app.use('/api/', limiter);

// Serve Static Uploads
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        service: 'Fish Feed Company Backend API',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/comparisons', comparisonRoutes);
app.use('/api/admin', adminRoutes);

// 404 and Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize DB & Start Server
try {
    getDb(); // Ensure database tables are created & seeded
    console.log('📦 Database connection active.');

    const PORT = env.PORT;
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 AquaGrow Fish Feed Server running on http://0.0.0.0:${PORT}`);
        console.log(`📡 REST API available at http://localhost:${PORT}/api`);
    });

    module.exports = { app, server };
} catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
}
