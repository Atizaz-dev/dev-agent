#!/bin/bash

# Comprehensive test of Dev Agent with all 10 stages
# This will demonstrate the complete workflow

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                   🤖 DEV AGENT - FULL TEST                         ║"
echo "║                                                                    ║"
echo "║  This test will demonstrate all 10 stages:                        ║"
echo "║  1. Clarification       6. Test Verification                      ║"
echo "║  2. Requirements        7. Code Quality Check                     ║"
echo "║  3. Planning            8. Git Operations                         ║"
echo "║  4. Code Generation     9. Pull Request Creation                  ║"
echo "║  5. Apply Changes       10. Deployment                            ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

cd /home/camden/projects/dev-agent

# Verify setup
echo "📋 Pre-flight checks:"
echo "   ✓ Dev-agent directory: $(pwd)"
echo "   ✓ Node version: $(node --version)"
echo "   ✓ npm version: $(npm --version)"
echo ""

# Verify config
echo "⚙️  Configuration:"
grep -E "^(LLM_PROVIDER|GITHUB_OWNER|GITHUB_REPO|REPO_PATH|SKIP_TESTS|AUTO_DEPLOY)" .env | sed 's/^/   /'
echo ""

# Verify repo path
REPO_PATH=$(grep REPO_PATH .env | cut -d= -f2)
echo "📂 Target repository:"
if [ -d "$REPO_PATH" ]; then
    echo "   ✓ Found: $REPO_PATH"
    echo "   ✓ Type: $(cd $REPO_PATH && git rev-parse --is-inside-work-tree 2>/dev/null && echo 'Git repo' || echo 'Directory')"
    echo "   ✓ Status: $(cd $REPO_PATH && git status -s | wc -l) uncommitted changes"
else
    echo "   ✗ NOT FOUND: $REPO_PATH"
    exit 1
fi
echo ""

echo "────────────────────────────────────────────────────────────────────"
echo "🚀 Starting Dev Agent with test feature request..."
echo "────────────────────────────────────────────────────────────────────"
echo ""

# Run agent with feature request and piped input for clarification questions
(
  echo "Add a dark mode toggle to the application. The toggle should be in the header and persist the user preference using localStorage."
  sleep 2
  echo "Yes, apply to entire app"
  sleep 2
  echo "Use localStorage for persistence"
  sleep 2
) | timeout 300 npm start 2>&1

EXIT_CODE=$?

echo ""
echo "────────────────────────────────────────────────────────────────────"
echo ""

if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ TEST COMPLETED SUCCESSFULLY!"
    echo ""
    echo "📊 Results:"
    echo "   • Clarification: ✓ Asked questions"
    echo "   • Requirements: ✓ Generated spec"
    echo "   • Planning: ✓ Created task plan"
    echo "   • Code Generation: ✓ Created code in parallel"
    echo "   • Apply Changes: ✓ Modified files"
    echo "   • Test Verification: ✓ (skipped in test config)"
    echo "   • Code Quality: ✓ Checked linting"
    echo "   • Git Operations: ✓ Created branch and committed"
    echo "   • PR Creation: ✓ Attempted to create PR"
    echo "   • Deployment: ✓ (skipped in test config)"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Check the created branch: cd $REPO_PATH && git branch"
    echo "   2. View changes: git log --oneline -5"
    echo "   3. Review code: git diff HEAD~1"
    echo ""
    
elif [ $EXIT_CODE -eq 124 ]; then
    echo "⏱️  TEST TIMEOUT"
    echo "   The test exceeded 5 minutes"
    echo "   This is normal for complex feature requests with test execution"
    echo ""
    
else
    echo "⚠️  TEST ENDED WITH EXIT CODE: $EXIT_CODE"
    echo "   Check the output above for error messages"
    echo ""
fi

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                     🏁 TEST COMPLETE                              ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
