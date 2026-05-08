# ZentoMart Backend API

Node.js + Express + MongoDB backend for the ZentoMart admin panel and storefront.

## ⚙️ Setup

```bash
cd d:/ZentoMart/backend
npm install            # already done
cp .env.example .env   # if .env doesn't exist
```

Open `.env` and set:
- `MONGO_URI` — your Atlas connection string (already populated)
- `JWT_SECRET` — long random string (rotate before production)
- `SEED_ADMIN_PASSWORD` / `SEED_MANAGER_PASSWORD` — change before seeding to production

## 🌱 Seeding the database

Sample data scripts (only run if you want demo content):

```bash
npm run seed           # admins + 13 sample handbags + orders/customers/etc.
# or individually
npm run seed:admin     # 2 default admins (Owner + Manager)
npm run seed:products  # 13 sample handbags
npm run seed:rest      # orders, customers, reviews, promos, collections, banners, subscribers
```

## 🧹 Wiping demo data (clean slate)

To remove all dummy products/orders/customers/reviews/etc. while **keeping admin accounts and store settings**:

```bash
npm run wipe           # interactive — asks for confirmation (type WIPE)
npm run wipe:yes       # skip the confirmation prompt
```

After this, the admin Products list and the public storefront will be empty until you add real products via `/admin/products/new`.

## 🚀 Running

```bash
npm run dev    # nodemon, hot reload
npm start      # plain node
```

API will be at `http://localhost:5000`.

## 🧭 Endpoints (Phase 1 MVP)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/` | — | API info |
| GET | `/api/health` | — | Health check |
| POST | `/api/auth/login` | — | Login admin → JWT (rate-limited 5/15min) |
| POST | `/api/auth/register` | 🔄 | Register admin — public when DB is empty, **Owner-only** afterwards (rate-limited 10/hr) |
| POST | `/api/auth/logout` | — | Clear cookie |
| GET | `/api/auth/me` | ✅ | Current admin |
| GET | `/api/auth/admins` | 👑 | List all admins (Owner only) |
| DELETE | `/api/auth/admins/:id` | 👑 | Delete an admin (Owner only) |
| GET | `/api/products` | — | List (filter via `?search=`, `?style=`, `?material=`, `?color=`, `?minPrice=`, `?maxPrice=`, `?sort=`, `?limit=`) |
| GET | `/api/products/:id` | — | Single product (numeric or ObjectId) |
| GET | `/api/products/:id/related` | — | Related products |
| POST | `/api/products` | ✅ | Create |
| PUT | `/api/products/:id` | ✅ | Update |
| DELETE | `/api/products/:id` | ✅ | Delete |

## 👤 Creating admins via Postman

The register endpoint has **two modes** for safety:

### Mode A — DB is empty (bootstrap, no auth needed)

If there are zero admins in the database, the very first POST creates the **Owner** account. Role is forced to `Owner` regardless of what you send.

```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Your Name",
  "email": "you@yourcompany.com",
  "password": "a-strong-password",
  "avatar": "https://your-cdn.com/avatar.jpg"
}
```

Response:
```json
{
  "success": true,
  "bootstrap": true,
  "admin": { "id": "...", "name": "...", "email": "...", "role": "Owner", "avatar": "..." }
}
```

### Mode B — Admin already exists (Owner authentication required)

After the first admin is created, the endpoint requires a valid JWT from an **Owner**. Manager/Staff tokens get 403.

**Step 1** — Log in as Owner to get a token:
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{ "email": "admin@zentomart.com", "password": "admin123" }
```

Copy the `token` field from the response.

**Step 2** — Register a new admin using that token:
```
POST http://localhost:5000/api/auth/register
Authorization: Bearer <paste-token-here>
Content-Type: application/json

{
  "name": "New Manager",
  "email": "manager2@zentomart.com",
  "password": "secure-password",
  "role": "Manager",
  "avatar": "https://picsum.photos/seed/manager2/200"
}
```

Valid `role` values: `Owner`, `Manager`, `Staff`.

### Manage admins (Owner only)

```
# List
GET    http://localhost:5000/api/auth/admins
Authorization: Bearer <owner-token>

# Delete (cannot delete yourself)
DELETE http://localhost:5000/api/auth/admins/<adminId>
Authorization: Bearer <owner-token>
```

`✅` = JWT required (Bearer header **or** httpOnly cookie).

## 🔑 Default credentials (after seeding)

| Role | Email | Password |
|---|---|---|
| Owner | admin@zentomart.com | admin123 |
| Manager | manager@zentomart.com | manager123 |

## 🧪 Quick smoke test

```bash
# 1. Health
curl http://localhost:5000/api/health

# 2. List products
curl http://localhost:5000/api/products

# 3. Login (returns token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@zentomart.com","password":"admin123"}'

# 4. Create product (replace TOKEN)
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "name":"Test Bag","price":99,"style":"Tote","material":"Leather","colors":[{"name":"Black","code":"#000","image":"https://picsum.photos/600/750"}],"sizes":["M"],"stock":5,"mainImage":"https://picsum.photos/600/750"}'
```

## 📁 Structure

```
src/
├── config/db.js            # Mongoose connection
├── models/
│   ├── Admin.js            # bcrypt-hashed password, role
│   └── Product.js          # numeric `id` + ObjectId, color variants, auto-increment id
├── middleware/
│   ├── auth.js             # protect (JWT), authorize (role gate)
│   └── errorHandler.js     # global error handler + 404
├── controllers/
│   ├── authController.js   # login, logout, me
│   └── productController.js
├── routes/
│   ├── authRoutes.js       # rate-limited login
│   └── productRoutes.js    # validated POST/PUT
├── utils/
│   ├── seedAdmin.js
│   ├── seedProducts.js
│   └── productSeedData.js  # the 13 mock handbags
├── app.js                  # Express config (helmet, cors, etc.)
└── server.js               # Boot file
```

## 🔜 Phase 2 (next, if approved)

Orders, Customers, Promotions, Reviews, Collections, Banners, Subscribers, Analytics aggregates, Settings — plus wire the React frontend to call this API instead of localStorage.
