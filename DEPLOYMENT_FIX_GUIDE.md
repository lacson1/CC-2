# 🚨 DigitalOcean Deployment Fix Guide

## Current Issues

1. ❌ `DATABASE_URL` not set - Database connection string not resolving
2. ❌ `JWT_SECRET` placeholder - Needs actual secret value
3. ❌ `SESSION_SECRET` placeholder - Needs actual secret value
4. ⚠️ Health check timing - May need adjustment

## Quick Fix Steps

### Step 1: Generate Secrets

Run these commands locally to generate secure secrets:

```bash
# Generate JWT_SECRET
openssl rand -base64 64

# Generate SESSION_SECRET  
openssl rand -base64 64
```

**Save both secrets** - you'll need them in Step 3.

### Step 2: Fix Database Reference in DigitalOcean Dashboard

The `app.yaml` uses `${clinicconnect-db.DATABASE_URL}` but DigitalOcean may need the database resource name to match exactly.

**Option A: Update in DigitalOcean Dashboard (Recommended)**
1. Go to your App in DigitalOcean: https://cloud.digitalocean.com/apps
2. Click on your app → **Settings** → **App-Level Environment Variables**
3. Find `DATABASE_URL` and verify it shows: `${db.DATABASE_URL}`
4. If the database resource name is different (e.g., `clinicconnect-db`), use: `${clinicconnect-db.DATABASE_URL}`

**Option B: Check Database Resource Name**
1. In DigitalOcean dashboard, go to your App → **Resources** tab
2. Note the exact name of your database resource
3. Use that name in the format: `${your-db-name.DATABASE_URL}`
4. Update the environment variable in the dashboard

### Step 3: Set Secrets in DigitalOcean Dashboard

**IMPORTANT**: You cannot set secrets in `app.yaml` - they must be set in the DigitalOcean dashboard.

1. Go to your App in DigitalOcean: https://cloud.digitalocean.com/apps
2. Click on your app → **Settings** → **App-Level Environment Variables**
3. Click **"Edit"** or **"Add Variable"**

#### Add/Update These Variables:

1. **JWT_SECRET**
   - Key: `JWT_SECRET`
   - Value: [Paste the JWT_SECRET you generated in Step 1]
   - Type: **SECRET** (not plain text!)
   - Scope: **RUN_TIME**

2. **SESSION_SECRET**
   - Key: `SESSION_SECRET`
   - Value: [Paste the SESSION_SECRET you generated in Step 1]
   - Type: **SECRET** (not plain text!)
   - Scope: **RUN_TIME**

3. **DATABASE_URL** (if not auto-set)
   - Key: `DATABASE_URL`
   - Value: `${clinicconnect-db.DATABASE_URL}` (or `${db.DATABASE_URL}`)
   - Type: **SECRET**
   - Scope: **RUN_TIME**

### Step 4: Verify Database Resource

1. In DigitalOcean dashboard, go to your App
2. Click **"Resources"** tab
3. Verify you have a database resource named `clinicconnect-db`
4. If missing, add it:
   - Click **"Add Resource"** → **"Database"**
   - Name: `clinicconnect-db`
   - Engine: PostgreSQL 16
   - Plan: Dev Database (Free) or Production ($15/mo)

### Step 5: Redeploy

After setting the environment variables:

1. Go to **"Deployments"** tab
2. Click **"Create Deployment"** or **"Redeploy"**
3. Wait for build to complete (~10-15 minutes)
4. Check logs for errors

## Verification

After deployment, check:

1. **Runtime Logs** should show:
   ```
   ✅ Starting ClinicConnect Healthcare Platform...
   ✅ Database connection successful
   ✅ Server running on port 5001
   ```

2. **Health Check**:
   ```bash
   curl https://your-app-name.ondigitalocean.app/api/health
   ```
   Should return: `{"status":"ok"}`

3. **No Errors**:
   - ❌ Should NOT see: "DATABASE_URL must be set"
   - ❌ Should NOT see: "JWT_SECRET not set"
   - ❌ Should NOT see: "SESSION_SECRET not set"

## Common Issues

### Issue: "DATABASE_URL must be set"

**Cause**: Database resource not linked or name mismatch

**Fix**:
1. Verify database resource exists in App Platform
2. Check environment variable shows `${clinicconnect-db.DATABASE_URL}` or `${db.DATABASE_URL}`
3. Ensure database is in the same app (not separate)

### Issue: "JWT_SECRET not set" or "SESSION_SECRET not set"

**Cause**: Secrets not set in dashboard or set as plain text instead of SECRET type

**Fix**:
1. Go to Settings → Environment Variables
2. Find `JWT_SECRET` and `SESSION_SECRET`
3. Ensure Type is set to **SECRET** (not plain text)
4. Ensure values are set (not empty)

### Issue: Health Check Fails

**Cause**: App not starting or wrong port

**Fix**:
1. Check runtime logs for startup errors
2. Verify `PORT=5001` is set
3. Verify health check path is `/api/health`
4. Increase `initial_delay_seconds` if app takes longer to start

## Updated app.yaml Reference

The `app.yaml` file has been updated with:
- Better database reference: `${clinicconnect-db.DATABASE_URL}`
- Placeholder secrets: `${JWT_SECRET}` and `${SESSION_SECRET}` (must be set in dashboard)
- Increased health check delay: `initial_delay_seconds: 60`

**Remember**: Secrets in `app.yaml` are placeholders. You MUST set actual values in the DigitalOcean dashboard.

## Next Steps After Fix

1. ✅ Set secrets in DigitalOcean dashboard
2. ✅ Verify database resource exists
3. ✅ Redeploy the application
4. ✅ Test health endpoint
5. ✅ Test login functionality

---

**Last Updated**: December 9, 2024  
**Status**: Ready for deployment after secrets are set

