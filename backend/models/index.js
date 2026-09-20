const { getDb } = require('../config/db');

const UserModel = {
    findByEmail(email) {
        const db = getDb();
        return db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email.trim());
    },

    findByPhone(phone) {
        const db = getDb();
        const cleaned = phone.replace(/[\s\-()]/g, '');
        return db.prepare(`SELECT * FROM users WHERE REPLACE(REPLACE(REPLACE(phone, ' ', ''), '-', ''), '+91', '') = ? OR phone = ?`).get(cleaned.replace('+91', ''), phone.trim());
    },

    findByEmailOrPhone(identifier) {
        const db = getDb();
        const cleanId = identifier.trim();
        return db.prepare(`
            SELECT * FROM users 
            WHERE LOWER(email) = LOWER(?) 
               OR phone = ? 
               OR REPLACE(REPLACE(REPLACE(phone, ' ', ''), '-', ''), '+91', '') = ?
        `).get(cleanId, cleanId, cleanId.replace('+91', ''));
    },

    findById(id) {
        const db = getDb();
        return db.prepare('SELECT id, name, email, phone, role, profileImage, createdAt, updatedAt FROM users WHERE id = ?').get(id);
    },

    create({ name, email, phone, passwordHash, role = 'CUSTOMER', profileImage = null }) {
        const db = getDb();
        const stmt = db.prepare(`
            INSERT INTO users (name, email, phone, passwordHash, role, profileImage, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `);
        const result = stmt.run(name.trim(), email.trim().toLowerCase(), phone.trim(), passwordHash, role, profileImage);
        return this.findById(result.lastInsertRowid);
    },

    updateProfile(id, { name, phone, profileImage }) {
        const db = getDb();
        const currentUser = this.findById(id);
        if (!currentUser) return null;

        const newName = name !== undefined ? name.trim() : currentUser.name;
        const newPhone = phone !== undefined ? phone.trim() : currentUser.phone;
        const newImage = profileImage !== undefined ? profileImage : currentUser.profileImage;

        db.prepare(`
            UPDATE users
            SET name = ?, phone = ?, profileImage = ?, updatedAt = datetime('now')
            WHERE id = ?
        `).run(newName, newPhone, newImage, id);

        return this.findById(id);
    },

    updatePassword(id, passwordHash) {
        const db = getDb();
        db.prepare(`
            UPDATE users
            SET passwordHash = ?, updatedAt = datetime('now')
            WHERE id = ?
        `).run(passwordHash, id);
    },

    countCustomers() {
        const db = getDb();
        return db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'CUSTOMER'").get().count;
    },

    getAllCustomers() {
        const db = getDb();
        return db.prepare("SELECT id, name, email, phone, role, profileImage, createdAt FROM users WHERE role = 'CUSTOMER' ORDER BY createdAt DESC").all();
    }
};

