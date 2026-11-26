# 🛒 CampusCart — MUJ Student Marketplace

A full-stack web application for **Manipal University Jaipur (MUJ)** students to buy and sell second-hand books, notes, electronics and more within the campus community.

**🔗 Live demo:** https://campuscart-ten.vercel.app
> The backend runs on a free hosting plan, so the first request can take up to a minute while it wakes up.

[![CI](https://github.com/SrivArchit/CampusCart/actions/workflows/ci.yml/badge.svg)](https://github.com/SrivArchit/CampusCart/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Express](https://img.shields.io/badge/Express-5-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-blue?logo=tailwindcss)

<!-- Screenshots: save 2–3 images in docs/screenshots/ and uncomment these lines.
![Home page](docs/screenshots/home.png)
![Listing page](docs/screenshots/listing.png)
-->

## 🧠 Engineering highlights

- **College-only sign-up**: the API rejects any email that doesn't end in `@muj.manipal.edu`.
- **Auth and ownership checks**: JWT-protected routes, and only a listing's seller can edit or delete it (everyone else gets `403`).
- **One endpoint for browsing**: `GET /api/listings` combines case-insensitive search, category filtering, four sort orders (newest, oldest, price up, price down) and pagination.
- **Image pipeline**: up to 5 images per listing (5 MB each), uploaded through Multer straight to Cloudinary's CDN.
- **Hardened API**: Helmet security headers, rate limiting on auth routes (15 attempts per 15 minutes), a NoSQL-injection sanitizer and CORS locked to the frontend's URL.
- **Deployment**: frontend on Vercel, backend on Render, database on MongoDB Atlas. GitHub Actions lints and builds the frontend and checks the backend on every push.

## ✨ Features

- 🔐 **College-Only Auth** — Only `@muj.manipal.edu` emails can sign up
- 📦 **Full CRUD** — Create, edit, delete, and mark listings as sold
- 🖼️ **Multi-Image Upload** — Up to 5 images per listing with Cloudinary CDN
- 🎠 **Image Carousel** — Amazon-style slider with hover zoom, swipe, and thumbnails
- 🔍 **Search & Filter** — Real-time search with category filters and pagination
- 💬 **WhatsApp & Email** — Contact sellers directly via WhatsApp or email
- 📱 **Fully Responsive** — Mobile-first design with hamburger menu
- 🛡️ **Secure** — JWT auth, Helmet headers, rate limiting

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TailwindCSS 4 |
| Backend | Express.js 5, Node.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (JSON Web Tokens) |
| Images | Cloudinary + Multer |
| Notifications | React Hot Toast |

## 📁 Project Structure

```
campuscart/
├── backend/
│   ├── config/         # DB & Cloudinary config
│   ├── controllers/    # Auth & Listing logic
│   ├── middleware/      # JWT auth middleware
│   ├── models/          # User & Listing schemas
│   ├── routes/          # API routes
│   ├── utils/           # Token generation
│   └── server.js        # Express app entry
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, ListingCard, ImageCarousel, Skeletons
│   │   ├── context/     # AuthContext (React Context API)
│   │   ├── pages/       # Home, Login, Signup, AddListing, EditListing, ItemDetails, MyListings
│   │   ├── services/    # Axios API client
│   │   └── App.jsx      # Router & protected routes
│   └── index.html
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repo
```bash
git clone https://github.com/SrivArchit/CampusCart.git
cd CampusCart
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📡 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Private | Get current user |
| GET | `/api/listings` | Public | Get all listings (paginated) |
| GET | `/api/listings/:id` | Public | Get single listing |
| GET | `/api/listings/my` | Private | Get user's listings |
| POST | `/api/listings` | Private | Create listing |
| PUT | `/api/listings/:id` | Private | Update listing |
| DELETE | `/api/listings/:id` | Private | Delete listing |
| PATCH | `/api/listings/:id/sold` | Private | Mark as sold |

## 👨‍💻 Author

**Archit Srivastava** — MUJ CSE

## 📄 License

This project is for educational purposes (PBL - Project Based Learning).
