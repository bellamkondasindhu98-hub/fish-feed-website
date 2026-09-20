const { verifyJwtToken } = require('../utils/jwt');
const { getDb } = require('../config/db');

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. Authentication token is missing.'
        });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyJwtToken(token);

    if (!decoded) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired authentication session. Please login again.'
        });
    }

    // Verify user still exists in database
    const db = getDb();
    const user = db.prepare('SELECT id, name, email, phone, role, profileImage FROM users WHERE id = ?').get(decoded.id);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'User account not found or has been deactivated.'
        });
    }

    req.user = user;
    next();
}

function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({
            success: false,
            message: 'Access forbidden. Administrator privileges required.'
        });
    }
    next();
}

// Optional auth: attaches user if token present, but doesn't block if absent
function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = verifyJwtToken(token);
        if (decoded) {
            const db = getDb();
            const user = db.prepare('SELECT id, name, email, phone, role, profileImage FROM users WHERE id = ?').get(decoded.id);
            if (user) {
                req.user = user;
            }
        }
    }
    next();
}

module.exports = {
    verifyToken,
    requireAdmin,
    optionalAuth
};
