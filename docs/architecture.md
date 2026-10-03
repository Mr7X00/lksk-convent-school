# System Architecture — L.K.S.K Convent School Platform

## 1. Architectural Philosophy
The L.K.S.K Convent School platform is engineered with a strict decoupling between presentation (client) and core domain services (API). It is designed to scale from the current initial institutional portal to a full production ecosystem featuring:
- Public informative portal (admissions, academics, notices, gallery, mandatory disclosures)
- High-performance REST API services
- Secure Admin Panel (role-based access control for notices, enquiries, admissions, media)
- MongoDB persistent data layer

## 2. Directory Layout
```text
/
├── assets/                     # Master raw institutional assets
│   └── branding/               # Logos, vector crests, typography assets
├── backend/                    # Node.js + Express REST API
│   ├── src/
│   │   ├── config/             # Database connection, env loader
│   │   ├── controllers/        # Request handlers & domain logic
│   │   ├── middlewares/        # Auth, rate limiting, error handling, validation
│   │   ├── models/             # Mongoose database schemas
│   │   ├── routes/             # Express route definitions
│   │   ├── utils/              # Helper utilities, logger, response formatters
│   │   ├── app.js              # Express app initialization & middleware stack
│   │   └── server.js           # Server listen & lifecycle hooks
│   ├── .env.example            # Environment variables blueprint
│   └── package.json            # Backend dependencies
├── frontend/                   # HTML5, Tailwind CSS, Vanilla JavaScript
│   ├── public/                 # Static assets served at root
│   │   └── assets/branding/    # Client-accessible brand assets
│   ├── src/
│   │   ├── css/                # Tailwind & custom CSS rules
│   │   └── js/                 # Modular Vanilla JavaScript client code
│   ├── index.html              # Entry HTML document
│   ├── tailwind.config.js      # School design system & brand tokens
│   ├── postcss.config.js       # PostCSS pipeline
│   ├── vite.config.js          # Development server & API proxy
│   ├── .env.example            # Frontend environment blueprint
│   └── package.json            # Frontend tooling & dependencies
├── docs/                       # Architectural documentation & API specifications
├── .gitignore                  # Git exclusion rules
├── .env.example                # Root environment reference
├── package.json                # Monorepo management scripts
└── README.md                   # Comprehensive getting started guide
```

## 3. Technology Stack & Rationale
| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend UI** | HTML5 Semantic Markup | SEO friendly, accessible, zero runtime overhead |
| **Frontend Styling** | Tailwind CSS v3 | Utility-first, compile-time purge, predictable design tokens |
| **Frontend Behavior** | Vanilla JavaScript (ESNext) | Maximum performance, no heavy framework lock-in, mobile optimized |
| **Frontend Tooling** | Vite | Lightning-fast HMR, transparent reverse proxy to API, optimized static bundle |
| **Backend API** | Node.js + Express.js | Industry standard, lightweight RESTful service architecture |
| **Database** | MongoDB + Mongoose | Document schema flexibility for notices, admissions, and content |
| **Security Layer** | Helmet, Express-Rate-Limit, CORS | Protection against XSS, clickjacking, and brute force requests |

## 4. Security Principles
1. **Never Hardcode Secrets**: All credentials, database connection strings, and tokens must live in `.env` files.
2. **Reverse Proxying**: In development, Vite proxies `/api` calls directly to the Express backend (`http://localhost:5000`) without exposing backend ports to client cross-origin issues.
3. **Resilient Database Layer**: If MongoDB is temporarily offline or recovering, the API server handles the state gracefully, continuing to report status via the health telemetry endpoint.
