const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { verifyToken, requireAdmin, optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, feedbackController.submitFeedback);
router.get('/', verifyToken, requireAdmin, feedbackController.getAllFeedback);

module.exports = router;
