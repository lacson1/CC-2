# 🚀 Quick Start - Run Your App

## Start the Application

### 1. Start Database (if not running)
```bash
docker start clinicconnect-postgres
```

### 2. Start the Server
```bash
npm run dev
```

### 3. Access the App

Open your browser and go to:
```
http://localhost:5001
```

## Default Login

- **Username**: `admin`
- **Password**: `admin123`

## If Server Doesn't Start

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

5. **Try starting server again:**
   ```bash
   npm run dev
   ```

## Server Status

The server will show:
```
🚀 Server running on port 5001
📍 Environment: development
```

Once you see this message, the app is ready!

## Troubleshooting

- **"Cannot find module" errors**: Run `npm install`
- **Database connection errors**: Ensure Docker container is running
- **Port already in use**: Kill the process or change PORT in .env

---

**The app serves both frontend and API on port 5001 in development mode.**

