#!/bin/bash

# Verify and Fix DigitalOcean Environment Variables
# This script helps ensure SESSION_SECRET and JWT_SECRET are properly set

APP_ID="b2c2085f-d938-428c-9299-1165af8dfc3c"

echo "🔐 Verifying DigitalOcean Environment Variables"
echo "================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Secrets from DEPLOYMENT_ERRORS_FIXED.md
JWT_SECRET="8SWu/K+ecGbdMWk+OtQZcQjWeUoScBOzIb41uMdT6xlyUGnDsbxNj59r8VCeGgPb jCinRjiwBj3wOqoVYVKBnA=="
SESSION_SECRET="ENvFYgDF2ObFj8DAvIcC2IOBGIgJ4Td77m46aV4LSZ4Ew7+Ze9AaYLZ+7K7+kWAF+d1G9aRvaRKVxtEx+W/RYw=="

echo "⚠️  IMPORTANT: App-level environment variables cannot be checked via CLI"
echo "   They must be set in the DigitalOcean dashboard."
echo ""
echo "📋 Required Environment Variables:"
echo ""
echo "1. JWT_SECRET"
echo "   Value: $JWT_SECRET"
echo "   Type: SECRET (🔒)"
echo "   Scope: RUN_TIME"
echo "   Min Length: 32 characters"
echo ""
echo "2. SESSION_SECRET (REQUIRED for production)"
echo "   Value: $SESSION_SECRET"
echo "   Type: SECRET (🔒)"
echo "   Scope: RUN_TIME"
echo "   Min Length: 32 characters"
echo ""

# Check if doctl is available
if ! command -v doctl &> /dev/null; then
    echo -e "${RED}❌ doctl not found${NC}"
    echo "Install with: brew install doctl"
    exit 1
fi

echo "📝 Steps to Fix:"
echo ""
echo "1. Go to DigitalOcean Dashboard:"
echo "   https://cloud.digitalocean.com/apps/$APP_ID/settings"
echo ""
echo "2. Scroll to 'App-Level Environment Variables'"
echo ""
echo "3. For each variable (JWT_SECRET and SESSION_SECRET):"
echo "   - If it exists: Click Edit → Verify Type is 'SECRET' (🔒)"
echo "   - If missing: Click 'Add Variable'"
echo "   - Key: JWT_SECRET or SESSION_SECRET"
echo "   - Value: Copy the value from above"
echo "   - Type: Select 'SECRET' (click 🔒 icon)"
echo "   - Scope: RUN_TIME"
echo "   - Click Save"
echo ""
echo "4. After setting variables, trigger a new deployment:"
echo "   - Go to: https://cloud.digitalocean.com/apps/$APP_ID/deployments"
echo "   - Click 'Create Deployment'"
echo ""

echo "🔍 Verification:"
echo ""
echo "After deployment, check runtime logs for:"
echo "  ✅ 'Using PostgreSQL session store with SSL'"
echo "  ✅ 'Server running on port 5001'"
echo "  ❌ Should NOT see: 'SESSION_SECRET environment variable is required'"
echo "  ❌ Should NOT see: 'Falling back to MemoryStore'"
echo ""

echo "📄 Full instructions: See FIX_SESSION_ISSUES.md"
echo ""

