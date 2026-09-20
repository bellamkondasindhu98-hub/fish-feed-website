const { FAQModel } = require('../models');

const faqController = {
    // GET /api/faqs
    getAllFaqs: (req, res, next) => {
        try {
            const faqs = FAQModel.getAll();
            return res.status(200).json({
                success: true,
                count: faqs.length,
                data: faqs
            });
        } catch (err) {
            next(err);
        }
    },

    // POST /api/faqs (Admin)
    createFaq: (req, res, next) => {
        try {
            const { question, answer, category, sortOrder } = req.body;
            if (!question || !answer) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide both question and answer.'
                });
            }

            const faq = FAQModel.create({ question, answer, category, sortOrder });
            return res.status(201).json({
                success: true,
                message: 'FAQ item created.',
                data: faq
            });
        } catch (err) {
            next(err);
        }
    },

    // PUT /api/faqs/:id (Admin)
    updateFaq: (req, res, next) => {
        try {
            const { id } = req.params;
            const updated = FAQModel.update(id, req.body);
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'FAQ not found.'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'FAQ updated successfully.',
                data: updated
            });
        } catch (err) {
            next(err);
        }
    },

    // DELETE /api/faqs/:id (Admin)
    deleteFaq: (req, res, next) => {
        try {
            const { id } = req.params;
            const result = FAQModel.delete(id);
            if (result.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'FAQ not found.'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'FAQ deleted successfully.'
            });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = faqController;
