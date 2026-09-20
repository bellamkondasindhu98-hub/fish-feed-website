# 🐟 AquaGrow Feeds India Pvt. Ltd. — Full-Stack Platform

> A production-grade web platform and administrative control center for **AquaGrow Feeds India Pvt. Ltd.**, a premier Indian aquaculture feed manufacturing company.

---

## 🌟 Core Business Flow & Direct WhatsApp Commerce

AquaGrow Feeds implements a **Direct WhatsApp Order model** tailored for agricultural and commercial aquaculture transactions across India:

1. **Authentication Gate**: 
   - Unauthenticated visitors are routed to `/login` or `/register`.
   - Upon logging in as a **Customer** (or registering a new account), the full commercial catalog and company resources become accessible.
2. **Product Catalog & Search**:
   - Filter feeds by category (*Floating Feed, Sinking Pellets, Nursery Micro-Feed, Broodstock Special, Functional Feed*).
   - Real-time search by feed name, fish species (*Rohu, Catla, Pangasius, Tilapia, Seabass, Murrel, Freshwater Prawn*), or protein level.
3. **Product Inspection & Nutrients**:
   - Comprehensive guaranteed analysis: Crude Protein (%), Crude Fat (%), Crude Fiber, Moisture, Pellet Size (mm), Recommended Stage, and Feeding Rate (% body weight/day).
4. **Stock Availability & Badges**:
   - Live inventory tracking: `🟢 IN STOCK` or `🔴 OUT OF STOCK`.
   - If stock is `0`, WhatsApp ordering is gracefully disabled with an explanatory prompt.
5. **💬 Direct "Order via WhatsApp"**:
   - **Strict Requirement**: *No shopping cart, no checkout, and no payment gateway.*
   - Clicking "Order via WhatsApp" opens WhatsApp (`https://wa.me/<company_phone>`) with a pre-populated, structured message containing product name, pack size, price, and customer inquiry.
   - The farmer and company executive negotiate bulk quantity, logistics, and delivery personally.
6. **Product Comparison**:
   - Multi-product comparison matrix comparing AquaGrow feeds with industry benchmarks (protein %, fat %, pellet float time, FCR, price per kg).
7. **Social Sharing**:
   - Instant share modal with direct link copy, WhatsApp share, Telegram share, and Twitter share.
8. **Customer Reviews & Website Feedback**:
   - Authenticated farmers can submit 5-star ratings and reviews on feed performance.
   - General website feedback form for farmer inquiries.
9. **Company & CEO Profile**:
   - Full corporate story, ISO & MPEDA certifications, quality standards, and dedicated profile for founder & CEO **Dr. Rajesh Varma**.

---

## 🏢 Platform Architecture

The system consists of **4 core components** plus an **Assets suite**:

```
fish-feed-website/
├── frontend/                  # React 18 + TypeScript + Vite + Tailwind CSS Storefront
│   ├── src/
│   │   ├── components/        # Reusable UI components (Navbar, Footer, Hero, Cards, Modals)
│   │   ├── contexts/          # Auth, Company, and Comparison React Contexts
│   │   ├── layouts/           # MainLayout & AuthLayout
│   │   ├── pages/             # Customer Pages (Catalog, Details, Compare, CEO, FAQs, etc.)
│   │   ├── services/          # Axios REST API Client with JWT Interceptors
│   │   ├── types/             # TypeScript Interfaces
│   │   └── utils/             # Formatters, WhatsApp URL generator
│   └── public/assets/images/  # SVG Vector Assets (Logo, Hero, CEO, Feed bags)
│
├── admin-dashboard/           # Executive Admin Control Center
│   ├── layouts/               # AdminLayout with responsive sidebar & user badge
│   └── pages/                 # 8 Dedicated Management Views:
│       ├── AdminDashboard     # 6 Live Metric Cards & Quick Links
│       ├── AdminProducts      # Catalog table with inline Stock quick-updater
│       ├── AdminProductForm   # Create / Edit product with nutritional analysis
│       ├── AdminCompany       # Edit Company Contact, WhatsApp #, and CEO profile
│       ├── AdminReviews       # Customer review moderation
│       ├── AdminFeedback      # Website feedback & farmer queries
│       ├── AdminFAQs          # FAQ CRUD operations
│       └── AdminComparisons   # Competitor benchmark matrix management
│
├── backend/                   # Node.js + Express REST API Server
│   ├── controllers/           # Auth, Product, Company, Review, FAQ, Feedback, Admin controllers
│   ├── middleware/            # JWT auth, Role guards, Rate limiter, Error handler
│   ├── routes/                # Express API Route definitions
│   ├── tests/                 # Automated API integration test suite
│   ├── fish_feed.db           # SQLite database instance (via better-sqlite3)
│   └── server.js              # Server entry point (Port 5000)
│
└── database/                  # SQL Schema & Seed Migration Scripts
    ├── schema/schema.sql      # Standard relational SQL schema
    └── seed/seed.js           # Automated seed script with initial accounts & catalog
```

