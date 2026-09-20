const http = require('http');
const assert = require('assert');
const { app, server } = require('../server');

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(BASE_URL + path);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, body: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, raw: data });
                }
            });
        });

        req.on('error', (err) => reject(err));

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function runTests() {
    console.log('🧪 Starting Backend REST API Integration Tests...\n');
    let farmerToken = '';
    let adminToken = '';
    let createdProductId = null;

    try {
        // 1. Health Check
        console.log('👉 Testing Health Check...');
        const healthRes = await request('GET', '/health');
        assert.strictEqual(healthRes.status, 200);
        assert.strictEqual(healthRes.body.status, 'OK');
        console.log('  ✅ Health check passed.');

        // 2. Auth - Customer Login
        console.log('👉 Testing Customer Login (farmer@krishi.com)...');
        const loginRes = await request('POST', '/auth/login', {
            identifier: 'farmer@krishi.com',
            password: 'Farmer@12345'
        });
        assert.strictEqual(loginRes.status, 200);
        assert.strictEqual(loginRes.body.success, true);
        assert.ok(loginRes.body.token);
        assert.strictEqual(loginRes.body.user.role, 'CUSTOMER');
        farmerToken = loginRes.body.token;
        console.log('  ✅ Customer logged in successfully.');

        // 3. Auth - Admin Login
        console.log('👉 Testing Admin Login (admin@fishfeed.com)...');
        const adminLoginRes = await request('POST', '/auth/login', {
            identifier: 'admin@fishfeed.com',
            password: 'Admin@12345'
        });
        assert.strictEqual(adminLoginRes.status, 200);
        assert.strictEqual(adminLoginRes.body.success, true);
        assert.strictEqual(adminLoginRes.body.user.role, 'ADMIN');
        adminToken = adminLoginRes.body.token;
        console.log('  ✅ Admin logged in successfully.');

        // 4. Products - Fetch Catalog
        console.log('👉 Testing Product Catalog (GET /api/products)...');
        const productsRes = await request('GET', '/products');
        assert.strictEqual(productsRes.status, 200);
        assert.ok(productsRes.body.data.length >= 8);
        console.log(`  ✅ Retrieved ${productsRes.body.data.length} products.`);

        // 5. Products - Search
        console.log('👉 Testing Search "Rohu" (GET /api/products/search?q=Rohu)...');
        const searchRes = await request('GET', '/products/search?q=Rohu');
        assert.strictEqual(searchRes.status, 200);
        assert.ok(searchRes.body.data.length > 0);
        console.log(`  ✅ Search returned ${searchRes.body.data.length} matches.`);

        // 6. Products - Details & Recommendations
        console.log('👉 Testing Product Details (GET /api/products/1)...');
        const detailsRes = await request('GET', '/products/1');
        assert.strictEqual(detailsRes.status, 200);
        assert.strictEqual(detailsRes.body.data.name, 'AquaGrow Premium Floating Pellets 32/4');
        assert.ok(Array.isArray(detailsRes.body.data.recommendations));
        assert.ok(Array.isArray(detailsRes.body.data.comparisons));
        console.log('  ✅ Product details with recommendations & comparisons loaded.');

        // 7. Company Profile & WhatsApp Configuration
        console.log('👉 Testing Company Profile (GET /api/company)...');
        const companyRes = await request('GET', '/company');
        assert.strictEqual(companyRes.status, 200);
        assert.strictEqual(companyRes.body.data.companyName, 'AquaGrow Feeds India Pvt. Ltd.');
        assert.strictEqual(companyRes.body.data.whatsappNumber, '+919876543210');
        assert.strictEqual(companyRes.body.data.ceoName, 'Dr. Rajesh Varma');
        console.log('  ✅ Company profile & configured WhatsApp number verified.');

        // 8. Admin - Add Product
        console.log('👉 Testing Admin Add Product (POST /api/products)...');
        const newProdRes = await request('POST', '/products', {
            name: 'Test Murrel Special 42/7 Feed',
            description: 'Test high protein diet for predatory freshwater murrel.',
            price: 2100,
            packSize: '25 KG Bag',
            category: 'High Protein Feed',
            fishType: 'Channa Striata (Murrel)',
            protein: 42,
            fat: 7,
            feedType: 'Floating Pellets',
            recommendedFishSize: 'Juvenile to Adult',
            feedingInstructions: 'Feed 3% biomass daily.',
            stock: 60
        }, adminToken);
        assert.strictEqual(newProdRes.status, 201);
        assert.strictEqual(newProdRes.body.data.name, 'Test Murrel Special 42/7 Feed');
        createdProductId = newProdRes.body.data.id;
        console.log(`  ✅ Product created with ID: ${createdProductId}`);

        // 9. Admin - Update Stock & Price
        console.log(`👉 Testing Admin Stock Update (PATCH /api/products/${createdProductId}/stock)...`);
        const stockRes = await request('PATCH', `/products/${createdProductId}/stock`, { stock: 0 }, adminToken);
        assert.strictEqual(stockRes.status, 200);
        assert.strictEqual(stockRes.body.data.status, 'OUT_OF_STOCK');
        assert.strictEqual(stockRes.body.data.stock, 0);
        console.log('  ✅ Stock updated to 0 and status correctly changed to OUT_OF_STOCK.');

        // 10. Admin - Delete Test Product
        console.log(`👉 Testing Admin Delete Product (DELETE /api/products/${createdProductId})...`);
        const deleteRes = await request('DELETE', `/products/${createdProductId}`, null, adminToken);
        assert.strictEqual(deleteRes.status, 200);
        console.log('  ✅ Product deleted successfully.');

        // 11. Customer Review Submission
        console.log('👉 Testing Customer Review Submission (POST /api/products/1/reviews)...');
        const reviewRes = await request('POST', '/products/1/reviews', {
            rating: 5,
            comment: 'Automated test review: Excellent quality feed!'
        }, farmerToken);
        assert.strictEqual(reviewRes.status, 201);
        console.log('  ✅ Verified customer review submitted.');

        // 12. Website Feedback
        console.log('👉 Testing Website Feedback (POST /api/feedback)...');
        const feedbackRes = await request('POST', '/feedback', {
            name: 'Priya Sharma',
            email: 'priya@aquafarm.in',
            rating: 5,
            message: 'Very responsive website, WhatsApp ordering works smoothly.'
        }, farmerToken);
        assert.strictEqual(feedbackRes.status, 201);
        console.log('  ✅ Website feedback recorded.');

        // 13. Admin Dashboard Metrics
        console.log('👉 Testing Admin Metrics (GET /api/admin/metrics)...');
        const metricsRes = await request('GET', '/admin/metrics', null, adminToken);
        assert.strictEqual(metricsRes.status, 200);
        assert.ok(metricsRes.body.data.totalProducts >= 8);
        assert.ok(metricsRes.body.data.totalCustomers >= 1);
        console.log('  ✅ Admin metrics retrieved:', metricsRes.body.data);

        console.log('\n========================================');
        console.log('🎉 ALL BACKEND API TESTS PASSED 100%!');
        console.log('========================================\n');
    } catch (err) {
        console.error('❌ Test failed:', err);
        process.exit(1);
    } finally {
        server.close();
    }
}

runTests();
