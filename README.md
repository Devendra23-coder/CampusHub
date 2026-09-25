# CampusHub

A full-stack college campus management and student community platform.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Auth | JWT + bcrypt |

## Features

**Student:**
- Register & Login
- Dashboard with summary cards
- Browse & search events
- Register / cancel event registration
- QR code for registered events
- Browse campus clubs
- View announcements
- View & edit profile

**Admin:**
- Admin dashboard with stats
- Create / edit / delete events
- View event registrations & mark attendance
- Manage clubs
- Manage announcements
- View & manage users

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MySQL](https://dev.mysql.com/downloads/) v8+

## Setup

### 1. Database

```bash
# Log into MySQL
mysql -u root -p

# Run the schema (creates database + tables)
source e:/Campus hub/server/schema.sql

# Load sample data (optional)
source e:/Campus hub/server/seed.sql
```

### 2. Backend

```bash
cd server

# Install dependencies (already done if cloned)
npm install

# Edit .env with your MySQL password
# Then start the server
npm start
```

The server runs at **http://localhost:5000**

### 3. Frontend

```bash
cd client

# Install dependencies (already done if cloned)
npm install

# Start dev server
npm run dev
```

The app runs at **http://localhost:5173**

## Environment Variables

Create `server/.env` (see `.env.example`):

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=campushub
DB_PORT=3306
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
```

## Test Accounts (from seed data)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@campushub.com | admin123 |
| Student | rahul@student.com | student123 |
| Student | priya@student.com | student123 |

## API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Auth |
| GET | /api/events | Auth |
| GET | /api/events/:id | Auth |
| POST | /api/events | Admin |
| PUT | /api/events/:id | Admin |
| DELETE | /api/events/:id | Admin |
| POST | /api/registrations | Auth |
| GET | /api/registrations/my | Auth |
| PUT | /api/registrations/:id/cancel | Auth |
| GET | /api/registrations/event/:eventId | Admin |
| GET | /api/clubs | Auth |
| GET | /api/clubs/:id | Auth |
| POST | /api/clubs | Admin |
| PUT | /api/clubs/:id | Admin |
| DELETE | /api/clubs/:id | Admin |
| GET | /api/announcements | Auth |
| POST | /api/announcements | Admin |
| PUT | /api/announcements/:id | Admin |
| DELETE | /api/announcements/:id | Admin |
| GET | /api/users/profile | Auth |
| PUT | /api/users/profile | Auth |
| GET | /api/users | Admin |
| DELETE | /api/users/:id | Admin |
| POST | /api/attendance | Admin |
| GET | /api/attendance/event/:eventId | Admin |

## Project Structure

```
client/src/
├── components/      → Reusable UI components
├── context/         → Auth state (React Context)
├── hooks/           → Custom hooks
├── pages/           → Route-level pages
├── services/        → API calls (Axios)
└── App.jsx          → Route definitions

server/
├── config/          → Database connection
├── middleware/       → Auth & role check
├── controllers/     → Business logic
├── routes/          → URL mappings
├── utils/           → Validators
└── server.js        → Entry point
```
