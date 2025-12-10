#!/bin/bash

# DigitalOcean Deployment Verification Script
# This script helps verify if the app is deployed and working on DigitalOcean

echo "🔍 ClinicConnect DigitalOcean Deployment Verification"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# App ID from previous deployment attempts
APP_ID="b2c2085f-d938-428c-9299-1165af8dfc3c"

echo "📋 Step 1: Check if doctl is installed"
if command -v doctl &> /dev/null; then
    echo -e "${GREEN}✅ doctl is installed${NC}"
    echo ""
    
    echo "📋 Step 2: Check if authenticated with DigitalOcean"
    if doctl auth list &> /dev/null; then
        echo -e "${GREEN}✅ Authenticated with DigitalOcean${NC}"
        echo ""
        
        echo "📋 Step 3: Get App Information"
        echo "App ID: $APP_ID"
        echo ""
        
        # Get app details
        APP_INFO=$(doctl apps get $APP_ID --format ID,Spec.Name,ActiveDeployment.ID,ActiveDeployment.Phase 2>/dev/null)
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ App found in DigitalOcean${NC}"
            echo ""
            echo "App Details:"
            echo "$APP_INFO"
            echo ""
            
            # Get active deployment
            DEPLOYMENT_ID=$(doctl apps get $APP_ID --format ActiveDeployment.ID --no-header 2>/dev/null)
            if [ ! -z "$DEPLOYMENT_ID" ]; then
                echo "📋 Step 4: Check Deployment Status"
                DEPLOYMENT_STATUS=$(doctl apps get-deployment $APP_ID $DEPLOYMENT_ID --format Phase --no-header 2>/dev/null)
                echo "Deployment Status: $DEPLOYMENT_STATUS"
                echo ""
                
                if [ "$DEPLOYMENT_STATUS" == "ACTIVE" ]; then
                    echo -e "${GREEN}✅ Deployment is ACTIVE${NC}"
                elif [ "$DEPLOYMENT_STATUS" == "PENDING" ]; then
                    echo -e "${YELLOW}⚠️  Deployment is PENDING${NC}"
                elif [ "$DEPLOYMENT_STATUS" == "ERROR" ]; then
                    echo -e "${RED}❌ Deployment has ERRORS${NC}"
                fi
            fi
            
            # Get app URL
            echo ""
            echo "📋 Step 5: Get App URL"
            APP_URL=$(doctl apps get $APP_ID --format LiveURL --no-header 2>/dev/null)
            if [ ! -z "$APP_URL" ]; then
                echo -e "${GREEN}✅ App URL: $APP_URL${NC}"
                echo ""
                
                echo "📋 Step 6: Test Health Endpoint"
                HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/api/health" 2>/dev/null)
                
                if [ "$HEALTH_RESPONSE" == "200" ]; then
                    echo -e "${GREEN}✅ Health check passed (HTTP $HEALTH_RESPONSE)${NC}"
                    echo ""
                    echo "Full health check response:"
                    curl -s "$APP_URL/api/health" | jq . 2>/dev/null || curl -s "$APP_URL/api/health"
                else
                    echo -e "${RED}❌ Health check failed (HTTP $HEALTH_RESPONSE)${NC}"
                    echo "This could mean:"
                    echo "  - App is not running"
                    echo "  - App is still deploying"
                    echo "  - Environment variables are not set correctly"
                fi
            else
                echo -e "${YELLOW}⚠️  Could not retrieve app URL${NC}"
            fi
            
        else
            echo -e "${RED}❌ App not found or error accessing DigitalOcean${NC}"
            echo ""
            echo "This could mean:"
            echo "  1. App was never deployed"
            echo "  2. App ID is incorrect"
            echo "  3. Authentication issue"
        fi
        
    else
        echo -e "${RED}❌ Not authenticated with DigitalOcean${NC}"
        echo ""
        echo "To authenticate, run:"
        echo "  doctl auth init"
    fi
else
    echo -e "${YELLOW}⚠️  doctl is not installed${NC}"
    echo ""
    echo "To install doctl:"
    echo "  macOS: brew install doctl"
    echo "  Linux: See https://docs.digitalocean.com/reference/doctl/how-to/install/"
    echo ""
    echo "Or check manually at:"
    echo "  https://cloud.digitalocean.com/apps"
fi

echo ""
echo "=================================================="
echo "📝 Manual Verification Steps:"
echo ""
echo "1. Go to: https://cloud.digitalocean.com/apps"
echo "2. Look for app named 'clinicconnect'"
echo "3. Check deployment status"
echo "4. View runtime logs"
echo "5. Test the app URL if available"
echo ""
echo "If app exists, check:"
echo "  - Settings → Environment Variables (JWT_SECRET, SESSION_SECRET)"
echo "  - Resources tab (database exists)"
echo "  - Deployments tab (latest deployment status)"
echo ""