---

## 🔑 Default Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@fishfeed.com` | `Admin@12345` | Full Executive Portal (`/admin`) + Customer Storefront |
| **Farmer (Customer)** | `farmer@krishi.com` | `Farmer@12345` | Customer Storefront (`/home`, `/products`, etc.) |

*(New customers can also register at `/register`)*.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **npm**: v9+

### 2. Database Initialization
Seed the SQLite database with products, reviews, company info, CEO profile, FAQs, and accounts:
```bash
# From the root directory:
npm run seed
```

### 3. Start the Backend API Server
```bash
# Starts Express REST API on http://localhost:5000
npm run backend
```

### 4. Run Backend Integration Tests
```bash
npm run test:backend
```

### 5. Start the Frontend Application
```bash
# Starts Vite Dev Server on http://localhost:3000
npm run frontend
```

### 6. Build Frontend for Production
```bash
npm run build:frontend
```

---

## 📡 REST API Endpoints Overview

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new customer account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/auth/me` | Authenticated | Get current profile |
| `GET` | `/api/products` | Authenticated | List all products with filters |
| `GET` | `/api/products/search?q=` | Authenticated | Full-text product search |
| `GET` | `/api/products/:id` | Authenticated | Get product specs, reviews & recommendations |
| `POST` | `/api/products` | Admin | Create new feed product |
| `PUT` | `/api/products/:id` | Admin | Update product details |
| `PATCH` | `/api/products/:id/stock`| Admin | Fast update stock quantity & status |
| `DELETE`| `/api/products/:id` | Admin | Remove product |
| `GET` | `/api/company` | Authenticated | Get company profile, CEO info & WhatsApp number |
| `PUT` | `/api/company` | Admin | Update company details & WhatsApp number |
| `POST` | `/api/products/:id/reviews`| Authenticated | Submit farmer review |
| `GET` | `/api/reviews/admin` | Admin | List all reviews for moderation |
| `DELETE`| `/api/reviews/:id` | Admin | Delete a review |
| `POST` | `/api/feedback` | Authenticated | Submit website feedback |
| `GET` | `/api/admin/metrics` | Admin | Dashboard summary (Products, Stock, Reviews, etc.) |
| `GET` | `/api/comparisons` | Authenticated | Get competitor benchmark matrix |

---

## 🎨 Visual Assets Summary

High-resolution, scalable SVG illustrations created in `frontend/public/assets/images/`:
- `logo.svg`: Company emblem featuring aquaculture fish and aquatic wave crest.
- `hero_aquaculture.svg`: Modern vector aquaculture facility with aeration systems and ponds.
- `ceo.svg`: Executive vector portrait of Founder & CEO Dr. Rajesh Varma.
- `products/floating_pellets_32_4.svg`: AquaGrow Supreme 32/4 Floating Feed.
- `products/sinking_pellets_28_3.svg`: AquaGrow BottomFeeder Sinking Pellets.
- `products/fry_starter_crush.svg`: AquaGrow MicroStarter Nursery Crumble.
- `products/broodstock_vitality.svg`: AquaGrow BroodMaster Vitality Pellets.
- `products/tilapia_growth_pro.svg`: AquaGrow Tilapia Growth Pro 30/3.
- `products/pangasius_bulk_max.svg`: AquaGrow Pangasius BulkMax 24/3.
- `products/seabass_carnivore_45_10.svg`: AquaGrow SeaBass Elite Carnivore 45/10.
- `products/immune_shield_functional.svg`: AquaGrow ImmuneShield Bio-Fortified Feed.

---

## 🔒 Security & Best Practices
- **Password Security**: Salted bcrypt hashing with 10 salt rounds.
- **JWT Authentication**: 7-day secure tokens stored in browser localStorage.
- **HTTP Protection**: Helmet security headers, CORS origin whitelisting, and API rate limiting.
- **Input Sanitization**: Parameterized SQLite queries to prevent SQL injection vulnerabilities.
- **Role-Based Guards**: React Router protected route wrappers for both customer-authenticated pages and admin-restricted dashboards.

---
© 2026 AquaGrow Feeds India Pvt. Ltd. All rights reserved.
