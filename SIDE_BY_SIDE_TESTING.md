# Running Dev Agent + Starter App Side-by-Side

## 📋 Overview

This document explains how to run both the **dev-agent** and **starter-app** simultaneously and test adding features in real-time.

---

## 🚀 Quick Start (2 Terminal Windows)

### **Terminal 1: Start the Starter App (Development Server)**

```bash
cd /home/camden/projects/starter-app
npm run dev
```

**Expected output:**
```
✓ Ready in 1234ms
  - Local:         http://localhost:3000
  - Network:       http://192.168.1.6:3000
```

Then **open your browser to http://localhost:3000** to see the live app.

---

### **Terminal 2: Start the Dev Agent**

```bash
cd /home/camden/projects/dev-agent
npm start
```

**Expected output:**
```
🤖 Dev Agent Starting...

Enter feature request: 
```

Then **enter a feature request** like:
```
Add a Hello World component to the home page that displays "Welcome" with Tailwind CSS styling
```

---

## 📊 Real-Time Workflow

When you run the agent:

1. **Agent generates code** (Terminal 2)
   - Creates/modifies files in `starter-app`
   
2. **Starter app auto-reloads** (Terminal 1)
   - Next.js detects file changes
   - Automatically compiles
   - Browser refreshes (with Fast Refresh)
   
3. **You see changes live** (Browser at localhost:3000)
   - New component appears
   - Styling is applied
   - Functionality works

---

## 🎯 Example: Add a Feature in Real-Time

### **Step 1: Terminal 1 - Start Starter App**
```bash
cd /home/camden/projects/starter-app
npm run dev
```

Wait for:
```
✓ Ready in 1234ms
```

### **Step 2: Browser - Open App**
```
http://localhost:3000
```

You should see the default Next.js starter page.

### **Step 3: Terminal 2 - Run Dev Agent**
```bash
cd /home/camden/projects/dev-agent
npm start
```

### **Step 4: Enter Feature Request**
```
Add a card component that displays stats (Views, Users, Revenue) with nice Tailwind CSS styling and icons. Add it to the home page below the header.
```

### **Step 5: Watch Magic Happen** ✨

The agent will:
1. Ask clarifying questions (answer them in Terminal 2)
2. Generate requirements
3. Plan the implementation
4. **Generate code** → Files are written to `starter-app/`
5. **Starter app detects changes** → Recompiles automatically
6. **Browser auto-refreshes** → You see new component live!
7. Create a Git commit
8. Create a GitHub PR

---

## 🔄 Multi-Feature Test

You can add multiple features in sequence:

### **Feature 1:**
```
Add a dark mode toggle to the navbar
```

### **Watch it appear** → Button in navbar

### **Feature 2:**
```
Add a footer with social media links
```

### **Watch it appear** → Footer at bottom of page

### **Feature 3:**
```
Create a contact form page at /contact with email and message fields
```

### **Watch it appear** → New page with form

---

## 📁 File Structure During Testing

```
starter-app/
├── pages/
│   ├── index.js           ← Agent modifies this
│   ├── contact.js         ← Agent creates new pages
│   └── api/
├── components/
│   ├── Header.js
│   ├── Footer.js          ← Agent creates new components
│   ├── StatsCard.js       ← Agent creates new components
│   └── ...
├── styles/
│   └── globals.css        ← Agent modifies styles
└── public/
```

Each time the agent modifies files, Next.js automatically:
- Detects changes
- Recompiles
- Hot-reloads in browser (Fast Refresh)

---

## 🎮 Interactive Testing Modes

### **Mode 1: Manual Input (Recommended)**

```bash
# Terminal 1
cd /home/camden/projects/starter-app
npm run dev

# Terminal 2
cd /home/camden/projects/dev-agent
npm start
# Type feature requests manually
```

**Pros:** See agent think and ask questions  
**Cons:** Need to answer interactive prompts

---

### **Mode 2: Automated Script**

```bash
# Terminal 1
cd /home/camden/projects/starter-app
npm run dev

# Terminal 2
/home/camden/projects/test-agent.sh
```

This script automatically provides feature requests and answers.

---

### **Mode 3: Piped Input**

```bash
# Terminal 1
cd /home/camden/projects/starter-app
npm run dev

# Terminal 2
echo "Add a welcome banner to the home page" | npm start
```

Pass feature request via echo.

---

## 📊 Expected Output Timeline

### **Terminal 1 (Starter App)**
```
✓ Ready in 1234ms

🤖 Terminal 2: Dev Agent requesting changes...

GET /api/hello 200 in 45ms (compile: 0ms, render: 2ms)
✓ Compiled / (2 modules) [fast refresh]

GET / 200 in 32ms (compile: 0ms, render: 15ms)
✓ Compiled /contact (3 modules) [fast refresh]
```

