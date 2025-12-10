#!/bin/bash

# Demo of Dev Agent showing the 10-stage workflow
# This demo shows what the agent WOULD do with valid API keys

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                   🤖 DEV AGENT - WORKFLOW DEMO                      ║"
echo "║                                                                    ║"
echo "║  This demonstrates all 10 stages of the dev-agent workflow        ║"
echo "║  (without requiring valid API keys)                               ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

cat << 'DEMO'

USER INPUT:
───────────────────────────────────────────────────────────────────
"Add a dark mode toggle to the application. The toggle should be 
in the header and persist the user preference using localStorage."
───────────────────────────────────────────────────────────────────

STAGE 1: 🔍 Clarifying Requirements...
───────────────────────────────────────────────────────────────────
Agent asks: "Should dark mode apply to the entire app or just the header?"
User: "Apply to entire app"

Agent asks: "How should the user preference be stored?"
User: "Use localStorage"

Agent asks: "Should the preference persist across page refreshes?"
User: "Yes"

✓ Requirements are clear → PROCEED TO NEXT STAGE


STAGE 2: 📝 Generating Requirements Specification...
───────────────────────────────────────────────────────────────────
{
  "feature": "Dark mode toggle with localStorage persistence",
  "rationale": "Improves user experience by allowing theme customization",
  "acceptance_criteria": [
    "Toggle button appears in header",
    "Clicking toggles between light and dark themes",
    "User preference persists across page refreshes",
    "All pages respect the selected theme"
  ],
  "files_affected": [
    "components/Header.js",
    "lib/ThemeContext.js",
    "pages/_app.js",
    "styles/globals.css"
  ],
  "dependencies": []
}

✓ Specification generated → PROCEED TO NEXT STAGE


STAGE 3: 📋 Creating Implementation Plan...
───────────────────────────────────────────────────────────────────
Plan created: 4 tasks

Task 1: Create ThemeContext component (no dependencies)
Task 2: Modify Header to add toggle button (depends on Task 1)
Task 3: Update _app.js with theme provider (depends on Task 1)
Task 4: Add dark mode CSS classes (depends on Tasks 2, 3)

Execution order: 1 → [2, 3] → 4 (can run 2 & 3 in parallel!)

✓ Plan created → PROCEED TO NEXT STAGE


STAGE 4: ⚙️ Generating Changes (PARALLEL EXECUTION)...
───────────────────────────────────────────────────────────────────
🚀 Task 1: Creating lib/ThemeContext.js
   Generating code for React Context...
   ✓ Generated and validated (550 tokens)

🚀 Task 2 & 3: Running in parallel (independent tasks)
   Task 2: Modifying components/Header.js
   Task 3: Updating pages/_app.js
   Both generating simultaneously...
   ✓ Task 2 generated and validated (420 tokens)
   ✓ Task 3 generated and validated (380 tokens)

🚀 Task 4: Adding dark mode CSS
   Generating Tailwind CSS classes...
   ✓ Generated and validated (290 tokens)

⏱️  Total generation time: 2.3 seconds (40% faster than sequential!)

✓ Code generated → PROCEED TO NEXT STAGE


STAGE 5: 💾 Applying Changes...
───────────────────────────────────────────────────────────────────
Creating directories...
✓ lib/ exists

Writing files:
✓ lib/ThemeContext.js (550 bytes)
✓ components/Header.js (updated, 420 bytes added)
✓ pages/_app.js (updated, 380 bytes added)
✓ styles/globals.css (updated, 290 bytes added)

✓ 4 files modified → PROCEED TO NEXT STAGE


STAGE 6: 🧪 Test Verification...
───────────────────────────────────────────────────────────────────
Running tests...
$ npm test
PASS  __tests__/Header.test.js
  Dark mode toggle
    ✓ renders toggle button (45ms)
    ✓ toggles theme on click (32ms)
    ✓ persists preference (28ms)

PASS  __tests__/ThemeContext.test.js
  ThemeContext
    ✓ provides theme value (38ms)
    ✓ updates theme correctly (41ms)

Test Suites: 2 passed, 2 total
Tests: 5 passed, 5 total
Snapshots: 0 total
Time: 1.234 s

✓ All tests passed → PROCEED TO NEXT STAGE


STAGE 7: 🔍 Code Quality Check...
───────────────────────────────────────────────────────────────────
Running linter: eslint --ext .js,.jsx .

✓ No lint errors found
✓ Code style: Compliant with project standards

→ PROCEED TO NEXT STAGE


STAGE 8: 🌿 Git Operations...
───────────────────────────────────────────────────────────────────
Creating feature branch: feature/dark-mode-toggle
✓ Branch created and checked out

Staging changes:
✓ 4 files staged

Committing:
✓ Commit: "feat: add dark mode toggle with localStorage persistence"

Pushing to remote:
✓ Pushed to origin/feature/dark-mode-toggle

→ PROCEED TO NEXT STAGE


STAGE 9: 📤 Creating Pull Request...
───────────────────────────────────────────────────────────────────
{
  "title": "feat: Add dark mode toggle with localStorage persistence",
  "description": "## Overview\nAdds a dark mode toggle feature that allows \nusers to switch between light and dark themes...",
  "branch": "feature/dark-mode-toggle",
  "changes_summary": [
    "Add ThemeContext for global theme management",
    "Add toggle button to header component",
    "Wrap app with ThemeProvider",
    "Add dark mode CSS classes with Tailwind"
  ],
  "testing_notes": "All tests pass. Test dark mode by clicking the toggle in the header."
}

✓ PR created: https://github.com/ZaryabKhan222/spectrave-dashboard/pull/15
✓ PR Link: https://github.com/ZaryabKhan222/spectrave-dashboard/pull/15

→ PROCEED TO NEXT STAGE


STAGE 10: 🚀 Deployment...
───────────────────────────────────────────────────────────────────
Detecting deployment method...
✓ Found package.json with Next.js
✓ Deployment method: Vercel

Initiating deployment:
✓ Deployment ID: dpl_ABC123XYZ
✓ Build status: SUCCESS
✓ Live URL: https://spectrave-dashboard.vercel.app

───────────────────────────────────────────────────────────────────

═══════════════════════════════════════════════════════════════════

📊 WORKFLOW COMPLETE - SUMMARY
───────────────────────────────────────────────────────────────────

Feature:        Dark mode toggle with localStorage persistence
Files modified: 4 (lib/ThemeContext.js, Header.js, _app.js, globals.css)
Code generated: 1,640 tokens (2.3s with parallel execution)
Tests passed:   5 / 5 ✓
Lint errors:    0
PR URL:         https://github.com/ZaryabKhan222/spectrave-dashboard/pull/15
Live URL:       https://spectrave-dashboard.vercel.app

⏱️  Total time:  2 minutes 15 seconds (request → deployed)

═══════════════════════════════════════════════════════════════════

🎉 FEATURE SUCCESSFULLY IMPLEMENTED AND DEPLOYED!

═══════════════════════════════════════════════════════════════════

DEMO
echo ""
echo "To run this with your own feature request:"
echo "  1. Get valid OpenAI API key from https://platform.openai.com"
echo "  2. Update OPENAI_API_KEY in .env"
echo "  3. Run: npm start"
echo "  4. Enter your feature request when prompted"
echo ""
echo "The agent will then:"
echo "  • Ask clarifying questions"
echo "  • Generate code in parallel (40% faster!)"
echo "  • Run tests automatically"
echo "  • Create PR on GitHub"
echo "  • Deploy to Vercel (if enabled)"
echo ""
