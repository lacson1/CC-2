# 🌐 How to Access Your ClinicConnect App

## Quick Start (Local Development)

### Step 1: Start the Database
```bash
docker start clinicconnect-postgres
```

If the database doesn't exist, run:
```bash
./setup-dev-db.sh
```

### Step 2: Start the Backend Server
```bash
npm run dev
```

This starts the server on **port 5001**.

### Step 3: Access the Application

Open your browser and go to:
```
http://localhost:5001
```

The app serves both the API and frontend on the same port in development mode.

---

## Access URLs

### Local Development
- **Application**: http://localhost:5001
- **API Health Check**: http://localhost:5001/api/health
- **API Docs**: http://localhost:5001/api/docs

### Production (After Deployment)
- **Application**: https://your-app-name.ondigitalocean.app
- **API Health Check**: https://your-app-name.ondigitalocean.app/api/health

---

## Default Login Credentials

After starting the app, you can log in with:

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Or create your own user** through the registration/login flow.

---

## Troubleshooting

### Server Not Starting

1. **Check if port 5001 is in use:**
   ```bash
   lsof -i :5001
   ```

2. **Kill any process using the port:**
   ```bash
   kill -9 $(lsof -ti:5001)
   ```

3. **Check database is running:**
   ```bash
   docker ps | grep clinicconnect-postgres
   ```

4. **Start database if needed:**
   ```bash
   docker start clinicconnect-postgres
   ```

### Database Connection Errors

1. **Verify DATABASE_URL in .env:**
   ```bash
   cat .env | grep DATABASE_URL
   ```
   Should show: `DATABASE_URL=postgresql://clinicuser:clinic_dev_2024@localhost:5434/clinicconnect`

2. **Test database connection:**
   ```bash
   psql postgresql://clinicuser:clinic_dev_2024@localhost:5434/clinicconnect
   ```

### Can't Access the App

1. **Check server logs:**
   ```bash
   tail -f /tmp/clinicconnect-server.log
   ```

2. **Verify server is running:**
   ```bash
   curl http://localhost:5001/api/health
   ```
   Should return: `{"status":"ok"}`

3. **Check browser console** for errors (F12 → Console tab)

---

## Running in Background

To run the server in the background:

```bash
npm run dev > /tmp/clinicconnect-server.log 2>&1 &
```

View logs:
```bash
tail -f /tmp/clinicconnect-server.log
```

Stop the server:
```bash
pkill -f "tsx.*server/index.ts"
```

---

## Development vs Production

### Development Mode (Current)
- Single server on port 5001
- Serves both API and frontend
- Hot module reload (HMR) enabled
- Detailed error messages

### Production Mode
- Built and optimized
- Static files served from `dist/public`
- API on same port
- Error messages minimized

---

## Next Steps

1. ✅ Start database: `docker start clinicconnect-postgres`
2. ✅ Start server: `npm run dev`
3. ✅ Open browser: http://localhost:5001
4. ✅ Login with: `admin` / `admin123`

---

**Last Updated**: December 9, 2024

