# ClinicConnect

A comprehensive healthcare management system built with React, Express, and PostgreSQL.

## ⚡ Quick Start (TL;DR)

```bash
# 1. Install dependencies
npm install

# 2. Create .env file with your database URL
echo "DATABASE_URL=your-postgres-url" > .env
echo "JWT_SECRET=$(openssl rand -base64 64)" >> .env
echo "SESSION_SECRET=$(openssl rand -base64 64)" >> .env

# 3. Set up database
npm run db:push

# 4. Start the application
npm run dev

# 5. Open http://localhost:5001
# Login: admin / admin123
```

## 📋 Table of Contents

- [Quick Start](#-quick-start-tldr)
- [About](#about)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Default Credentials](#default-credentials)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [Production Deployment](#production-deployment)

## 🏥 About

ClinicConnect is a full-stack healthcare management system that provides:
- Patient management and records
- Appointment scheduling
- Medical consultations
- Prescription management
- Laboratory tracking
- Role-based access control (RBAC)
- Staff notifications and messaging

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **PostgreSQL** (v14 or higher) - either local installation or cloud service like [Neon](https://neon.tech)

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CC-2
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Database

You have two options for the database:

#### Option A: Cloud Database (Neon - Recommended)

1. Create a free account at [https://neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string (format: `postgresql://user:password@host/database?sslmode=require`)

#### Option B: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a database:
   ```bash
   createdb clinicconnect
   ```
3. Your connection string will be: `postgresql://localhost/clinicconnect`

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Required: Database connection
DATABASE_URL=postgresql://user:password@host/database

# Required: Security secrets (generate with: openssl rand -base64 64)
JWT_SECRET=your-secure-jwt-secret-here
SESSION_SECRET=your-secure-session-secret-here

# Optional: Server port (default: 5001)
PORT=5001

# Optional: Environment
NODE_ENV=development
```

**Important:** Generate secure secrets using:
```bash
openssl rand -base64 64
```

### 5. Initialize Database Schema

Push the database schema:

```bash
npm run db:push
```

## 🚀 Running the Application

### Development Mode

The application runs in a single development server that serves both the backend API and frontend:

```bash
npm run dev
```

Once started, you'll see:
```
🚀 Server running on port 5001
📍 Environment: development
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5001
```

The development server serves both the API endpoints and the React frontend.

### ✅ How to Know Everything is Working

When the server starts successfully, you should see:
```
✓ Database connected successfully
✓ Environment configuration validated
🚀 Server running on port 5001
📍 Environment: development
✅ Application ready at http://localhost:5001
```

In your browser, you should see the ClinicConnect login page without any console errors.

### Architecture Overview

```
┌─────────────────────────────────────────────┐
│         Your Browser (localhost:5001)       │
│  ┌─────────────────┐  ┌──────────────────┐ │
│  │  React Frontend │  │   Express API    │ │
│  │   (Vite Built)  │  │  /api/patients   │ │
│  │                 │  │  /api/visits     │ │
│  └─────────────────┘  └──────────────────┘ │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
         ┌──────────────────┐
         │   PostgreSQL DB  │
         │  (Local/Neon)    │
         └──────────────────┘
```

## 🔑 Default Credentials

After the database is set up, you can log in with:

- **Username:** `admin`
- **Password:** `admin123`

> **Note:** In development mode, authentication may be simplified for easier testing. Check the seed files for additional test accounts.

## 🐛 Troubleshooting

### Common Issues and Solutions

#### ❌ Server won't start / Port Already in Use

```bash
# Check what's using port 5001
lsof -i :5001

# Kill the process
kill -9 $(lsof -ti:5001)

# Or specify a different port in .env
echo "PORT=5002" >> .env
```

#### ❌ "DATABASE_URL must be set"

```bash
# 1. Create .env file if it doesn't exist
touch .env

# 2. Add your database URL
echo "DATABASE_URL=postgresql://your-db-url" >> .env

# 3. Test the connection
psql <your_database_url>
```

#### ❌ "Cannot find module" errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

#### ❌ Port 5000 Conflict (macOS)

On macOS, port 5000 is often used by AirPlay Receiver. This is why the application uses port 5001 by default. If you still have conflicts, change the `PORT` in your `.env` file.

#### ❌ Missing Environment Variables

The server will fail to start without these required variables:
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - JWT token secret
- `SESSION_SECRET` - Session cookie secret

Generate secure secrets with:
```bash
openssl rand -base64 64
```

#### ❌ Application loads but shows errors

Make sure you've run database migrations:
```bash
npm run db:push
```

### Troubleshooting Flowchart

```
Server won't start?
    │
    ├─→ Check .env file exists → No? Create it with required vars
    │
    ├─→ Check DATABASE_URL set → No? Add database connection string
    │
    ├─→ Port in use? → Yes? Kill process or change PORT in .env
    │
    ├─→ Dependencies installed? → No? Run npm install
    │
    └─→ Database schema up to date? → No? Run npm run db:push

Still having issues?
    → Check the additional documentation files in the repository
    → Review server/index.ts for environment variable requirements
```

## 💻 Development

### Available Scripts

- `npm run dev` - Start development server (backend + frontend on port 5001)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

### Project Structure

```
CC-2/
├── client/          # React frontend application
├── server/          # Express backend API
├── shared/          # Shared types and utilities
├── uploads/         # File uploads directory
├── package.json     # Dependencies and scripts
└── vite.config.ts   # Vite configuration
```

### Technology Stack

**Frontend:**
- React 19
- TypeScript
- Tailwind CSS
- Radix UI Components
- TanStack Query
- Wouter (routing)

**Backend:**
- Node.js
- Express 5
- PostgreSQL
- Drizzle ORM
- Passport.js (authentication)
- Express Session

## 🚢 Production Deployment

### Build for Production

```bash
# Build both frontend and backend
npm run build
```

This creates:
- `dist/client/` - Frontend static files
- `dist/index.js` - Backend server bundle

### Start Production Server

```bash
npm start
```

### Environment Variables for Production

Ensure all required variables are set:

```bash
DATABASE_URL=postgresql://...
JWT_SECRET=<secure-secret>
SESSION_SECRET=<secure-secret>
NODE_ENV=production
PORT=5001
```

### Docker Deployment

Docker configuration files are available:
- `docker-compose.production.yml` - Production setup
- `docker-compose.optimized.yml` - Optimized setup
- `Dockerfile.optimized` - Optimized Docker build

See deployment documentation files for detailed instructions:
- `DEPLOYMENT_READY.md`
- `DIGITALOCEAN_DEPLOYMENT.md`
- `QUICK_DEPLOY.md`

## 📚 Additional Documentation

The repository includes extensive documentation:

- `QUICK_START.md` - Quick start guide
- `SETUP_GUIDE.md` - Detailed setup instructions
- `RBAC_README.md` - Role-based access control guide
- `API_GUIDE.md` - API endpoints documentation
- `CONSULTATION_QUICKSTART.md` - Consultation feature guide
- And many more in the root directory

## 🔐 Security Notes

- Always use strong, unique secrets for `JWT_SECRET` and `SESSION_SECRET`
- Never commit `.env` file to version control
- Use environment variables for all sensitive data
- Enable SSL/TLS in production
- Keep dependencies updated regularly

## 📄 License

MIT

---

**Need Help?**

If you encounter any issues not covered in this README, check the troubleshooting section or review the additional documentation files in the repository.
