const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.get('/admin', verifyToken, requireAdmin, reviewController.getAllReviewsForAdmin);
router.patch('/:id/approve', verifyToken, requireAdmin, reviewController.toggleApproval);
router.delete('/:id', verifyToken, requireAdmin, reviewController.deleteReview);

module.exports = router;
