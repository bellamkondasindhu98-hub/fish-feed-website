const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.get('/metrics', verifyToken, requireAdmin, adminController.getDashboardMetrics);
router.get('/customers', verifyToken, requireAdmin, adminController.getCustomers);

module.exports = router;
