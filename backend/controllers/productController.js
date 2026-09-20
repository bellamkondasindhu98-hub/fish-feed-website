const { ProductModel, ReviewModel, ComparisonModel } = require('../models');

const productController = {
    // GET /api/products
    getAllProducts: (req, res, next) => {
        try {
            const { search, category, fishType, minPrice, maxPrice, stockStatus, sortBy, sortOrder } = req.query;
            const products = ProductModel.getAll({
                search,
                category,
                fishType,
                minPrice,
                maxPrice,
                stockStatus,
                sortBy,
                sortOrder
            });

            return res.status(200).json({
                success: true,
                count: products.length,
                data: products
            });
        } catch (err) {
            next(err);
        }
    },

    // GET /api/products/search
    searchProducts: (req, res, next) => {
        try {
            const { q } = req.query;
            const products = ProductModel.getAll({ search: q });
            return res.status(200).json({
                success: true,
                count: products.length,
                data: products
            });
        } catch (err) {
            next(err);
        }
    },

    // GET /api/products/:id
    getProductById: (req, res, next) => {
        try {
            const { id } = req.params;
            const product = ProductModel.getById(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found.'
                });
            }

            // Also attach comparison data and recommendations
            const comparisons = ComparisonModel.getByProductId(id);
            const recommendations = ProductModel.getRecommendations(id, 4);

            return res.status(200).json({
                success: true,
                data: {
                    ...product,
                    comparisons,
                    recommendations
                }
            });
        } catch (err) {
            next(err);
        }
    },

    // GET /api/products/:id/recommendations
    getRecommendations: (req, res, next) => {
        try {
            const { id } = req.params;
            const recommendations = ProductModel.getRecommendations(id, 4);
            return res.status(200).json({
                success: true,
                data: recommendations
            });
        } catch (err) {
            next(err);
        }
    },

    // POST /api/products (Admin)
    createProduct: (req, res, next) => {
        try {
            const {
                name, description, price, packSize, image, category, fishType,
                protein, fat, feedType, recommendedFishSize, feedingInstructions, stock
            } = req.body;

            if (!name || !price || !category || !packSize) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide required fields: name, price, packSize, and category.'
                });
            }

            const imagePath = req.file ? `/uploads/${req.file.filename}` : (image || '/assets/images/products/floating_pellets_32_4.svg');

            const newProduct = ProductModel.create({
                name,
                description: description || 'High-quality formulated aquaculture feed.',
                price: Number(price),
                packSize,
                image: imagePath,
                category,
                fishType: fishType || 'All Freshwater Species',
                protein: Number(protein || 0),
                fat: Number(fat || 0),
                feedType: feedType || 'Floating Pellets',
                recommendedFishSize: recommendedFishSize || 'Growout Stage',
                feedingInstructions: feedingInstructions || 'Feed 2-3% of fish biomass daily.',
                stock: Number(stock || 0)
            });

            return res.status(201).json({
                success: true,
                message: 'Product created successfully.',
                data: newProduct
            });
        } catch (err) {
            next(err);
        }
    },

    // PUT /api/products/:id (Admin)
    updateProduct: (req, res, next) => {
        try {
            const { id } = req.params;
            const updateData = { ...req.body };

            if (req.file) {
                updateData.image = `/uploads/${req.file.filename}`;
            }

            const updated = ProductModel.update(id, updateData);
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found.'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Product updated successfully.',
                data: updated
            });
        } catch (err) {
            next(err);
        }
    },

    // PATCH /api/products/:id/stock (Admin)
    updateStock: (req, res, next) => {
        try {
            const { id } = req.params;
            const { stock } = req.body;

            if (stock === undefined || stock === null) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide the new stock quantity.'
                });
            }

            const updated = ProductModel.updateStock(id, stock);
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found.'
                });
            }

            return res.status(200).json({
                success: true,
                message: `Stock updated to ${updated.stock} (${updated.status}).`,
                data: updated
            });
        } catch (err) {
            next(err);
        }
    },

    // DELETE /api/products/:id (Admin)
    deleteProduct: (req, res, next) => {
        try {
            const { id } = req.params;
            const result = ProductModel.delete(id);

            if (result.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found.'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Product deleted successfully.'
            });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = productController;
