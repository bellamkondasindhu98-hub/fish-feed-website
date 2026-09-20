# 🏛️ AquaGrow Feeds Platform Architecture

## System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT BROWSERS                                   |
|                                                                                   |
|  [ Customer Web App (React + TS + Tailwind) ]    [ Executive Admin Dashboard ]    |
|        - /home, /products, /compare, etc.              - /admin, /admin/products  |
+----------------------------------------+------------------------------------------+
                                         |
                                         | (Axios REST + JWT Authorization)
                                         v
+-----------------------------------------------------------------------------------+
|                             BACKEND API SERVER (Node.js)                         |
|                                                                                   |
|  [ Express Router ] -> [ Auth & RBAC Middleware ] -> [ Controllers ]              |
|        - /api/auth          - verifyToken                   - authController      |
|        - /api/products      - requireAdmin                  - productController   |
|        - /api/company       - apiLimiter                    - companyController   |
|        - /api/reviews       - helmet & cors                 - reviewController    |
|        - /api/faqs                                          - faqController       |
|        - /api/comparisons                                   - comparisonController|
|        - /api/feedback                                      - feedbackController  |
|        - /api/admin                                         - adminController     |
+----------------------------------------+------------------------------------------+
                                         |
                                         | (better-sqlite3 / Prepared SQL Statements)
                                         v
+-----------------------------------------------------------------------------------+
|                             PERSISTENCE LAYER (SQLite)                            |
|                                                                                   |
|  - users                 - products              - reviews                        |
|  - company               - faqs                  - comparison_products            |
|  - website_feedback      - product_images                                         |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                           EXTERNAL INTEGRATIONS                                   |
|                                                                                   |
|  [ 💬 WhatsApp Business API / Web Link ]  (https://wa.me/919876543210?text=...)  |
+-----------------------------------------------------------------------------------+
```

## Relational Schema Mapping

```sql
users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT,
  role TEXT CHECK (role IN ('CUSTOMER', 'ADMIN')) DEFAULT 'CUSTOMER',
  farm_location TEXT,
  farm_size TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price REAL NOT NULL,
  pack_size TEXT NOT NULL,
  category TEXT NOT NULL,
  fish_type TEXT NOT NULL,
  protein REAL NOT NULL,
  fat REAL NOT NULL,
  feed_type TEXT NOT NULL,
  recommended_fish_size TEXT NOT NULL,
  feeding_instructions TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT CHECK (status IN ('IN_STOCK', 'OUT_OF_STOCK')) DEFAULT 'IN_STOCK',
  image TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT NOT NULL,
  is_approved INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

company (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name TEXT NOT NULL,
  description TEXT NOT NULL,
  gst_number TEXT,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  ceo_name TEXT NOT NULL,
  ceo_image TEXT NOT NULL,
  ceo_phone TEXT NOT NULL,
  ceo_email TEXT NOT NULL,
  ceo_bio TEXT NOT NULL,
  mission TEXT NOT NULL,
  vision TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---
