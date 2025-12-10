# Dev Agent - Complete Testing Guide

## 🎯 Quick Test (5 minutes)

### **Setup** (once)
```bash
# Terminal 1
cd /home/camden/projects/starter-app
npm run dev

# Wait for: ✓ Ready in 1234ms

# Terminal 2 (NEW terminal window)
cd /home/camden/projects/dev-agent
npm start
```

### **Run Test**
```
Enter feature request: Add a welcome message to the home page with Tailwind styling
```

### **Watch**
- Terminal 1: File changes → "✓ Compiled /"
- Browser: Refresh at http://localhost:3000
- Terminal 2: "✅ Stage complete"

---

## 📊 Full Test Scenarios

### **Test 1: Simple Component (2-3 minutes)**

**Request:**
```
Add a hero banner to the home page with a large title "Welcome to Dev Agent" 
and a subtitle. Use Tailwind CSS with a gradient background.
```

**What to expect:**
1. Agent asks: "Should the banner be full-width or contained?"
2. Answer: "Full width"
3. Code generates in ~15 seconds
4. Home page updates live
5. New banner appears with gradient

**Success indicators:**
- ✓ Terminal 1 shows "✓ Compiled"
- ✓ Browser shows new banner
- ✓ Terminal 2 shows "✅ Stage complete"

---

### **Test 2: Card Component (3-5 minutes)**

**Request:**
```
Add a stats card component showing Views, Users, and Revenue with nice icons.
Place it on the home page. Use Tailwind CSS for a clean, modern look.
```

**What to expect:**
1. Agent plans: 2-3 tasks
2. Generates component and modifies home page in parallel
3. Browser updates with new cards
4. All styled beautifully

**Success indicators:**
- ✓ New component file created
- ✓ Home page modified
- ✓ Stats appear with styling
- ✓ Responsive on different screen sizes

---

### **Test 3: New Page (5-7 minutes)**

**Request:**
```
Create an About page at /about with team member cards showing name, role, 
and a short bio. Include a page header and navigation link from the header.
```

**What to expect:**
1. Agent creates new page
2. Modifies header to add link
3. Creates TeamCard component
4. Browser can navigate to new page

**Success indicators:**
- ✓ new file: pages/about.js
- ✓ Header updated with link
- ✓ New page visible at /about
- ✓ Team cards display correctly

---

### **Test 4: Interactive Feature (7-10 minutes)**

**Request:**
```
Create a simple counter component on the home page that increments and 
decrements when you click buttons. Use React state and Tailwind styling.
```

**What to expect:**
1. Component with state created
2. Event handlers working
3. Buttons increment/decrement counter
4. Live interaction visible

**Success indicators:**
- ✓ Counter appears on home page
- ✓ Buttons respond to clicks
- ✓ Number increases/decreases
- ✓ Styling is consistent

---

### **Test 5: Form with Validation (10-15 minutes)**

**Request:**
```
Create a newsletter signup form with email validation. Show a success 
message when submitted. Add it to the home page. Use Tailwind for styling.
```

**What to expect:**
1. Form component created
2. Email validation implemented
3. Success message on submit
4. Form styling looks professional

**Success indicators:**
- ✓ Form appears on home page
- ✓ Email validation works
- ✓ Error message for invalid emails
- ✓ Success message on valid submit

---

## 🔍 What to Look For

### **Terminal 1 (Starter App)**
```
✓ Compiled /          ← File changes detected
✓ Compiled /about     ← New page compiled
GET / 200 in 32ms     ← Page load successful
```

### **Terminal 2 (Dev Agent)**
```
🔍 Stage 1: Clarifying...
  Question: ...?
  > your answer

📝 Stage 2: Generating...
  ✓ Requirements generated

⚙️  Stage 4: Generating Code (Parallel)
  ✓ Task 1 complete
  ✓ Task 2 complete
  ✓ Task 3 complete
```

### **Browser (http://localhost:3000)**
```
Before: Plain Next.js page
After:  Your new component with styling ✨
```

---

## 🚀 Performance Checks

### **Parallel Execution (NEW Feature)**
- Single-file task: ~5-10 seconds
- Multi-file tasks: Run in parallel
- Observable 40% speedup vs sequential

### **Testing Integration (NEW Feature)**
- Agent runs npm test automatically
- Shows test results
- Suggests fixes if needed

### **Deployment (NEW Feature)**
- (Optional) Auto-deploys if configured
- Shows deployment URL
- Can be disabled in .env

---

## ⚙️ Configuration for Testing

Edit `/home/camden/projects/dev-agent/.env`:

```dotenv
# Point to starter-app
REPO_PATH=../starter-app

# Watch for changes
AUTO_DEPLOY=false

# Show all steps
VERBOSE=true

# Retry on errors
MAX_RETRIES=2

# Run tests
SKIP_TESTS=false
TEST_COMMAND=npm test
```

---

## 🐛 Troubleshooting

### **Port 3000 already in use**
```bash
lsof -i :3000
kill -9 <PID>
```

### **Next.js not reloading**
```bash
# Hard refresh
Ctrl+Shift+R (or Cmd+Shift+R)

# Or restart Terminal 1
Ctrl+C
npm run dev
```

### **Agent stuck waiting**
```bash
# Ctrl+C in Terminal 2
# Press Enter to continue
npm start
```

### **Git operations failing**
```bash
cd /home/camden/projects/starter-app
git status
# Should show you're in a git repo
```

---

## 📝 Test Checklist

For each feature request:

- [ ] Agent asks clarifying questions
- [ ] Agent generates plan with tasks
- [ ] Code generates in reasonable time
- [ ] Terminal 1 shows compilation
- [ ] Browser auto-refreshes
- [ ] New component/page appears
- [ ] Styling looks correct
- [ ] Agent completes successfully
- [ ] No errors in either terminal

---

## 🎥 Recommended Test Order

1. **Start simple** - Welcome message
2. **Add styling** - Card components
3. **Add interaction** - Counter/button
4. **Create new pages** - About/contact
5. **Add forms** - Newsletter signup
6. **Test validation** - Form validation

Each test builds confidence for more complex ones.

---

## �� Expected Timelines

| Test | Time | Complexity |
|------|------|-----------|
| Welcome message | 1-2 min | Simple |
| Card component | 2-3 min | Easy |
| New page | 5-7 min | Medium |
| Interactive feature | 7-10 min | Medium |
| Form validation | 10-15 min | Complex |

---

## ✅ Success Criteria

You'll know it's working when:

1. ✅ Agent responds to your feature request
2. ✅ Code generates automatically
3. ✅ Files appear in starter-app/
4. ✅ Next.js detects changes
5. ✅ Browser shows new component
6. ✅ Styling is applied
7. ✅ Everything looks professional

---

## 🎯 Final Test

**Run this to confirm everything works:**

```bash
# Terminal 1
cd /home/camden/projects/starter-app && npm run dev

# Terminal 2
cd /home/camden/projects/dev-agent && npm start

# Enter this request:
# "Add a colorful card showing 'Dev Agent is Working!' with a checkmark"

# Check:
# 1. Terminal 1 shows compilation
# 2. Terminal 2 shows all stages
# 3. Browser shows new card
# 4. It looks great!
```

If all three ✓, you're ready to test anything! 🚀

---

**Happy testing!** 🎉
