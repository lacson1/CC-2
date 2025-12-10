# 🔧 Fix Session Store and Environment Variable Issues

## Issues Identified

1. **SESSION_SECRET Invalid/Missing**: The deployment failed because SESSION_SECRET is required in production but was either missing or invalid.

2. **Session Store Fallback**: The app fell back to MemoryStore because it couldn't initialize the PostgreSQL session store.

## Root Causes

### Issue 1: SESSION_SECRET
- The app spec references `${SESSION_SECRET}` which must be set as an **app-level environment variable** in DigitalOcean
- The value must be at least 32 characters long (validation requirement)
- It must be set as **SECRET type** (not plain text)

### Issue 2: Session Store
- The PostgreSQL session store initialization might fail if:
  - Database connection fails
  - Sessions table doesn't exist (though `createTableIfMissing: true` should handle this)
  - SSL connection issues
  - Permissions issues

## Solution Steps

### Step 1: Verify/Set SESSION_SECRET in DigitalOcean Dashboard

1. **Go to App Settings**:
   - Visit: https://cloud.digitalocean.com/apps/b2c2085f-d938-428c-9299-1165af8dfc3c/settings
   - Scroll to **"App-Level Environment Variables"**

2. **Check if SESSION_SECRET exists**:
   - Look for `SESSION_SECRET` in the list
   - If it exists, verify:
     - Type is **SECRET** (🔒 icon)
     - Value is at least 32 characters
     - Value matches one of the generated secrets below

3. **Set/Update SESSION_SECRET**:
   - If missing or invalid, add/update it:
     - **Key**: `SESSION_SECRET`
     - **Value**: Use one of these (from DEPLOYMENT_ERRORS_FIXED.md):
       ```
       ENvFYgDF2ObFj8DAvIcC2IOBGIgJ4Td77m46aV4LSZ4Ew7+Ze9AaYLZ+7K7+kWAF+d1G9aRvaRKVxtEx+W/RYw==
       ```
     - **Type**: **SECRET** (click the 🔒 lock icon)
     - **Scope**: **RUN_TIME**

4. **Verify JWT_SECRET**:
   - Also check `JWT_SECRET` is set:
     - **Key**: `JWT_SECRET`
     - **Value**: 
       ```
       8SWu/K+ecGbdMWk+OtQZcQjWeUoScBOzIb41uMdT6xlyUGnDsbxNj59r8VCeGgPb jCinRjiwBj3wOqoVYVKBnA==
       ```
     - **Type**: **SECRET** (🔒)
     - **Scope**: **RUN_TIME**

### Step 2: Ensure Sessions Table Exists

The sessions table should be created automatically by `connect-pg-simple` with `createTableIfMissing: true`, but we can verify:

**Option A: Let the app create it (Recommended)**
- The app will automatically create the table on first run
- No action needed

**Option B: Create manually (if needed)**
- Connect to your database
- Run the migration: `server/migrations/011_create_sessions_table.sql`

### Step 3: Update App Spec

The updated app spec (`.do/app-fixed.yaml`) includes:
- Increased health check delay (90 seconds) to allow for migrations
- Proper environment variable references
- ALLOWED_ORIGINS placeholder (will be updated after deployment)

### Step 4: Redeploy

After setting the environment variables:

1. **Update the app spec** (if needed):
   ```bash
   doctl apps update b2c2085f-d938-428c-9299-1165af8dfc3c --spec .do/app-fixed.yaml
   ```

2. **Or trigger a new deployment**:
   - In dashboard: Deployments → Create Deployment
   - Or push a new commit to trigger auto-deploy

## Verification

After redeployment, check the logs for:

### ✅ Success Indicators:
- `✅ Using PostgreSQL session store with SSL`
- `✅ Server running on port 5001`
- `✅ Database connection successful`
- No errors about SESSION_SECRET

### ❌ Failure Indicators:
- `SESSION_SECRET environment variable is required in production`
- `Failed to initialize PostgreSQL session store`
- `Falling back to MemoryStore`

## Generated Secrets (Save These!)

From `DEPLOYMENT_ERRORS_FIXED.md`:

**JWT_SECRET:**
```
8SWu/K+ecGbdMWk+OtQZcQjWeUoScBOzIb41uMdT6xlyUGnDsbxNj59r8VCeGgPb jCinRjiwBj3wOqoVYVKBnA==
```

**SESSION_SECRET:**
```
ENvFYgDF2ObFj8DAvIcC2IOBGIgJ4Td77m46aV4LSZ4Ew7+Ze9AaYLZ+7K7+kWAF+d1G9aRvaRKVxtEx+W/RYw==
```

⚠️ **IMPORTANT**: 
- These must be set in DigitalOcean dashboard as **SECRET** type
- Do NOT commit these to git
- Copy them exactly (including any spaces/newlines)

## Quick Fix Checklist

- [ ] Go to DigitalOcean dashboard → App Settings → Environment Variables
- [ ] Verify `SESSION_SECRET` exists and is set as SECRET type
- [ ] Verify `JWT_SECRET` exists and is set as SECRET type
- [ ] Check values are at least 32 characters
- [ ] Update app spec if needed: `doctl apps update b2c2085f-d938-428c-9299-1165af8dfc3c --spec .do/app-fixed.yaml`
- [ ] Trigger new deployment
- [ ] Check runtime logs for session store initialization
- [ ] Verify health endpoint works

## Troubleshooting

### If SESSION_SECRET still fails:

1. **Check the value**:
   - Must be at least 32 characters
   - Should be base64 encoded (64+ characters recommended)
   - No special characters that might break parsing

2. **Regenerate if needed**:
   ```bash
   openssl rand -base64 64
   ```

3. **Set in dashboard**:
   - Make sure it's set as **SECRET** type (not plain text)
   - Scope should be **RUN_TIME**

### If Session Store still fails:

1. **Check database connection**:
   - Verify `DATABASE_URL` is correctly set
   - Check database is running
   - Verify SSL connection works

2. **Check logs**:
   - Look for specific error messages
   - Check if `connect-pg-simple` package is installed (should be in package.json)

3. **Verify sessions table**:
   - Connect to database
   - Check if `sessions` table exists
   - If not, it should be created automatically

## Next Steps

After fixing:
1. ✅ Monitor deployment progress
2. ✅ Check runtime logs
3. ✅ Verify health endpoint
4. ✅ Test login functionality
5. ✅ Confirm sessions persist (not using MemoryStore)

---

**Status**: Ready to fix - Follow steps above  
**Last Updated**: December 9, 2024