### **Terminal 2 (Dev Agent)**
```
🤖 Dev Agent Starting...

Enter feature request: Add a contact form

🔍 Stage 1: Clarifying Requirements...
✓ Requirements are clear

📝 Stage 2: Generating Requirements Specification...
✓ Requirements generated

📋 Stage 3: Creating Implementation Plan...
✓ Plan created: 3 tasks

⚙️  Stage 4: Generating Changes (Parallel Execution)...
✓ Task 1 complete (1/3)
✓ Task 2 complete (2/3)
✓ Task 3 complete (3/3)

💾 Stage 5: Applying Changes...
✓ Applied 3 changes

🧪 Stage 6: Verifying Tests...
✓ Tests passed

🌿 Stage 8: Git Operations...
✓ Branch created: feature/contact-form

✅ Agent completed successfully!
```

### **Browser (http://localhost:3000)**
```
Before: Basic Next.js home page
        
After:  [Your New Component Here!]
        - Added with perfect styling
        - Responsive design
        - Interactive functionality
```

---

## 🔧 Configuration for Real-Time Testing

Edit `.env` to enable features:

```dotenv
# Point to starter-app
REPO_PATH=../starter-app

# Skip deployments during testing
AUTO_DEPLOY=false

# Run tests (optional)
SKIP_TESTS=false

# Verbose output to see what's happening
VERBOSE=true

# Keep retrying on errors
MAX_RETRIES=2
```

---

## ⚡ Tips for Best Real-Time Experience

1. **Use Two Monitor Screens**
   - Terminal on left
   - Browser on right
   - Watch changes happen instantly

2. **Keep Browser DevTools Open**
   - See console logs
   - Check network requests
   - Inspect generated elements

3. **Keep Terminal Visible**
   - See agent progress
   - Understand what's being generated
   - Debug any issues

4. **Refresh Browser if Stuck**
   - Sometimes Ctrl+F5 helps
   - Or wait 2 seconds for Fast Refresh

5. **Small Feature Requests First**
   - Start with simple features
   - Graduate to complex ones
   - See parallel execution speed up

---

## 🧪 Test Scenarios

### **Scenario 1: Simple Component (2-3 min)**
```
Add a welcome banner with a greeting message to the home page
```

### **Scenario 2: Feature with Styling (3-5 min)**
```
Add a card component showing user stats (visits, users, conversions) with Tailwind CSS
```

### **Scenario 3: New Page (5-7 min)**
```
Create a new About page at /about with team member cards and a company description
```

### **Scenario 4: Interactive Component (7-10 min)**
```
Add a counter component to the home page that increments and decrements with buttons
```

### **Scenario 5: Form with Validation (10-15 min)**
```
Create a newsletter signup form with email validation and success message
```

---

## 🚨 Troubleshooting

### **Starter App Won't Start**
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill the process using it
kill -9 <PID>

# Try again
npm run dev
```

### **Agent Fails to Run**
```bash
# Check .env has correct path
cat /home/camden/projects/dev-agent/.env | grep REPO_PATH

# Should show:
# REPO_PATH=../starter-app
```

### **Browser Not Showing Changes**
```bash
# Hard refresh browser
Ctrl+Shift+R (or Cmd+Shift+R on Mac)

# Or check Terminal 1 for compilation errors
```

### **Git Operations Fail**
```bash
# Make sure starter-app is a git repo
cd /home/camden/projects/starter-app
git status

# If not initialized:
git init
git add .
git commit -m "Initial commit"
```

---

## 📸 Visual Flow

```
You Enter Feature Request
         ↓
    Agent Clarifies
         ↓
    Agent Plans
         ↓
    Agent Generates Code ⭐ (Parallel)
         ↓
    Agent Applies Files to starter-app/
         ↓
    Next.js Detects Changes ⚡
         ↓
    Next.js Recompiles Automatically
         ↓
    Browser Fast Refreshes 🔄
         ↓
    You See New Feature Live! ✨
```

---

## ✅ Success Indicators

You'll know it's working when:

- ✅ Terminal 1 shows "GET / 200" responses
- ✅ Terminal 2 shows "✓ Stage complete" messages
- ✅ Browser shows new components appearing
- ✅ No errors in either terminal
- ✅ Changes happen in 2-5 minutes

---

## 🎉 You're Ready!

Now you can:

1. **See agent thinking** (Terminal 2)
2. **See app building** (Terminal 1)
3. **See results live** (Browser)

All at the same time! 🚀

---

**Start with:**
```bash
# Terminal 1
npm run dev

# Terminal 2 (in another terminal)
npm start
```

Then watch the magic happen! ✨
