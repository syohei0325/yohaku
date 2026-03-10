#!/bin/bash

# Context Receipt のテストスクリプト

echo "=== Context Receipt Test ==="
echo ""

# 1. Plan作成
echo "1. Creating Plan..."
PLAN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/plan \
  -H "Content-Type: application/json" \
  -d '{
    "tenant_id": "tenant_demo_001",
    "user_id": "user_demo_001",
    "actions": [
      {
        "action": "webhook.dispatch",
        "url": "http://localhost:4000/webhook",
        "method": "POST",
        "payload": {"message": "Test with Context Receipt"}
      }
    ]
  }')

PLAN_ID=$(echo $PLAN_RESPONSE | grep -o '"plan_id":"[^"]*"' | cut -d'"' -f4)
echo "✓ Plan ID: $PLAN_ID"
echo ""

# 2. Approve作成
echo "2. Creating Approval..."
APPROVE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/approve \
  -H "Content-Type: application/json" \
  -d "{
    \"plan_id\": \"$PLAN_ID\",
    \"tenant_id\": \"tenant_demo_001\",
    \"user_id\": \"user_demo_001\",
    \"approval\": {
      \"lane\": \"review\",
      \"principal\": {
        \"type\": \"human\",
        \"user_id\": \"user_demo_001\"
      }
    }
  }")

APPROVE_ID=$(echo $APPROVE_RESPONSE | grep -o '"approve_id":"[^"]*"' | cut -d'"' -f4)
echo "✓ Approve ID: $APPROVE_ID"
echo ""

# 3. Approve確定
echo "3. Confirming Approval..."
curl -s -X POST "http://localhost:3000/api/v1/approve/$APPROVE_ID/confirm" \
  -H "Content-Type: application/json" \
  -d '{
    "tenant_id": "tenant_demo_001",
    "user_id": "user_demo_001",
    "decision": "approve"
  }' > /dev/null
echo "✓ Approval confirmed"
echo ""

# 4. Confirm実行（Context Receipt付き）
echo "4. Executing Confirm with Context Receipt..."
IDEMPOTENCY_KEY="test_context_receipt_$(date +%s)"

CONFIRM_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/confirm \
  -H "Content-Type: application/json" \
  -H "x-yohaku-api-key-id: key_demo_001" \
  -H "x-yohaku-agent-label: test-agent" \
  -H "x-idempotency-key: $IDEMPOTENCY_KEY" \
  -d "{
    \"plan_id\": \"$PLAN_ID\",
    \"approve_id\": \"$APPROVE_ID\",
    \"idempotency_key\": \"$IDEMPOTENCY_KEY\",
    \"context_receipts\": [
      {
        \"type\": \"mcp_resource\",
        \"ref\": \"slack://channel/C123456/messages\",
        \"hash\": \"abc123def456\",
        \"sig\": \"HMAC-SHA256-signature-here\",
        \"issuer\": \"mcp-server-slack\",
        \"accessed_at\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
        \"scope\": \"read:messages\"
      },
      {
        \"type\": \"external_api\",
        \"ref\": \"https://api.example.com/users/123\",
        \"hash\": \"xyz789abc012\",
        \"sig\": \"HMAC-SHA256-signature-2\",
        \"issuer\": \"external-api-server\",
        \"accessed_at\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
        \"scope\": \"read:user\"
      }
    ]
  }")

echo "$CONFIRM_RESPONSE" | jq '.'
echo ""

RECEIPT_ID=$(echo $CONFIRM_RESPONSE | grep -o '"receipt_id":"[^"]*"' | cut -d'"' -f4)
echo "✓ Receipt ID: $RECEIPT_ID"
echo ""

# 5. Receipt取得（Context Receipt確認）
echo "5. Fetching Receipt to verify Context Receipt..."
sleep 1
RECEIPT_RESPONSE=$(curl -s "http://localhost:3000/api/v1/receipt/$RECEIPT_ID")
echo "$RECEIPT_RESPONSE" | jq '.context_receipts'
echo ""

echo "=== Test Complete ==="
echo "Receipt URL: http://localhost:3000/receipt/$RECEIPT_ID"
