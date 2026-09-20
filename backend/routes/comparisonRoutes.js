const express = require('express');
const router = express.Router();
const comparisonController = require('../controllers/comparisonController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.get('/', comparisonController.getAllComparisons);
router.get('/product/:productId', comparisonController.getByProduct);
router.post('/', verifyToken, requireAdmin, comparisonController.createComparison);
router.put('/:id', verifyToken, requireAdmin, comparisonController.updateComparison);
router.delete('/:id', verifyToken, requireAdmin, comparisonController.deleteComparison);

module.exports = router;
