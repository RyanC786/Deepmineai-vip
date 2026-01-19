#!/bin/bash

# Test Resend API Key
# This script tests if the Resend API key is valid

echo "🧪 Testing Resend API Key..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

API_KEY="re_JE9L6QBy_8bPUjA8rkDLb6QkABTQb4sC7"

echo "📧 Sending test email via Resend API..."
echo ""

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "DeepMine AI <noreply@deepmineai.vip>",
    "to": ["test@resend.dev"],
    "subject": "Test Email - DeepMine AI",
    "html": "<p>This is a test email to verify the Resend API key is working.</p>"
  }')

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo "Response:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ SUCCESS! Resend API key is valid and working!"
  echo ""
  echo "Email sent successfully to: test@resend.dev"
  echo "Check the email ID in the response above."
else
  echo "❌ FAILED! HTTP Status: $HTTP_STATUS"
  echo ""
  echo "Possible issues:"
  echo "  • API key is invalid or expired"
  echo "  • Domain (deepmineai.vip) not verified in Resend"
  echo "  • API rate limit exceeded"
  echo ""
  echo "Please check:"
  echo "  1. https://resend.com/api-keys (verify API key)"
  echo "  2. https://resend.com/domains (verify domain)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
