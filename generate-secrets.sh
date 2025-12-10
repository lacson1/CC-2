#!/bin/bash

# Generate secure secrets for DigitalOcean deployment
# Usage: ./generate-secrets.sh

echo "🔐 Generating Secure Secrets for ClinicConnect Deployment"
echo "=========================================================="
echo ""

# Generate JWT_SECRET
JWT_SECRET=$(openssl rand -base64 64)
echo "JWT_SECRET:"
echo "$JWT_SECRET"
echo ""

# Generate SESSION_SECRET
SESSION_SECRET=$(openssl rand -base64 64)
echo "SESSION_SECRET:"
echo "$SESSION_SECRET"
echo ""

echo "=========================================================="
echo "✅ Secrets Generated Successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Copy the JWT_SECRET above"
echo "2. Copy the SESSION_SECRET above"
echo "3. Go to DigitalOcean App Platform dashboard"
echo "4. Navigate to: Settings → App-Level Environment Variables"
echo "5. Add/Update these variables:"
echo "   - JWT_SECRET (Type: SECRET, Value: [paste JWT_SECRET])"
echo "   - SESSION_SECRET (Type: SECRET, Value: [paste SESSION_SECRET])"
echo "6. Verify DATABASE_URL is set to: \${db.DATABASE_URL}"
echo "7. Redeploy your application"
echo ""
echo "⚠️  IMPORTANT: Keep these secrets secure! Never commit them to git."
echo ""

