# Node.js Full-Stack Project — Modules 1–4

Covers the full course syllabus in one project:

- **Module 1** — Node.js core/local modules, buffers, NPM/`package.json`, REPL practice
- **Module 2** — File System module (sync/async), raw `http` module server, Express server/routing/middleware, static resources
- **Module 3** — MongoDB connectivity via Mongoose, full CRUD, **JWT authentication**, and **role-based access control** (`admin` / `user`)
- **Module 4** — React frontend (loaded via CDN, no build step) that consumes the API

Built with an **MVC-style structure**: Models → Controllers → Routes, using **Express**.

## Project structure

```
nodejs-auth-project/
├── config/
│   └── db.js                    # MongoDB connection (Module 3)
├── models/                      # Mongoose schemas (Module 3)
│   ├── User.js                  # name, email, hashed password, role
│   └── Product.js
├── controllers/                 # Business logic (MVC "C")
│   ├── authController.js
│   ├── productController.js
│   └── userController.js
├── middleware/
│   └── auth.js                  # protect (JWT verify) + adminOnly (role check)
├── routes/                      # Thin route definitions, wired to controllers
│   ├── authRoutes.js
│   ├── productRoutes.js
│   └── userRoutes.js
├── modules-demo/                # Module 1 & 2 standalone practical demos
│   ├── coreModules.js           # os, path, util, Buffers, local modules
│   ├── localModuleExample.js    # example user-defined local module
│   ├── fileSystemDemo.js        # sync + async fs: create/read/update/delete
│   ├── httpServerDemo.js        # raw `http` module server (no Express)
│   └── data/sample.txt
├── public/
│   └── index.html               # static resource served by Express static middleware
├── client/
│   └── index.html               # Module 4: React (CDN) frontend, served at /app
├── .env.example
├── package.json
└── server.js                    # Express app entry point
```

## Setup

```bash
npm install
cp .env.example .env   # then edit MONGO_URI / JWT_SECRET
npm start               # or: npm run dev  (nodemon auto-restart)
```

`.env` values:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/nodejs_auth_db
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=1d
```

Once running:
- API base: `http://localhost:5000/api`
- Static demo page: `http://localhost:5000/index.html`
- React frontend: `http://localhost:5000/app` (or open `client/index.html` directly)

## Module 1 & 2 practicals (standalone scripts)

These don't need MongoDB — run them independently to see the concepts in isolation:

```bash
npm run demo:core   # os/path/util core modules, Buffers, local modules, REPL-style output
npm run demo:fs     # synchronous & asynchronous file create/read/update/delete
npm run demo:http   # raw Node http module server on http://localhost:4000
```

For REPL practice (Module 1), just run `node` in your terminal and try commands like:
```js
> const os = require('os');
> os.platform();
> 2 + 2
> .exit
```

## Module 3: Auth & role-based API

Two roles only: **admin** and **user**. Every protected route requires:
```
Authorization: Bearer <jwt_token>
```

### Auth (`/api/auth`)
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register (`role`: `"user"` default or `"admin"`) |
| POST | `/login` | Public | Login, returns JWT |
| GET | `/me` | Authenticated | Current user profile |

### Products (`/api/products`)
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/` | Any authenticated user | List all products |
| GET | `/:id` | Any authenticated user | Get one product |
| POST | `/` | **Admin only** | Create product |
| PUT | `/:id` | **Admin only** | Update product |
| DELETE | `/:id` | **Admin only** | Delete product |

### Users (`/api/users`) — Admin only
| Method | Route | Description |
|---|---|---|
| GET | `/` | List all users |
| GET | `/:id` | Get one user |
| DELETE | `/:id` | Delete a user |

A normal user hitting an admin-only route gets `403`:
```json
{ "success": false, "message": "Access denied: admin role required" }
```
Missing/invalid token gets `401`:
```json
{ "success": false, "message": "Not authorized, no token provided" }
```

### Quick test with curl
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@test.com","password":"admin123","role":"admin"}'

curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PASTE_TOKEN_HERE" \
  -d '{"name":"Keyboard","price":1200,"quantity":10}'
```

## Module 4: React frontend

`client/index.html` is a single-file React app (React + Babel loaded from CDN — no `npm run build` needed). It lets you:
- Register/login as `admin` or `user`
- View the product list (any logged-in user)
- Add/delete products (admin only — button is hidden for normal users)

Open it via `http://localhost:5000/app` once the server is running (it calls the API at `http://localhost:5000/api`).

## How the MVC + auth flow fits together

1. **Model** (`models/`) defines the Mongoose schema/validation and password hashing.
2. **Controller** (`controllers/`) contains the actual logic for each endpoint (talks to the model, builds the response).
3. **Route** (`routes/`) just maps an HTTP verb + path to a controller function, applying `protect`/`adminOnly` middleware where needed.
4. **Middleware** (`middleware/auth.js`) verifies the JWT and loads `req.user`; `adminOnly` then checks `req.user.role`.
5. `server.js` wires everything together with Express, mounts the routers, and serves the static/React frontend.
