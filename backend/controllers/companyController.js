const { CompanyModel } = require('../models');

const companyController = {
    // GET /api/company
    getCompany: (req, res, next) => {
        try {
            const company = CompanyModel.get();
            if (!company) {
                return res.status(404).json({
                    success: false,
                    message: 'Company profile not initialized.'
                });
            }

            return res.status(200).json({
                success: true,
                data: company
            });
        } catch (err) {
            next(err);
        }
    },

    // PUT /api/company (Admin)
    updateCompany: (req, res, next) => {
        try {
            const updated = CompanyModel.update(req.body);
            return res.status(200).json({
                success: true,
                message: 'Company details and contact configuration updated successfully.',
                data: updated
            });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = companyController;
