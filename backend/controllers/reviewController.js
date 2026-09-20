const { ReviewModel } = require('../models');

const reviewController = {
    // GET /api/products/:id/reviews
    getProductReviews: (req, res, next) => {
        try {
            const { id } = req.params;
            const reviews = ReviewModel.getByProductId(id);
            return res.status(200).json({
                success: true,
                count: reviews.length,
                data: reviews
            });
        } catch (err) {
            next(err);
        }
    },

    // POST /api/products/:id/reviews (Authenticated)
    addReview: (req, res, next) => {
        try {
            const { id } = req.params;
            const { rating, comment } = req.body;

            if (!rating || !comment) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide both a star rating (1-5) and your review comments.'
                });
            }

            const numRating = Number(rating);
            if (numRating < 1 || numRating > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating must be an integer between 1 and 5.'
                });
            }

            const newReview = ReviewModel.create({
                userId: req.user.id,
                productId: id,
                rating: numRating,
                comment
            });

            return res.status(201).json({
                success: true,
                message: 'Thank you! Your verified feedback has been published.',
                data: newReview
            });
        } catch (err) {
            next(err);
        }
    },

    // GET /api/reviews/admin (Admin)
    getAllReviewsForAdmin: (req, res, next) => {
        try {
            const reviews = ReviewModel.getAllForAdmin();
            return res.status(200).json({
                success: true,
                count: reviews.length,
                data: reviews
            });
        } catch (err) {
            next(err);
        }
    },

    // PATCH /api/reviews/:id/approve (Admin)
    toggleApproval: (req, res, next) => {
        try {
            const { id } = req.params;
            const { isApproved } = req.body;

            const updated = ReviewModel.setApproval(id, isApproved);
            return res.status(200).json({
                success: true,
                message: `Review ${isApproved ? 'approved' : 'hidden'}.`,
                data: updated
            });
        } catch (err) {
            next(err);
        }
    },

    // DELETE /api/reviews/:id (Admin)
    deleteReview: (req, res, next) => {
        try {
            const { id } = req.params;
            const result = ReviewModel.delete(id);

            if (result.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Review not found.'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Review deleted successfully.'
            });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = reviewController;
