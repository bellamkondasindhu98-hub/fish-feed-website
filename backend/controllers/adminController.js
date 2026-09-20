const { ProductModel, UserModel, ReviewModel, FeedbackModel, CompanyModel } = require('../models');

const adminController = {
    // GET /api/admin/metrics
    getDashboardMetrics: (req, res, next) => {
        try {
            const productMetrics = ProductModel.countMetrics();
            const totalCustomers = UserModel.countCustomers();
            const totalReviews = ReviewModel.countTotal();
            const totalFeedback = FeedbackModel.countTotal();

            return res.status(200).json({
                success: true,
                data: {
                    totalProducts: productMetrics.total,
                    availableProducts: productMetrics.available,
                    outOfStockProducts: productMetrics.outOfStock,
                    totalCustomers,
                    totalReviews,
                    totalFeedback
                }
            });
        } catch (err) {
            next(err);
        }
    },

    // GET /api/admin/customers
    getCustomers: (req, res, next) => {
        try {
            const customers = UserModel.getAllCustomers();
            return res.status(200).json({
                success: true,
                count: customers.length,
                data: customers
            });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = adminController;
