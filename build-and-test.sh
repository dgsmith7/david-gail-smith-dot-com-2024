#!/bin/bash
# filepath: /Users/dgsmith7/Documents/Computation/Code repos/david-gail-smith-dot-com-2024/build-and-test.sh

echo "🔄 Building David Gail Smith Portfolio Website"
echo ""

# 1. Make script executable
if [[ ! -x "$0" ]]; then
  chmod +x "$0"
  echo "✅ Made script executable"
else
  echo "✅ Script already executable"
fi

# 2. Check if data directory exists
if [[ ! -d "data" ]]; then
  mkdir -p data
  echo "✅ Created data directory"
else
  echo "✅ Data directory exists"
fi

# 3. Check for required JSON files
if [[ ! -f "data/projects.json" || ! -f "data/categories.json" ]]; then
  echo "⚠️  Projects or categories JSON files not found"
  
  # Check if database credentials are available
  if [[ -f ".env" ]]; then
    echo "🔄 Exporting database to JSON..."
    npm run export-db
    
    if [[ $? -ne 0 ]]; then
      echo "❌ Database export failed. Please check your database connection."
      exit 1
    else
      echo "✅ Database exported successfully"
    fi
  else
    echo "❌ No .env file found and no JSON data. Cannot proceed."
    exit 1
  fi
else
  echo "✅ JSON data files found"
fi

# 4. Build the static site
echo ""
echo "🔄 Building static site..."
npm run build

if [[ $? -ne 0 ]]; then
  echo "❌ Build failed. Please check the errors above."
  exit 1
else
  echo "✅ Build successful"
fi

# 5. Check if we can serve the site
echo ""
echo "🔄 Starting local server to test the build..."
echo "ℹ️  Testing if the site is accessible locally..."

# Start server in background and capture output
npm run serve > /tmp/server_output.txt 2>&1 &
SERVER_PID=$!

# Give server time to start
sleep 3

# Find out which port the server is using by checking the logs
sleep 3
SERVER_PORT=$(grep -o "listening on port [0-9]*" /tmp/server_output.txt 2>/dev/null | tail -1 | awk '{print $4}')

# If we couldn't find the port in logs, default to 3000
if [ -z "$SERVER_PORT" ]; then
  SERVER_PORT=3000
fi

echo "ℹ️  Server detected on port: $SERVER_PORT"

# Test homepage access
echo "🔄 Testing homepage access..."
if curl -s -I http://localhost:$SERVER_PORT/ | grep -q "200 OK"; then
  echo "✅ Homepage accessible (HTTP 200)"
else
  echo "❌ Homepage not accessible"
  if ps -p $SERVER_PID > /dev/null 2>&1; then
    kill $SERVER_PID 2>/dev/null
  fi
  rm -f /tmp/server_output.txt 2>/dev/null
  exit 1
fi

# Test 404 error page
echo "🔄 Testing 404 error page..."
if curl -s -I http://localhost:$SERVER_PORT/nonexistent-page | grep -q "404 Not Found"; then
  echo "✅ Error page working correctly (HTTP 404)"
else
  echo "❌ Error page not working correctly"
  if ps -p $SERVER_PID > /dev/null 2>&1; then
    kill $SERVER_PID 2>/dev/null
  fi
  rm -f /tmp/server_output.txt 2>/dev/null
  exit 1
fi

# Kill server after tests - first try the PID
if ps -p $SERVER_PID > /dev/null 2>&1; then
  echo "🔄 Shutting down test server using PID ($SERVER_PID)..."
  kill $SERVER_PID 2>/dev/null
  sleep 1
fi

# Double check by port if the process is still running
if command -v lsof >/dev/null 2>&1; then
  PORT_PID=$(lsof -ti:$SERVER_PORT 2>/dev/null)
  if [ -n "$PORT_PID" ]; then
    echo "🔄 Forcefully shutting down any process on port $SERVER_PORT (PID: $PORT_PID)..."
    kill -9 $PORT_PID 2>/dev/null
  fi
fi

# Check one more time if the port is still in use
if command -v lsof >/dev/null 2>&1 && [ -n "$(lsof -ti:$SERVER_PORT 2>/dev/null)" ]; then
  echo "⚠️ Warning: Port $SERVER_PORT is still in use after cleanup attempts."
else
  echo "✅ Port $SERVER_PORT successfully freed"
fi

# Clean up temporary file
rm -f /tmp/server_output.txt 2>/dev/null

echo ""
echo "✅ All tests passed successfully"
echo "🚀 You can now deploy the site using the deployment instructions in the README.md"
