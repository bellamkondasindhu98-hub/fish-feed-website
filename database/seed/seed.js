const path = require('path');
const fs = require('fs');

let Database;
let bcrypt;

try {
    Database = require('better-sqlite3');
} catch (e) {
    Database = require(path.resolve(__dirname, '../../backend/node_modules/better-sqlite3'));
}

try {
    bcrypt = require('bcryptjs');
} catch (e) {
    bcrypt = require(path.resolve(__dirname, '../../backend/node_modules/bcryptjs'));
}

const dbPath = path.resolve(__dirname, '../../backend/fish_feed.db');
const schemaPath = path.resolve(__dirname, '../schema/schema.sql');

function initAndSeedDatabase() {
    console.log('🌱 Initializing Fish Feed Company Database...');
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }

    const db = new Database(dbPath);
    db.pragma('foreign_keys = ON');

    // Run schema
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
    console.log('✅ Schema tables verified.');

    // Seed Users
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    if (userCount === 0) {
        console.log('👤 Seeding default users...');
        const adminHash = bcrypt.hashSync('Admin@12345', 10);
        const farmerHash = bcrypt.hashSync('Farmer@12345', 10);

        const insertUser = db.prepare(`
            INSERT INTO users (name, email, phone, passwordHash, role, profileImage, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `);

        insertUser.run(
            'Admin Officer',
            'admin@fishfeed.com',
            '+919876543210',
            adminHash,
            'ADMIN',
            '/assets/images/admin_avatar.svg'
        );

        insertUser.run(
            'Ramesh Kumar (Krishi Aqua Farm)',
            'farmer@krishi.com',
            '+919845012345',
            farmerHash,
            'CUSTOMER',
            '/assets/images/user_avatar.svg'
        );
        console.log('✅ Default users seeded.');
    }

    // Seed Company Profile
    const companyCount = db.prepare('SELECT COUNT(*) as count FROM company').get().count;
    if (companyCount === 0) {
        console.log('🏢 Seeding company profile...');
        const insertCompany = db.prepare(`
            INSERT INTO company (
                id, companyName, logo, description, gstNumber, address, phone, email, whatsappNumber,
                ceoName, ceoImage, ceoPhone, ceoEmail, ceoBio, mission, vision, whyChooseUs, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `);

        const whyChooseUsData = JSON.stringify([
            {
                title: 'Scientifically Balanced Nutrition',
                description: 'Formulated by premier aquaculture scientists with optimized amino acid and lipid profiles ensuring 1.1 - 1.3 Feed Conversion Ratio (FCR).'
            },
            {
                title: 'High Water Stability & Zero Leaching',
                description: 'Extruded floating and sinking pellets retain integrity in pond water for over 3 hours, preserving water quality and reducing ammonia spikes.'
            },
            {
                title: 'Direct Farmer Support & Farm Visits',
                description: 'Our certified technical aquaculture advisors provide dedicated pond water testing and customized feeding schedule assistance across India.'
            },
            {
                title: '100% Quality Tested Ingredients',
                description: 'Free from harmful antibiotics, aflatoxins, and urea. Sourced from high-grade fish meal, toasted soybean, and essential premixes.'
            },
            {
                title: 'Transparent Pricing & Bulk Logistics',
                description: 'Direct ex-factory rates with seamless multi-ton logistics and rapid dispatch directly to your farm gate.'
            },
            {
                title: 'Direct WhatsApp Ordering & Support',
                description: 'No complicated carts or payment delays. Chat one-on-one with our technical sales managers on WhatsApp for quotes and delivery.'
            }
        ]);

        insertCompany.run(
            1,
            'AquaGrow Feeds India Pvt. Ltd.',
            '/assets/images/logo.svg',
            'AquaGrow Feeds is a premier Indian aquaculture nutrition company committed to empowering fish and shrimp farmers with scientifically engineered, high-efficiency feed formulations.',
            '36AAAAA0000A1Z5',
            'Plot No. 48, Aquaculture Industrial Park, NH-65, Vijayawada - Hyderabad Highway, Andhra Pradesh - 521101, India',
            '+91 866 245 8900',
            'support@aquagrowfeeds.in',
            '+919876543210', // Configured WhatsApp Number
            'Dr. Rajesh Varma',
            '/assets/images/ceo.svg',
            '+91 98765 43210',
            'ceo@aquagrowfeeds.in',
            'Dr. Rajesh Varma is a distinguished aquaculture nutrition specialist with over 22 years of research and field experience in Indian carps, Pangasius, and shrimp farming across Andhra Pradesh, West Bengal, and Odisha.',
            'To accelerate sustainable aquaculture across India by providing scientifically balanced, high-conversion fish feeds that maximize farmer profitability.',
            'To be India’s most trusted and sustainable aquaculture feed partner, recognized for cutting-edge nutritional science, farmer prosperity, and environmental care.',
            whyChooseUsData
        );
        console.log('✅ Company profile seeded.');
    }

    // Seed Products
    const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    if (productCount === 0) {
        console.log('📦 Seeding commercial fish feed products...');
        const insertProduct = db.prepare(`
            INSERT INTO products (
                name, description, price, packSize, image, category, fishType, protein, fat, feedType,
                recommendedFishSize, feedingInstructions, stock, status, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `);

        const products = [
            {
                name: 'AquaGrow Premium Floating Pellets 32/4',
                description: 'High-performance extruded floating feed engineered for Indian Major Carps (Rohu, Catla, Mrigal) and Tilapia in grow-out culture. Ensures rapid weight gain, excellent feed conversion, and crystal-clear pond water.',
                price: 1250,
                packSize: '25 KG Bag',
                image: '/assets/images/products/floating_pellets_32_4.svg',
                category: 'Floating Feed',
                fishType: 'Rohu, Catla, Mrigal, Tilapia',
                protein: 32.0,
                fat: 4.0,
                feedType: 'Floating Pellets (3mm - 4mm)',
                recommendedFishSize: '100g - 1.5kg Growout Stage',
                feedingInstructions: 'Feed 2-3% of total body weight daily, split across 2 feedings (morning 7:00 AM and evening 5:00 PM). Adjust during overcast weather.',
                stock: 450,
                status: 'IN_STOCK'
            },
            {
                name: 'AquaGrow Starter Micro-Crumble 38/6',
                description: 'Nutrient-dense starter crumble formulated specifically for nursery fry and fingerlings. Fortified with essential immunoglobulins, spirulina, and digestible marine proteins to achieve over 95% nursery survival rate.',
                price: 1480,
                packSize: '20 KG Bag',
                image: '/assets/images/products/starter_crumble_38_6.svg',
                category: 'Starter Feed',
                fishType: 'Fry & Fingerlings (All Species)',
                protein: 38.0,
                fat: 6.0,
                feedType: 'Micro Crumble (0.5mm - 1.2mm)',
                recommendedFishSize: 'Nursery Spawn / Fry (0.5g - 15g)',
                feedingInstructions: 'Feed 6-8% of biomass daily divided into 4 equal feedings across the day for uniform growth and zero cannibalism.',
                stock: 220,
                status: 'IN_STOCK'
            },
            {
                name: 'AquaGrow Pangasius Super-Grow 28/3',
                description: 'Economical high-density grow-out floating feed designed for Pangasius (Basa) and hybrid catfish. Delivers firm white muscle texture, uniform harvest size, and excellent FCR of 1.25.',
                price: 1650,
                packSize: '40 KG Bag',
                image: '/assets/images/products/pangasius_grow_28_3.svg',
                category: 'Growth Feed',
                fishType: 'Pangasius (Basa), Catfish',
                protein: 28.0,
                fat: 3.0,
                feedType: 'Floating Pellets (4mm - 6mm)',
                recommendedFishSize: '150g to Harvest (1.2kg - 2.0kg)',
                feedingInstructions: 'Feed 2.5% of body weight daily in feeding rings or perimeter feeding areas once in morning and once in evening.',
                stock: 310,
                status: 'IN_STOCK'
            },
            {
                name: 'AquaGrow Tilapia Intensive Float 30/4',
                description: 'Specialized floating feed for intensive cage culture and biofloc Tilapia systems. Formulated with enzyme complexes and natural gut probiotics for high stocking density resistance.',
                price: 1180,
                packSize: '25 KG Bag',
                image: '/assets/images/products/tilapia_intensive_30_4.svg',
                category: 'Floating Feed',
                fishType: 'GIFT Tilapia, Red Tilapia',
                protein: 30.0,
                fat: 4.0,
                feedType: 'Floating Pellets (2.5mm - 3.5mm)',
                recommendedFishSize: '50g - 600g Table Size',
                feedingInstructions: 'Feed 3-4% of total biomass daily in 3 feedings. Perfect for biofloc, RAS, and open earthen pond farming.',
                stock: 180,
                status: 'IN_STOCK'
            },
            {
                name: 'AquaGrow Broodstock Conditioning Feed 36/7',
                description: 'Enriched breeding conditioning feed loaded with omega-3 PUFA, astaxanthin, and vitamin E to optimize fecundity, sperm motility, and hatchability for hatchery breeding carps and catfish.',
                price: 1850,
                packSize: '25 KG Bag',
                image: '/assets/images/products/broodstock_special_36_7.svg',
                category: 'Broodstock Feed',
                fishType: 'Breeding Carps, Pangasius, Catla Brooders',
                protein: 36.0,
                fat: 7.0,
                feedType: 'Slow-Sinking Pellets (4mm)',
                recommendedFishSize: 'Mature Brooders (1.5kg - 6.0kg)',
                feedingInstructions: 'Feed 1.5-2% of body weight daily for 45-60 days prior to induced breeding season for peak egg quality.',
                stock: 95,
                status: 'IN_STOCK'
            },
            {
                name: 'AquaGrow Sinking Pellet Economy 24/3',
                description: 'Traditional water-stable slow sinking feed for bottom-dwelling carps (Mrigal, Common Carp) and integrated polyculture systems. Maintains pellet structure underwater for 2+ hours.',
                price: 1550,
                packSize: '50 KG Bag',
                image: '/assets/images/products/sinking_pellet_24_3.svg',
                category: 'Sinking Feed',
                fishType: 'Mrigal, Common Carp, Grass Carp',
                protein: 24.0,
                fat: 3.0,
                feedType: 'Steam Sinking Pellets (3mm - 5mm)',
                recommendedFishSize: '100g - 2.0kg Polyculture',
                feedingInstructions: 'Distribute in feeding trays at the bottom of the pond twice daily. Check feeding trays after 90 minutes to adjust ration.',
                stock: 150,
                status: 'IN_STOCK'
            },
            {
                name: 'AquaGrow Shrimp Nursery Micro-Crumbles 40/8',
                description: 'Ultra-pure marine protein nursery feed for Litopenaeus vannamei and Monodon post-larvae. Fortified with krill meal, cholesterol, and natural attractants for instant feed uptake.',
                price: 1920,
                packSize: '15 KG Bag',
                image: '/assets/images/products/shrimp_nursery_40_8.svg',
                category: 'High Protein Feed',
                fishType: 'Vannamei Shrimp, Black Tiger Prawn',
                protein: 40.0,
                fat: 8.0,
                feedType: 'Micro Pellets / Granules (0.8mm - 1.5mm)',
                recommendedFishSize: 'PL15 to 3g Juvenile Nursery',
                feedingInstructions: 'Feed 8-10% of shrimp biomass across 4-5 check-trays per pond daily. Monitor water alkalinity and salinity.',
                stock: 85,
                status: 'IN_STOCK'
            },
            {
                name: 'AquaGrow Winter Care Metabolic Feed 34/5',
                description: 'Specially crafted cold-weather diet with bio-available nucleotides and immunostimulants designed to sustain fish immunity and prevent winter mortality in North & East Indian winters.',
                price: 1390,
                packSize: '25 KG Bag',
                image: '/assets/images/products/winter_feed_34_5.svg',
                category: 'High Protein Feed',
                fishType: 'Rohu, Catla, Murrel, Magur',
                protein: 34.0,
                fat: 5.0,
                feedType: 'Floating Pellets (3mm)',
                recommendedFishSize: 'All Growout Sizes during low water temps (<20°C)',
                feedingInstructions: 'Feed once daily during mid-day peak sunshine (12:00 PM - 2:00 PM) at 1-1.5% biomass ration.',
                stock: 0, // Explicitly 0 stock for Out of Stock testing requirement
                status: 'OUT_OF_STOCK'
            }
        ];

        for (const prod of products) {
            insertProduct.run(
                prod.name, prod.description, prod.price, prod.packSize, prod.image,
                prod.category, prod.fishType, prod.protein, prod.fat, prod.feedType,
                prod.recommendedFishSize, prod.feedingInstructions, prod.stock, prod.status
            );
        }
        console.log('✅ Commercial fish feed products seeded.');
    }

    // Seed Comparisons
    const comparisonCount = db.prepare('SELECT COUNT(*) as count FROM comparison_products').get().count;
    if (comparisonCount === 0) {
        console.log('📊 Seeding comparison benchmark data...');
        const insertComparison = db.prepare(`
            INSERT INTO comparison_products (
                productId, competitorName, competitorProductName, price, packSize, protein, fat,
                fishType, feedType, rating, source, createdAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `);

        // Comparison for product 1 (Premium Floating 32/4)
        insertComparison.run(
            1,
            'Standard Market Brand A',
            'Commercial Carp Grow 28/3',
            1320,
            '25 KG Bag',
            28.0,
            3.0,
            'Rohu / Catla',
            'Floating Pellets',
            4.1,
            'Published Market Catalog 2026'
        );

        insertComparison.run(
            1,
            'Regional Local Mill Feed',
            'Farm-Grade Floating 30/3',
            1280,
            '25 KG Bag',
            30.0,
            3.5,
            'Rohu / Catla',
            'Floating Pellets',
            3.9,
            'Feed Testing Lab Analysis'
        );

        // Comparison for product 2 (Starter Crumble 38/6)
        insertComparison.run(
            2,
            'Competitor Hatchery Mix',
            'Nursery Mash 35/5',
            1550,
            '20 KG Bag',
            35.0,
            5.0,
            'Fry & Fingerlings',
            'Crumbled Pellets',
            4.2,
            'Hatchery Association Benchmark'
        );

        // Comparison for product 3 (Pangasius Super-Grow)
        insertComparison.run(
            3,
            'Standard Delta Feed',
            'Panga Commercial 26/3',
            1720,
            '40 KG Bag',
            26.0,
            2.8,
            'Pangasius',
            'Floating Pellets',
            4.0,
            'Dealer Price Index 2026'
        );

        console.log('✅ Comparison benchmark data seeded.');
    }

    // Seed Reviews
    const reviewCount = db.prepare('SELECT COUNT(*) as count FROM reviews').get().count;
    if (reviewCount === 0) {
        console.log('⭐ Seeding customer reviews...');
        const insertReview = db.prepare(`
            INSERT INTO reviews (userId, productId, rating, comment, isApproved, createdAt)
            VALUES (?, ?, ?, ?, ?, datetime('now', ?))
        `);

        const reviews = [
            {
                userId: 2,
                productId: 1,
                rating: 5,
                comment: 'Using AquaGrow 32/4 for my 12-acre Rohu ponds in Krishna district. Outstanding water stability and our harvest weight reached 1.2kg in just 7 months! Highly recommended.',
                offset: '-10 days'
            },
            {
                userId: 2,
                productId: 1,
                rating: 5,
                comment: 'Very low powder waste and zero pond turbidity. Ordered 50 bags via WhatsApp and received delivery at farm site within 48 hours.',
                offset: '-5 days'
            },
            {
                userId: 2,
                productId: 2,
                rating: 5,
                comment: 'Fingerling survival rate increased from 78% to 94% after switching to Starter Micro-Crumble 38/6. The spirulina nutrition really protects nursery fry.',
                offset: '-15 days'
            },
            {
                userId: 2,
                productId: 3,
                rating: 4,
                comment: 'Excellent FCR of 1.22 on Pangasius. Fish meat quality was clean and got top grade pricing in Kolkata wholesale fish market.',
                offset: '-3 days'
            },
            {
                userId: 2,
                productId: 4,
                rating: 5,
                comment: 'Remarkable growth in our biofloc Tilapia tanks. Pellets float consistently for over 4 hours allowing complete intake.',
                offset: '-1 day'
            }
        ];

        for (const rev of reviews) {
            insertReview.run(rev.userId, rev.productId, rev.rating, rev.comment, 1, rev.offset);
        }
        console.log('✅ Customer reviews seeded.');
    }

    // Seed FAQs
    const faqCount = db.prepare('SELECT COUNT(*) as count FROM faqs').get().count;
    if (faqCount === 0) {
        console.log('❓ Seeding FAQs...');
        const insertFaq = db.prepare(`
            INSERT INTO faqs (question, answer, category, sortOrder, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
        `);

        const faqs = [
            {
                question: 'How do I purchase fish feed products from AquaGrow?',
                answer: 'Simply browse our product catalog, check the stock availability, and click the "Order via WhatsApp" button on any product page. This will automatically open WhatsApp with our sales desk, where you can discuss quantity, pricing, transportation, and delivery dates directly.',
                category: 'Ordering & Delivery',
                sortOrder: 1
            },
            {
                question: 'Is online payment or credit card checkout supported on the website?',
                answer: 'In this version of our platform, we do NOT charge customers online or require credit card details. All orders and invoices are handled personally and securely through direct WhatsApp and phone consultation with our regional logistics team.',
                category: 'Ordering & Delivery',
                sortOrder: 2
            },
            {
                question: 'What is the minimum order quantity for farm delivery?',
                answer: 'We supply orders starting from single bag purchases up to full truck loads (10 to 25 metric tons). Bulk orders qualify for direct ex-mill transport subsidies.',
                category: 'Ordering & Delivery',
                sortOrder: 3
            },
            {
                question: 'What is the difference between Floating and Sinking feed?',
                answer: 'Floating feed (extruded) remains on the surface for several hours, allowing farmers to monitor fish appetite and feed consumption directly, minimizing wasted feed. Sinking feed is suited for bottom-feeding species like Mrigal and Common Carp, or specific pond depths and traditional culture systems.',
                category: 'Feed Quality & Nutrition',
                sortOrder: 4
            },
            {
                question: 'How do I determine the right protein percentage for my fish?',
                answer: 'Spawn and nursery fry require 38-40% crude protein (Starter feed) for organ development. Grow-out carps and Tilapia thrive on 28-32% protein, whereas shrimp and broodstock require 36-40% specialized protein with balanced amino acids.',
                category: 'Feed Quality & Nutrition',
                sortOrder: 5
            },
            {
                question: 'How can I check if a product is available in stock?',
                answer: 'Every product card and product details page displays a real-time availability indicator: 🟢 IN STOCK or 🔴 OUT OF STOCK. Our factory inventory updates live through our administrative system.',
                category: 'General',
                sortOrder: 6
            },
            {
                question: 'Does AquaGrow provide on-farm technical water and feed advice?',
                answer: 'Yes! Our aquaculture technical advisors offer complimentary water parameter testing (pH, DO, Ammonia, Alkalinity) and custom feeding schedules for registered fish farmers.',
                category: 'Farmer Support',
                sortOrder: 7
            }
        ];

        for (const faq of faqs) {
            insertFaq.run(faq.question, faq.answer, faq.category, faq.sortOrder);
        }
        console.log('✅ FAQs seeded.');
    }

    // Seed Website Feedback
    const fbCount = db.prepare('SELECT COUNT(*) as count FROM website_feedback').get().count;
    if (fbCount === 0) {
        console.log('💬 Seeding initial website feedback...');
        const insertFeedback = db.prepare(`
            INSERT INTO website_feedback (userId, name, email, rating, message, createdAt)
            VALUES (?, ?, ?, ?, ?, datetime('now', '-2 days'))
        `);

        insertFeedback.run(
            2,
            'Ramesh Kumar',
            'farmer@krishi.com',
            5,
            'The website is very clean, fast, and easy to use on my mobile phone. Ordering directly via WhatsApp is so convenient for fish farmers like us!'
        );
        console.log('✅ Website feedback seeded.');
    }

    db.close();
    console.log('🎉 Database initialization and seeding completed successfully!\n');
}

if (require.main === module) {
    initAndSeedDatabase();
}

module.exports = { initAndSeedDatabase, dbPath, schemaPath };
