const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.get('/', companyController.getCompany);
router.put('/', verifyToken, requireAdmin, companyController.updateCompany);

module.exports = router;
