# DigitalOcean Deployment Guide

## ✅ Code Pushed to GitHub
Repository: https://github.com/lacson1/clinicconnect-2.git
Branch: main
Latest commit: All seed/mock code removed, JWT fixes applied

## 🚀 Deployment Options

### Option 1: DigitalOcean App Platform (Recommended - Easiest)

#### Step 1: Generate Secure Secrets

```bash
# Generate JWT_SECRET
openssl rand -base64 64

# Generate SESSION_SECRET  
openssl rand -base64 64
```

Save these values - you'll need them for the deployment.

#### Step 2: Deploy via DigitalOcean Dashboard

1. **Go to DigitalOcean App Platform**
   - Visit: https://cloud.digitalocean.com/apps
   - Click **"Create App"**

2. **Connect GitHub Repository**
   - Select **GitHub**
   - Authorize DigitalOcean if needed
   - Choose repository: `lacson1/clinicconnect-2`
   - Select branch: `main`
   - Enable **"Autodeploy"** (deploys on every push)

3. **Configure App**
   - **Name**: `clinicconnect`
   - **Region**: Choose closest to your users (e.g., `nyc`, `sfo`, `lon`)
   - **Build Command**: (leave empty - using Dockerfile)
   - **Dockerfile Path**: `Dockerfile.optimized`
   - **HTTP Port**: `5001`

4. **Add Database**
   - Click **"Add Resource"** → **"Database"**
   - **Engine**: PostgreSQL 16
   - **Plan**: 
     - Dev Database (Free) for testing
     - Production Database ($15/mo) for production
   - **Name**: `clinicconnect-db`

5. **Set Environment Variables**
   
   **Required:**
   ```
   NODE_ENV=production
   PORT=5001
   DATABASE_URL=${db.DATABASE_URL}  # Auto-injected
   JWT_SECRET=<paste-generated-jwt-secret>
   SESSION_SECRET=<paste-generated-session-secret>
   ```
   
   **Optional (for AI features):**
   ```
   OPENAI_API_KEY=<your-key>
   ANTHROPIC_API_KEY=<your-key>
   SENDGRID_API_KEY=<your-key>
   ```

6. **Deploy**
   - Click **"Create Resources"**
   - Wait ~10-15 minutes for build and deployment
   - Monitor build logs for any issues

#### Step 3: Verify Deployment

After deployment completes:
- Check the app URL provided by DigitalOcean
- Test: `https://your-app.ondigitalocean.app/api/health`
- Verify no seed messages in logs

---

### Option 2: Deploy via doctl CLI

If you have `doctl` installed and authenticated:

```bash
# 1. Generate secrets (if not done already)
JWT_SECRET=$(openssl rand -base64 64)
SESSION_SECRET=$(openssl rand -base64 64)

# 2. Update app.yaml with your secrets
# Edit .do/app.yaml and replace the placeholder values

# 3. Create/update the app
doctl apps create --spec .do/app.yaml

# Or if app already exists, get the app ID and update:
doctl apps get <app-id>
doctl apps update <app-id> --spec .do/app.yaml
```

---

### Option 3: Manual Droplet Deployment

If you prefer a Droplet with Docker:

```bash
# 1. Create a Droplet (Ubuntu 22.04, 2GB RAM minimum)
# 2. SSH into the droplet
ssh root@your-droplet-ip

# 3. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 4. Clone repository
cd /opt
git clone https://github.com/lacson1/clinicconnect-2.git clinicconnect
cd clinicconnect

# 5. Create .env file
cat > .env << EOF
NODE_ENV=production
PORT=5001
DATABASE_URL=postgresql://user:pass@host:5432/clinicconnect
JWT_SECRET=<your-generated-secret>
SESSION_SECRET=<your-generated-secret>
EOF

# 6. Build and run
docker build -f Dockerfile.optimized -t clinicconnect .
docker run -d \
  --name clinicconnect-app \
  --restart unless-stopped \
  -p 5001:5001 \
  --env-file .env \
  clinicconnect
```

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] Generate strong `JWT_SECRET` (64+ characters)
- [ ] Generate strong `SESSION_SECRET` (64+ characters)
- [ ] Use managed PostgreSQL database (not dev database for production)
- [ ] Enable DigitalOcean Firewall
- [ ] Setup domain with SSL certificate
- [ ] Enable automatic backups
- [ ] Review and restrict CORS origins
- [ ] Setup monitoring and alerts

---

## 📊 Expected Costs

**App Platform:**
- Basic Plan: $5/month
- Dev Database: Free
- Production Database: $15/month
- **Total: $5-20/month**

**Droplet:**
- 2GB RAM Droplet: $12/month
- Managed Database: $15/month
- **Total: $27/month**

---

## 🐛 Troubleshooting

### Build Fails
- Check Dockerfile.optimized exists
- Verify all dependencies in package.json
- Check build logs in DigitalOcean dashboard

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check database firewall allows app connections
- Ensure SSL mode is set correctly

### App Won't Start
- Check environment variables are set
- Verify JWT_SECRET and SESSION_SECRET are set
- Check application logs in DigitalOcean dashboard

### Seed Code Still Running
- Verify latest code is deployed (check commit hash)
- Check that seed files are not in the Docker image
- Rebuild Docker image if needed

---

## ✅ Post-Deployment Verification

After deployment, verify:

1. **Health Check**
   ```bash
   curl https://your-app.ondigitalocean.app/api/health
   ```

2. **No Seed Messages**
   - Check logs for any "Seeding..." messages
   - Should see: "🚀 Server running on port 5001"
   - Should NOT see: "🌱 Seeding..." messages

3. **Authentication Works**
   - Test login endpoint
   - Verify JWT tokens are generated correctly

4. **Database Connected**
   - Check logs for database connection success
   - Test API endpoints that require database

---

## 🔄 Updating Deployment

After pushing new code to GitHub:

**App Platform (with autodeploy):**
- Automatically deploys on push to `main` branch
- Monitor deployment in DigitalOcean dashboard

**Manual Update:**
```bash
# Trigger new deployment
doctl apps create-deployment <app-id>
```

---

## 📝 Notes

- The app.yaml file in `.do/` directory is configured for App Platform
- `deploy_on_push: true` means it auto-deploys on every push to main
- Make sure to set JWT_SECRET and SESSION_SECRET as SECRET type in App Platform
- The Dockerfile.optimized includes database migrations on startup

