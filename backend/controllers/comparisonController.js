const { ComparisonModel } = require('../models');

const comparisonController = {
    // GET /api/comparisons
    getAllComparisons: (req, res, next) => {
        try {
            const list = ComparisonModel.getAll();
            return res.status(200).json({
                success: true,
                count: list.length,
                data: list
            });
        } catch (err) {
            next(err);
        }
    },

    // GET /api/comparisons/product/:productId
    getByProduct: (req, res, next) => {
        try {
            const { productId } = req.params;
            const list = ComparisonModel.getByProductId(productId);
            return res.status(200).json({
                success: true,
                count: list.length,
                data: list
            });
        } catch (err) {
            next(err);
        }
    },

    // POST /api/comparisons (Admin)
    createComparison: (req, res, next) => {
        try {
            const item = ComparisonModel.create(req.body);
            return res.status(201).json({
                success: true,
                message: 'Competitor comparison benchmark added.',
                data: item
            });
        } catch (err) {
            next(err);
        }
    },

    // PUT /api/comparisons/:id (Admin)
    updateComparison: (req, res, next) => {
        try {
            const { id } = req.params;
            const updated = ComparisonModel.update(id, req.body);
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Comparison record not found.'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Comparison record updated.',
                data: updated
            });
        } catch (err) {
            next(err);
        }
    },

    // DELETE /api/comparisons/:id (Admin)
    deleteComparison: (req, res, next) => {
        try {
            const { id } = req.params;
            const result = ComparisonModel.delete(id);
            if (result.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Comparison record not found.'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Comparison record deleted.'
            });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = comparisonController;
