const { FeedbackModel } = require('../models');
const { isValidEmail } = require('../utils/validators');

const feedbackController = {
    // POST /api/feedback
    submitFeedback: (req, res, next) => {
        try {
            const { name, email, rating, message } = req.body;
            if (!name || !email || !message) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide your name, email, and message.'
                });
            }

            if (!isValidEmail(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Please enter a valid email address.'
                });
            }

            const numRating = Number(rating || 5);
            const feedback = FeedbackModel.create({
                userId: req.user ? req.user.id : null,
                name,
                email,
                rating: numRating,
                message
            });

            return res.status(201).json({
                success: true,
                message: 'Thank you for your valuable feedback! We continuously work to improve your experience.',
                data: feedback
            });
        } catch (err) {
            next(err);
        }
    },

    // GET /api/feedback (Admin)
    getAllFeedback: (req, res, next) => {
        try {
            const list = FeedbackModel.getAll();
            return res.status(200).json({
                success: true,
                count: list.length,
                data: list
            });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = feedbackController;
