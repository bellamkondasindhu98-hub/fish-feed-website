const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const reviewController = require('../controllers/reviewController');
const { verifyToken, requireAdmin, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes (though front-end auth gate protects main app, APIs can be called with auth token)
router.get('/', optionalAuth, productController.getAllProducts);
router.get('/search', optionalAuth, productController.searchProducts);
router.get('/:id', optionalAuth, productController.getProductById);
router.get('/:id/recommendations', optionalAuth, productController.getRecommendations);

// Product reviews
router.get('/:id/reviews', optionalAuth, reviewController.getProductReviews);
router.post('/:id/reviews', verifyToken, reviewController.addReview);

// Admin product routes
router.post('/', verifyToken, requireAdmin, upload.single('imageFile'), productController.createProduct);
router.put('/:id', verifyToken, requireAdmin, upload.single('imageFile'), productController.updateProduct);
router.patch('/:id/stock', verifyToken, requireAdmin, productController.updateStock);
router.delete('/:id', verifyToken, requireAdmin, productController.deleteProduct);

module.exports = router;