const ProductModel = {
    getAll({ search, category, fishType, minPrice, maxPrice, stockStatus, sortBy = 'id', sortOrder = 'ASC' } = {}) {
        const db = getDb();
        let query = `
            SELECT p.*, 
                   COALESCE(AVG(r.rating), 4.5) as avgRating, 
                   COUNT(r.id) as reviewCount
            FROM products p
            LEFT JOIN reviews r ON p.id = r.productId AND r.isApproved = 1
            WHERE 1=1
        `;
        const params = [];

        if (search && search.trim() !== '') {
            const term = `%${search.trim()}%`;
            query += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.category LIKE ? OR p.fishType LIKE ? OR p.packSize LIKE ?)`;
            params.push(term, term, term, term, term);
        }

        if (category && category !== 'All' && category !== '') {
            query += ` AND p.category = ?`;
            params.push(category);
        }

        if (fishType && fishType !== 'All' && fishType !== '') {
            query += ` AND (p.fishType LIKE ? OR p.fishType LIKE '%All%')`;
            params.push(`%${fishType}%`);
        }

        if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
            query += ` AND p.price >= ?`;
            params.push(Number(minPrice));
        }

        if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
            query += ` AND p.price <= ?`;
            params.push(Number(maxPrice));
        }

        if (stockStatus && stockStatus !== 'All') {
            query += ` AND p.status = ?`;
            params.push(stockStatus);
        }

        query += ` GROUP BY p.id`;

        const allowedSort = {
            id: 'p.id',
            price: 'p.price',
            name: 'p.name',
            rating: 'avgRating',
            stock: 'p.stock'
        };
        const sortColumn = allowedSort[sortBy] || 'p.id';
        const direction = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        query += ` ORDER BY ${sortColumn} ${direction}`;

        return db.prepare(query).all(...params).map(p => ({
            ...p,
            avgRating: Number(Number(p.avgRating).toFixed(1)),
            reviewCount: Number(p.reviewCount)
        }));
    },

    getById(id) {
        const db = getDb();
        const product = db.prepare(`
            SELECT p.*, 
                   COALESCE(AVG(r.rating), 4.5) as avgRating, 
                   COUNT(r.id) as reviewCount
            FROM products p
            LEFT JOIN reviews r ON p.id = r.productId AND r.isApproved = 1
            WHERE p.id = ?
            GROUP BY p.id
        `).get(id);

        if (!product) return null;

        return {
            ...product,
            avgRating: Number(Number(product.avgRating).toFixed(1)),
            reviewCount: Number(product.reviewCount)
        };
    },

    getRecommendations(productId, limit = 4) {
        const current = this.getById(productId);
        if (!current) return [];

        const all = this.getAll();
        // Exclude current product
        const others = all.filter(p => p.id !== Number(productId));

        // Score based on similarity
        const scored = others.map(p => {
            let score = 0;
            if (p.category === current.category) score += 3;
            if (p.fishType.toLowerCase().includes(current.fishType.toLowerCase().split(',')[0])) score += 2;
            const priceDiff = Math.abs(p.price - current.price) / current.price;
            if (priceDiff < 0.25) score += 1.5;
            if (p.status === 'IN_STOCK') score += 1;
            return { product: p, score };
        });

        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, limit).map(item => item.product);
    },

    create(data) {
        const db = getDb();
        const status = (data.stock !== undefined && Number(data.stock) > 0) ? 'IN_STOCK' : 'OUT_OF_STOCK';
        const stmt = db.prepare(`
            INSERT INTO products (
                name, description, price, packSize, image, category, fishType,
                protein, fat, feedType, recommendedFishSize, feedingInstructions,
                stock, status, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `);

        const result = stmt.run(
            data.name,
            data.description,
            Number(data.price),
            data.packSize,
            data.image || '/assets/images/products/floating_pellets_32_4.svg',
            data.category,
            data.fishType,
            Number(data.protein || 0),
            Number(data.fat || 0),
            data.feedType || 'Floating Pellets',
            data.recommendedFishSize || 'Growout Stage',
            data.feedingInstructions || 'Feed 2-3% biomass daily.',
            Number(data.stock || 0),
            status
        );

        return this.getById(result.lastInsertRowid);
    },

    update(id, data) {
        const db = getDb();
        const current = this.getById(id);
        if (!current) return null;

        const stock = data.stock !== undefined ? Number(data.stock) : current.stock;
        const status = data.status !== undefined ? data.status : (stock > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK');

        db.prepare(`
            UPDATE products
            SET name = ?, description = ?, price = ?, packSize = ?, image = ?, category = ?,
                fishType = ?, protein = ?, fat = ?, feedType = ?, recommendedFishSize = ?,
                feedingInstructions = ?, stock = ?, status = ?, updatedAt = datetime('now')
            WHERE id = ?
        `).run(
            data.name !== undefined ? data.name : current.name,
            data.description !== undefined ? data.description : current.description,
            data.price !== undefined ? Number(data.price) : current.price,
            data.packSize !== undefined ? data.packSize : current.packSize,
            data.image !== undefined ? data.image : current.image,
            data.category !== undefined ? data.category : current.category,
            data.fishType !== undefined ? data.fishType : current.fishType,
            data.protein !== undefined ? Number(data.protein) : current.protein,
            data.fat !== undefined ? Number(data.fat) : current.fat,
            data.feedType !== undefined ? data.feedType : current.feedType,
            data.recommendedFishSize !== undefined ? data.recommendedFishSize : current.recommendedFishSize,
            data.feedingInstructions !== undefined ? data.feedingInstructions : current.feedingInstructions,
            stock,
            status,
            id
        );

        return this.getById(id);
    },

    updateStock(id, stockQuantity) {
        const db = getDb();
        const stock = Number(stockQuantity);
        const status = stock > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK';

        db.prepare(`
            UPDATE products
            SET stock = ?, status = ?, updatedAt = datetime('now')
            WHERE id = ?
        `).run(stock, status, id);

        return this.getById(id);
    },

    delete(id) {
        const db = getDb();
        return db.prepare('DELETE FROM products WHERE id = ?').run(id);
    },

    countMetrics() {
        const db = getDb();
        const total = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
        const available = db.prepare("SELECT COUNT(*) as count FROM products WHERE status = 'IN_STOCK' AND stock > 0").get().count;
        const outOfStock = db.prepare("SELECT COUNT(*) as count FROM products WHERE status = 'OUT_OF_STOCK' OR stock = 0").get().count;
        return { total, available, outOfStock };
    }
};

const ReviewModel = {
    getByProductId(productId) {
        const db = getDb();
        return db.prepare(`
            SELECT r.*, u.name as userName, u.profileImage as userAvatar
            FROM reviews r
            JOIN users u ON r.userId = u.id
            WHERE r.productId = ? AND r.isApproved = 1
            ORDER BY r.createdAt DESC
        `).all(productId);
    },

    getAllForAdmin() {
        const db = getDb();
        return db.prepare(`
            SELECT r.*, u.name as userName, u.email as userEmail, p.name as productName, p.image as productImage
            FROM reviews r
            JOIN users u ON r.userId = u.id
            JOIN products p ON r.productId = p.id
            ORDER BY r.createdAt DESC
        `).all();
    },

    create({ userId, productId, rating, comment }) {
        const db = getDb();
        const stmt = db.prepare(`
            INSERT INTO reviews (userId, productId, rating, comment, isApproved, createdAt)
            VALUES (?, ?, ?, ?, 1, datetime('now'))
        `);
        const result = stmt.run(userId, productId, Number(rating), comment.trim());
        return db.prepare(`
            SELECT r.*, u.name as userName, u.profileImage as userAvatar
            FROM reviews r
            JOIN users u ON r.userId = u.id
            WHERE r.id = ?
        `).get(result.lastInsertRowid);
    },

    setApproval(id, isApproved) {
        const db = getDb();
        db.prepare('UPDATE reviews SET isApproved = ? WHERE id = ?').run(isApproved ? 1 : 0, id);
        return db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
    },

    delete(id) {
        const db = getDb();
        return db.prepare('DELETE FROM reviews WHERE id = ?').run(id);
    },

    countTotal() {
        const db = getDb();
        return db.prepare('SELECT COUNT(*) as count FROM reviews').get().count;
    }
};

const CompanyModel = {
    get() {
        const db = getDb();
        const company = db.prepare('SELECT * FROM company WHERE id = 1').get();
        if (!company) return null;
        try {
            company.whyChooseUs = JSON.parse(company.whyChooseUs);
        } catch (e) {
            company.whyChooseUs = [];
        }
        return company;
    },

    update(data) {
        const db = getDb();
        const current = this.get();
        if (!current) return null;

        const whyChooseUsStr = data.whyChooseUs !== undefined 
            ? (typeof data.whyChooseUs === 'string' ? data.whyChooseUs : JSON.stringify(data.whyChooseUs))
            : JSON.stringify(current.whyChooseUs);

        db.prepare(`
            UPDATE company
            SET companyName = ?, logo = ?, description = ?, gstNumber = ?, address = ?,
                phone = ?, email = ?, whatsappNumber = ?, ceoName = ?, ceoImage = ?,
                ceoPhone = ?, ceoEmail = ?, ceoBio = ?, mission = ?, vision = ?,
                whyChooseUs = ?, updatedAt = datetime('now')
            WHERE id = 1
        `).run(
            data.companyName || current.companyName,
            data.logo || current.logo,
            data.description || current.description,
            data.gstNumber || current.gstNumber,
            data.address || current.address,
            data.phone || current.phone,
            data.email || current.email,
            data.whatsappNumber || current.whatsappNumber,
            data.ceoName || current.ceoName,
            data.ceoImage || current.ceoImage,
            data.ceoPhone || current.ceoPhone,
            data.ceoEmail || current.ceoEmail,
            data.ceoBio || current.ceoBio,
            data.mission || current.mission,
            data.vision || current.vision,
            whyChooseUsStr
        );

        return this.get();
    }
};

const FAQModel = {
    getAll() {
        const db = getDb();
        return db.prepare('SELECT * FROM faqs ORDER BY sortOrder ASC, id ASC').all();
    },

    getById(id) {
        const db = getDb();
        return db.prepare('SELECT * FROM faqs WHERE id = ?').get(id);
    },

    create({ question, answer, category = 'General', sortOrder = 0 }) {
        const db = getDb();
        const stmt = db.prepare(`
            INSERT INTO faqs (question, answer, category, sortOrder, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
        `);
        const result = stmt.run(question.trim(), answer.trim(), category.trim(), Number(sortOrder));
        return this.getById(result.lastInsertRowid);
    },

    update(id, { question, answer, category, sortOrder }) {
        const db = getDb();
        const current = this.getById(id);
        if (!current) return null;

        db.prepare(`
            UPDATE faqs
            SET question = ?, answer = ?, category = ?, sortOrder = ?, updatedAt = datetime('now')
            WHERE id = ?
        `).run(
            question !== undefined ? question.trim() : current.question,
            answer !== undefined ? answer.trim() : current.answer,
            category !== undefined ? category.trim() : current.category,
            sortOrder !== undefined ? Number(sortOrder) : current.sortOrder,
            id
        );

        return this.getById(id);
    },

    delete(id) {
        const db = getDb();
        return db.prepare('DELETE FROM faqs WHERE id = ?').run(id);
    }
};

const FeedbackModel = {
    create({ userId = null, name, email, rating, message }) {
        const db = getDb();
        const stmt = db.prepare(`
            INSERT INTO website_feedback (userId, name, email, rating, message, createdAt)
            VALUES (?, ?, ?, ?, ?, datetime('now'))
        `);
        const result = stmt.run(userId, name.trim(), email.trim(), Number(rating), message.trim());
        return db.prepare('SELECT * FROM website_feedback WHERE id = ?').get(result.lastInsertRowid);
    },

    getAll() {
        const db = getDb();
        return db.prepare('SELECT * FROM website_feedback ORDER BY createdAt DESC').all();
    },

    countTotal() {
        const db = getDb();
        return db.prepare('SELECT COUNT(*) as count FROM website_feedback').get().count;
    }
};

const ComparisonModel = {
    getByProductId(productId) {
        const db = getDb();
        return db.prepare('SELECT * FROM comparison_products WHERE productId = ? ORDER BY id ASC').all(productId);
    },

    getAll() {
        const db = getDb();
        return db.prepare(`
            SELECT c.*, p.name as productName, p.price as ourPrice, p.protein as ourProtein, p.fat as ourFat
            FROM comparison_products c
            JOIN products p ON c.productId = p.id
            ORDER BY c.id DESC
        `).all();
    },

    create(data) {
        const db = getDb();
        const stmt = db.prepare(`
            INSERT INTO comparison_products (
                productId, competitorName, competitorProductName, price, packSize,
                protein, fat, fishType, feedType, rating, source, createdAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `);
        const result = stmt.run(
            Number(data.productId),
            data.competitorName.trim(),
            data.competitorProductName.trim(),
            Number(data.price),
            data.packSize.trim(),
            Number(data.protein || 0),
            Number(data.fat || 0),
            data.fishType.trim(),
            data.feedType.trim(),
            Number(data.rating || 4.0),
            data.source || 'Market Benchmark'
        );
        return db.prepare('SELECT * FROM comparison_products WHERE id = ?').get(result.lastInsertRowid);
    },

    update(id, data) {
        const db = getDb();
        const current = db.prepare('SELECT * FROM comparison_products WHERE id = ?').get(id);
        if (!current) return null;

        db.prepare(`
            UPDATE comparison_products
            SET competitorName = ?, competitorProductName = ?, price = ?, packSize = ?,
                protein = ?, fat = ?, fishType = ?, feedType = ?, rating = ?, source = ?
            WHERE id = ?
        `).run(
            data.competitorName !== undefined ? data.competitorName : current.competitorName,
            data.competitorProductName !== undefined ? data.competitorProductName : current.competitorProductName,
            data.price !== undefined ? Number(data.price) : current.price,
            data.packSize !== undefined ? data.packSize : current.packSize,
            data.protein !== undefined ? Number(data.protein) : current.protein,
            data.fat !== undefined ? Number(data.fat) : current.fat,
            data.fishType !== undefined ? data.fishType : current.fishType,
            data.feedType !== undefined ? data.feedType : current.feedType,
            data.rating !== undefined ? Number(data.rating) : current.rating,
            data.source !== undefined ? data.source : current.source,
            id
        );
        return db.prepare('SELECT * FROM comparison_products WHERE id = ?').get(id);
    },

    delete(id) {
        const db = getDb();
        return db.prepare('DELETE FROM comparison_products WHERE id = ?').run(id);
    }
};

module.exports = {
    UserModel,
    ProductModel,
    ReviewModel,
    CompanyModel,
    FAQModel,
    FeedbackModel,
    ComparisonModel
};
