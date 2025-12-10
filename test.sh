#!/bin/bash

# Test script for Dev Agent
# This script runs the agent with a predefined feature request

echo "======================================================================"
echo "🤖 DEV AGENT - AUTOMATED TEST"
echo "======================================================================"
echo ""

cd /home/camden/projects/dev-agent

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ ERROR: .env file not found!"
    echo "Create it with: cp .env.example .env"
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check configuration
echo "✅ Configuration check:"
echo "   - LLM Provider: $(grep LLM_PROVIDER .env | cut -d= -f2)"
echo "   - GitHub Owner: $(grep GITHUB_OWNER .env | cut -d= -f2)"
echo "   - GitHub Repo: $(grep GITHUB_REPO .env | cut -d= -f2)"
echo "   - Repo Path: $(grep REPO_PATH .env | cut -d= -f2)"
echo ""

# Check if repo path exists
REPO_PATH=$(grep REPO_PATH .env | cut -d= -f2)
if [ ! -d "$REPO_PATH" ]; then
    echo "⚠️  WARNING: Repo path '$REPO_PATH' does not exist"
    echo "   The agent will fail when trying to apply changes"
    echo ""
fi

echo "======================================================================"
echo "Starting Dev Agent..."
echo "======================================================================"
echo ""

# Run agent with test input
# Pipe the inputs to the agent
(
  echo "Add a simple contact form component to the home page"
  sleep 1
  echo "Name, email, and message fields with validation"
  sleep 1
  echo "Store in database and send email notification"
  sleep 1
) | timeout 180 npm start 2>&1

EXIT_CODE=$?

echo ""
echo "======================================================================"
if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Test completed successfully!"
else
    echo "⚠️  Test ended with exit code: $EXIT_CODE"
fi
echo "======================================================================"
