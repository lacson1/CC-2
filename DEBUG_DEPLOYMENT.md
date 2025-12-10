# 🐛 Debug DigitalOcean Deployment

## Quick Debug Checklist

### 1. Check App Exists
- Go to: https://cloud.digitalocean.com/apps
- Look for app: `clinicconnect-2`
- App ID: `b2c2085f-d938-428c-9299-1165af8dfc3c`

### 2. Check Latest Deployment Status

**Via Dashboard:**
1. Go to: https://cloud.digitalocean.com/apps/b2c2085f-d938-428c-9299-1165af8dfc3c/deployments
2. Check the latest deployment:
   - ✅ **ACTIVE** = Working
   - ⏳ **BUILDING/DEPLOYING** = In progress
   - ❌ **ERROR** = Failed

**Via CLI:**
```bash
doctl apps list-deployments b2c2085f-d938-428c-9299-1165af8dfc3c
```

### 3. Check Build Logs

**If deployment failed:**
1. Click on the failed deployment
2. Go to **"Build Logs"** tab
3. Look for errors:
   - `Error:`
   - `Failed:`
   - `Cannot find module`
   - `Missing:`
   - `DATABASE_URL must be set`
   - `SESSION_SECRET environment variable is required`

### 4. Check Runtime Logs

**If deployment is active but app not working:**
1. Go to: https://cloud.digitalocean.com/apps/b2c2085f-d938-428c-9299-1165af8dfc3c/runtime_logs
2. Look for:
   - ✅ `✅ Server running on port 5001`
   - ✅ `✅ Using PostgreSQL session store with SSL`
   - ✅ `✅ Database connection verified`
   - ❌ `SESSION_SECRET environment variable is required`
   - ❌ `Failed to initialize PostgreSQL session store`
   - ❌ `Falling back to MemoryStore`

### 5. Check Environment Variables

**Critical Variables:**
1. Go to: https://cloud.digitalocean.com/apps/b2c2085f-d938-428c-9299-1165af8dfc3c/settings
2. Scroll to **"App-Level Environment Variables"**
3. Verify these exist and are set as **SECRET** type (🔒):

   **JWT_SECRET:**
   - Must exist
   - Type: SECRET (not plain text)
   - Value: Should be 64+ characters

   **SESSION_SECRET:**
   - Must exist
   - Type: SECRET (not plain text)
   - Value: Must be 32+ characters (64+ recommended)

   **DATABASE_URL:**
   - Should be: `${db.DATABASE_URL}`
   - Type: SECRET
   - Auto-injected from database

### 6. Check Database

1. Go to: https://cloud.digitalocean.com/databases
2. Verify database exists and is running
3. Check database name matches: `db`
4. Verify region matches app region

### 7. Test Health Endpoint

**Get App URL:**
- Check dashboard for app URL
- Or: `doctl apps get b2c2085f-d938-428c-9299-1165af8dfc3c --format LiveURL`

**Test:**
```bash
curl https://your-app-url.ondigitalocean.app/api/health
```

Should return: `{"status":"ok"}`

## Common Issues & Solutions

### Issue 1: SESSION_SECRET Missing/Invalid

**Symptoms:**
- `SESSION_SECRET environment variable is required in production`
- `SESSION_SECRET is too short`

**Fix:**
1. Go to App Settings → Environment Variables
2. Add/Update `SESSION_SECRET`:
   - Value: `ENvFYgDF2ObFj8DAvIcC2IOBGIgJ4Td77m46aV4LSZ4Ew7+Ze9AaYLZ+7K7+kWAF+d1G9aRvaRKVxtEx+W/RYw==`
   - Type: **SECRET** (🔒)
   - Scope: RUN_TIME
3. Redeploy

### Issue 2: Session Store Falls Back to MemoryStore

**Symptoms:**
- `Failed to initialize PostgreSQL session store`
- `Falling back to MemoryStore`

**Possible Causes:**
1. Database connection fails
2. Sessions table doesn't exist
3. Permissions issue

**Fix:**
1. Verify `DATABASE_URL` is set correctly
2. Check database is running and accessible
3. Sessions table should be created automatically
4. Check runtime logs for specific error

### Issue 3: Migration Timeout

**Symptoms:**
- Deployment hangs on "Pulling schema from database"
- Migration times out after 5 minutes

**Fix:**
- Migrations now have 5-minute timeout
- App will continue even if migrations fail
- Can run migrations manually later

### Issue 4: Build Failures

**Symptoms:**
- Deployment fails during build phase
- Build logs show errors

**Check:**
1. View build logs in dashboard
2. Look for:
   - Missing dependencies
   - TypeScript errors
   - Docker build issues
   - Missing files

**Fix:**
- Check `package.json` dependencies
- Verify all source files exist
- Check `Dockerfile.optimized` is correct

### Issue 5: Health Check Fails

**Symptoms:**
- Deployment completes but health check fails
- App URL returns error

**Check:**
1. Runtime logs for startup errors
2. Verify `PORT=5001` is set
3. Check health endpoint path: `/api/health`
4. Verify app is listening on port 5001

## Debug Commands

### Check Deployment Status
```bash
doctl apps list-deployments b2c2085f-d938-428c-9299-1165af8dfc3c
```

### Get Deployment Details
```bash
doctl apps get-deployment b2c2085f-d938-428c-9299-1165af8dfc3c <deployment-id>
```

### Get App Info
```bash
doctl apps get b2c2085f-d938-428c-9299-1165af8dfc3c
```

### Get App URL
```bash
doctl apps get b2c2085f-d938-428c-9299-1165af8dfc3c --format LiveURL
```

### View Logs (if available)
```bash
doctl apps logs b2c2085f-d938-428c-9299-1165af8dfc3c --type run
```

## Step-by-Step Debug Process

1. **Check if app exists**
   - Dashboard: https://cloud.digitalocean.com/apps
   - Look for `clinicconnect-2`

2. **Check latest deployment**
   - Dashboard: Deployments tab
   - Note the phase: ACTIVE, BUILDING, ERROR, etc.

3. **If ERROR:**
   - Click on failed deployment
   - Check Build Logs for errors
   - Check Runtime Logs for startup errors

4. **If BUILDING/DEPLOYING:**
   - Wait for completion
   - Monitor progress
   - Check logs when done

5. **If ACTIVE but not working:**
   - Check Runtime Logs
   - Verify environment variables
   - Test health endpoint
   - Check database connection

6. **Verify environment variables**
   - Settings → Environment Variables
   - Ensure SESSION_SECRET and JWT_SECRET are set as SECRET type

7. **Test the app**
   - Get app URL
   - Test: `curl https://app-url/api/health`
   - Try logging in

## Quick Links

- **App Dashboard**: https://cloud.digitalocean.com/apps/b2c2085f-d938-428c-9299-1165af8dfc3c
- **Deployments**: https://cloud.digitalocean.com/apps/b2c2085f-d938-428c-9299-1165af8dfc3c/deployments
- **Settings**: https://cloud.digitalocean.com/apps/b2c2085f-d938-428c-9299-1165af8dfc3c/settings
- **Runtime Logs**: https://cloud.digitalocean.com/apps/b2c2085f-d938-428c-9299-1165af8dfc3c/runtime_logs
- **Databases**: https://cloud.digitalocean.com/databases

## Still Having Issues?

1. **Check the specific error message** in logs
2. **Verify all environment variables** are set correctly
3. **Check database** is running and accessible
4. **Review build logs** for compilation errors
5. **Check runtime logs** for startup errors

---

**Last Updated**: December 9, 2024

