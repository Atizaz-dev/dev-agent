#!/bin/bash

# Interactive test script for dev-agent
# Simulates adding a feature in real-time

echo ""
echo "========================================"
echo "🤖 DEV AGENT - REAL-TIME TEST"
echo "========================================"
echo ""
echo "This script will:"
echo "1. Run the dev-agent"
echo "2. Simulate adding a new feature"
echo "3. Generate code in real-time"
echo "4. Apply changes to starter-app"
echo "5. You can see the changes live at http://localhost:3000"
echo ""
echo "========================================"
echo ""

# Feature request to test
FEATURE_REQUEST="Add a Hello World component to the home page that displays 'Welcome to Dev Agent' with a nice card design using Tailwind CSS"

echo "📋 Feature Request:"
echo "  \"$FEATURE_REQUEST\""
echo ""
echo "Starting agent in 3 seconds..."
sleep 3

# Run the agent with the feature request piped as input
cd /home/camden/projects/dev-agent

# Create a test input file with the feature request and auto-answers
cat > /tmp/agent_input.txt << 'EOF'
Add a Hello World component to the home page that displays "Welcome to Dev Agent" with a nice card design using Tailwind CSS. Make it stand out with a gradient background.
No questions, implement it as you see fit.
EOF

echo ""
echo "🚀 Running Dev Agent..."
echo "========================================"
echo ""

npm start < /tmp/agent_input.txt
