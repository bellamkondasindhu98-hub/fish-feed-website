const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.get('/', faqController.getAllFaqs);
router.post('/', verifyToken, requireAdmin, faqController.createFaq);
router.put('/:id', verifyToken, requireAdmin, faqController.updateFaq);
router.delete('/:id', verifyToken, requireAdmin, faqController.deleteFaq);

module.exports = router;
