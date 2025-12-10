#!/bin/bash

# Script to run both dev-agent and starter-app side by side
# This creates two terminal sessions

echo "=================================="
echo "Starting Dev Agent + Starter App"
echo "=================================="

# Terminal 1: Start the starter-app development server
echo ""
echo "🚀 Terminal 1: Starting starter-app on http://localhost:3000"
echo "---"
cd /home/camden/projects/starter-app
npm run dev &
STARTER_PID=$!

sleep 3

# Terminal 2: Start the dev-agent
echo ""
echo "🤖 Terminal 2: Starting Dev Agent"
echo "---"
cd /home/camden/projects/dev-agent
npm start &
AGENT_PID=$!

echo ""
echo "=================================="
echo "✅ Both processes running!"
echo "=================================="
echo ""
echo "Terminal 1 (PID: $STARTER_PID): starter-app"
echo "  📱 Browser: http://localhost:3000"
echo "  📂 Location: /home/camden/projects/starter-app"
echo ""
echo "Terminal 2 (PID: $AGENT_PID): dev-agent"
echo "  🤖 Waiting for feature requests..."
echo "  📂 Location: /home/camden/projects/dev-agent"
echo ""
echo "To stop all processes, run:"
echo "  kill $STARTER_PID $AGENT_PID"
echo ""
echo "=================================="
echo ""

# Wait for both processes
wait $STARTER_PID $AGENT_PID
