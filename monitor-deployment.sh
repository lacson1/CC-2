#!/bin/bash

# Monitor DigitalOcean Deployment Status
# Usage: ./monitor-deployment.sh

APP_ID="b2c2085f-d938-428c-9299-1165af8dfc3c"

echo "🔍 Monitoring ClinicConnect Deployment"
echo "========================================"
echo ""

# Get latest deployment
LATEST_DEPLOYMENT=$(doctl apps list-deployments $APP_ID --format ID,Phase --no-header 2>/dev/null | head -1 | awk '{print $1}')
LATEST_PHASE=$(doctl apps list-deployments $APP_ID --format ID,Phase --no-header 2>/dev/null | head -1 | awk '{print $2}')

if [ -z "$LATEST_DEPLOYMENT" ]; then
    echo "❌ Could not get deployment status"
    exit 1
fi

echo "Deployment ID: $LATEST_DEPLOYMENT"
echo "Status: $LATEST_PHASE"
echo ""

# Get detailed deployment info
DEPLOYMENT_INFO=$(doctl apps get-deployment $APP_ID $LATEST_DEPLOYMENT 2>/dev/null)

if echo "$DEPLOYMENT_INFO" | grep -q "Progress"; then
    PROGRESS=$(echo "$DEPLOYMENT_INFO" | grep "Progress" | awk '{print $2}')
    echo "Progress: $PROGRESS"
    echo ""
fi

# Check phase and provide status
case "$LATEST_PHASE" in
    "BUILDING")
        echo "⏳ Building Docker image..."
        echo "   This typically takes 5-10 minutes"
        ;;
    "DEPLOYING")
        echo "🚀 Deploying application..."
        echo "   Starting containers and running health checks"
        ;;
    "ACTIVE")
        echo "✅ Deployment is ACTIVE!"
        echo ""
        
        # Try to get app URL
        APP_URL=$(doctl apps get $APP_ID --format LiveURL --no-header 2>/dev/null)
        if [ ! -z "$APP_URL" ] && [ "$APP_URL" != "<nil>" ]; then
            echo "🌐 App URL: $APP_URL"
            echo ""
            echo "Testing health endpoint..."
            HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/api/health" 2>/dev/null)
            if [ "$HEALTH_RESPONSE" == "200" ]; then
                echo "✅ Health check passed!"
                echo ""
                echo "Full response:"
                curl -s "$APP_URL/api/health" | python3 -m json.tool 2>/dev/null || curl -s "$APP_URL/api/health"
            else
                echo "⚠️  Health check returned HTTP $HEALTH_RESPONSE"
                echo "   App may still be starting up..."
            fi
        else
            echo "⚠️  App URL not yet available"
            echo "   Check dashboard: https://cloud.digitalocean.com/apps/$APP_ID"
        fi
        ;;
    "ERROR")
        echo "❌ Deployment failed!"
        echo ""
        echo "Check logs:"
        echo "  doctl apps get-deployment $APP_ID $LATEST_DEPLOYMENT"
        echo ""
        echo "Or in dashboard:"
        echo "  https://cloud.digitalocean.com/apps/$APP_ID/deployments"
        ;;
    "SUPERSEDED")
        echo "ℹ️  This deployment was superseded by a newer one"
        echo "   Check the latest deployment above"
        ;;
    *)
        echo "Status: $LATEST_PHASE"
        ;;
esac

echo ""
echo "========================================"
echo "📊 View in Dashboard:"
echo "https://cloud.digitalocean.com/apps/$APP_ID"
echo ""
echo "🔄 Run again to check status:"
echo "./monitor-deployment.sh"

