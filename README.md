# Dev Agent - Autonomous Development Workflow

A sophisticated AI-powered development agent that transforms feature requests into complete implementations with automated testing, deployment, and pull requests.

## 🎯 Overview

Dev Agent is an autonomous system that can:

1. **Clarify Requirements** - Ask follow-up questions to understand vague requests
2. **Generate Specifications** - Create structured requirement documents
3. **Plan Implementation** - Break features into tasks with dependency tracking
4. **Execute Parallel Tasks** - Generate code for multiple files in parallel
5. **Apply Changes** - Write generated code to disk automatically
6. **Verify Tests** - Run test suites and recover from failures
7. **Validate Quality** - Run linters and code quality checks
8. **Push to Git** - Create branches and commit changes
9. **Create Pull Requests** - Auto-generate PR metadata on GitHub
10. **Deploy Automatically** - Support for Vercel, GitHub Pages, and Docker

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Git with GitHub access
- API key for LLM (Anthropic Claude or OpenAI GPT)
- GitHub personal access token

### Installation

```bash
cd dev-agent
npm install
cp .env.example .env
# Edit .env with your API keys
```

### Configuration

Edit `.env` with your settings:

```dotenv
# LLM Choice
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...

# GitHub
GITHUB_TOKEN=ghp_...
GITHUB_OWNER=your-username
GITHUB_REPO=your-repo

# Testing (optional)
TEST_COMMAND=npm test
SKIP_TESTS=false

# Deployment (optional)
AUTO_DEPLOY=false
VERCEL_API_TOKEN=... (for Vercel)
VERCEL_PROJECT_ID=... (for Vercel)

# Target Repository
REPO_PATH=../starter-app
```

### Usage

```bash
npm start
```

Then enter a feature request:

```
Enter feature request: Add a dark mode toggle to the settings page. Store preference in localStorage.
```

## 📋 How It Works

### The 10-Stage Workflow

```
┌─────────────────────────────────────────────────────────┐
│ Stage 1: Clarification                                  │
│ Interactive multi-turn conversation to understand needs │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Stage 2: Requirements Generation                        │
│ Creates structured specification with acceptance criteria│
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Stage 3: Task Planning                                  │
│ Breaks into tasks with dependency tracking              │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Stage 4: Parallel Code Generation ⭐ NEW               │
│ Generates code for independent tasks simultaneously     │
│ - Analyzes task dependencies                            │
│ - Executes ready tasks in parallel (Promise.all)        │
│ - Includes validation and retry logic                   │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Stage 5: Apply Changes                                  │
│ Writes generated code to the repository                 │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Stage 6: Test Verification ⭐ NEW                      │
│ - Runs npm test or custom test command                  │
│ - Analyzes failures with LLM                            │
│ - Suggests fixes (non-blocking)                         │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Stage 7: Code Quality Check ⭐ NEW                     │
│ - Runs linter if available                              │
│ - Provides feedback (non-blocking)                      │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Stage 8: Git Operations                                 │
│ - Creates feature branch                                │
│ - Stages and commits changes                            │
│ - Pushes to remote                                      │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Stage 9: Pull Request Creation                          │
│ - Generates PR title and description                    │
│ - Creates PR on GitHub                                  │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│ Stage 10: Deployment ⭐ NEW                            │
│ - Detects deployment method (Vercel/GitHub/Docker)      │
│ - Initiates deployment if AUTO_DEPLOY=true              │
│ - Returns deployment URL                                │
└──────────────────────────────────────────────────────────┘
```

## ✨ New Features (Phase 2)

### 1. **Parallel Task Execution** 🔄

The agent now analyzes task dependencies and executes independent tasks simultaneously:

```javascript
// Tasks 1 and 3 run in parallel (no dependencies)
// Task 2 runs after both complete
// Significant speedup for multi-file implementations
```

**Benefits:**
- Faster code generation for complex features
- Leverages task dependency graph
- Automatic ordering and coordination

### 2. **Runtime Testing & Verification** 🧪

After changes are applied, the agent automatically:

1. **Runs tests** - Executes `npm test` or custom command
2. **Analyzes failures** - Uses LLM to understand what broke
3. **Suggests fixes** - Provides recommendations (non-blocking)
4. **Runs linter** - Checks code quality

Configuration:
```dotenv
TEST_COMMAND=npm test          # Custom test command
SKIP_TESTS=false               # Skip test execution
```

Example output:
```
🧪 Running tests with: npm test
⚠️  Tests failed, attempting to recover...

📋 Test Failure Analysis:
The component is missing a required prop "onClick" that's being used in...

🔧 Suggested fixes:
1. components/Button.js: Missing onClick handler prop
   Solution: Add onClick prop to function signature
```

### 3. **Automated Deployment** 🚀

Auto-deploys after PR creation with support for multiple platforms:

#### Vercel (Next.js apps)
```dotenv
AUTO_DEPLOY=true
VERCEL_API_TOKEN=your_token
VERCEL_PROJECT_ID=your_project_id
```

#### GitHub Pages (Static sites)
- Auto-detects `.github/` directory
- Runs `npm run build`
- Triggers automatic GitHub Pages deployment

#### Docker (Any containerized app)
- Auto-detects `Dockerfile`
- Builds docker image
- Reports build status

#### Configuration
```dotenv
AUTO_DEPLOY=false                    # Enable automatic deployment
# Vercel (optional)
VERCEL_API_TOKEN=vercel_token
VERCEL_PROJECT_ID=project_id
```

## 📂 Project Structure

```
dev-agent/
├── agent.js              # Main orchestrator with 10-stage workflow
├── lib/
│   ├── llm.js           # LLM provider abstraction (Anthropic/OpenAI)
│   ├── files.js         # File I/O operations
│   ├── git.js           # Git operations
│   ├── github.js        # GitHub API integration
│   ├── test.js          # Test execution & analysis ⭐ NEW
│   ├── deploy.js        # Deployment automation ⭐ NEW
│   └── prompts.js       # LLM prompts for each stage
├── schemas/
│   ├── requirement.json  # Requirement spec schema
│   ├── plan.json        # Task plan schema
│   ├── pr.json          # PR metadata schema
│   └── diff.json        # Code diff schema
├── .env.example         # Configuration template
├── package.json         # Dependencies
└── README.md            # This file
```

## 🔧 Configuration Options

| Variable | Default | Purpose |
|----------|---------|---------|
| `LLM_PROVIDER` | `anthropic` | Which LLM to use: `anthropic` or `openai` |
| `ANTHROPIC_API_KEY` | - | Claude API key |
| `OPENAI_API_KEY` | - | OpenAI API key |
| `ANTHROPIC_MODEL` | `claude-sonnet-4-20250514` | Claude model to use |
| `OPENAI_MODEL` | `gpt-4-turbo-preview` | OpenAI model to use |
| `GITHUB_TOKEN` | - | GitHub personal access token |
| `GITHUB_OWNER` | - | Repository owner |
| `GITHUB_REPO` | `starter-app` | Repository name |
| `REPO_PATH` | `../starter-app` | Path to target repository |
| `TEST_COMMAND` | `npm test` | Command to run tests |
| `SKIP_TESTS` | `false` | Skip test execution |
| `AUTO_DEPLOY` | `false` | Enable automatic deployment |
| `VERCEL_API_TOKEN` | - | Vercel API token (for Vercel deploy) |
| `VERCEL_PROJECT_ID` | - | Vercel project ID |
| `MAX_RETRIES` | `1` | Retry attempts for code generation |
| `VERBOSE` | `true` | Verbose logging |

## 📝 Example Usage

### Simple Feature Request

```
Request: "Add a 'dark mode' toggle to the settings page"

Agent flow:
1. Clarifies: "Should dark mode apply to entire app or just settings?"
2. Generates requirements with acceptance criteria
3. Plans tasks: [Create ThemeProvider, Update Settings UI, Add CSS]
4. Generates code in parallel for 3 files
5. Applies changes
6. Runs tests
7. Checks linting
8. Creates PR
9. Deploys to Vercel
```

### Complex Feature Request

```
Request: "Build a real-time notification system with user preferences"

Agent handles:
- Multiple clarifying questions (3-turn conversation)
- Complex task dependencies
- Database schema changes
- API endpoints
- Frontend components
- Test coverage
- Parallel generation (4+ files simultaneously)
- Test failure recovery
- Automated deployment
```

## 🎯 Design Philosophy

### Constraints (Intentional Tradeoffs)

- **Focused on frontend features** - Next.js/React applications
- **Works with existing repos** - Doesn't create new projects
- **Structured output** - JSON schemas guide LLM responses
- **Non-blocking verification** - Tests/lint failures don't stop pipeline
- **Safe by default** - Requires explicit `AUTO_DEPLOY=true` for deployment

### Advantages

✅ **End-to-end automation** - From request to deployed feature
✅ **Parallel execution** - Faster for multi-file features
✅ **Error recovery** - Automatic test failure analysis
✅ **Clear workflow** - 10 distinct stages with logging
✅ **Extensible** - Easy to add new tools and stages
✅ **Provider agnostic** - Works with Anthropic or OpenAI

### Known Limitations

⚠️ **No sandbox isolation** - Runs in host environment
⚠️ **Limited to code generation** - Doesn't modify configs (yet)
⚠️ **Test-dependent quality** - Only as good as tests catch
⚠️ **Single-repo focus** - One repo per invocation

## 🔌 Extending the Agent

### Adding a New Tool

1. Create `lib/newtool.js` with exported functions
2. Import in `agent.js`
3. Create new stage function
4. Add to main workflow
5. Update `.env.example` with new config vars

Example:
```javascript
// lib/slack.js
async function notifySlack(message) {
  // Implementation
}
module.exports = { notifySlack };
```

### Adding a New Stage

```javascript
async function myNewStage(data) {
  console.log('\n📌 Stage X: My New Stage...');
  
  // Do work
  
  console.log('✓ Stage complete');
  return result;
}

// In main():
const result = await myNewStage(previousData);
```

## 🧪 Testing the Agent

### Test the Starter App First

```bash
cd ../starter-app
npm install
npm test
```

### Run the Agent

```bash
cd dev-agent
npm start
```

### Example Request to Test

```
Request: "Add a 'Contact Us' page with a form"

This tests:
✓ Requirement clarification
✓ Multi-file generation
✓ Component creation
✓ Form handling
✓ Test execution
✓ PR creation
```

## 📊 Workflow Statistics

Typical execution times:

| Stage | Time |
|-------|------|
| Clarification | 10-30s (interactive) |
| Requirements | 5-10s |
| Planning | 5-10s |
| Code Generation | 15-45s (parallel 2-4x faster) |
| Testing | 5-30s (depends on test suite) |
| Git Operations | 5-10s |
| PR Creation | 2-5s |
| Deployment | 10-60s (optional) |
| **Total** | **1-3 minutes** |

## 🐛 Troubleshooting

### Tests are failing
- Check `TEST_COMMAND` in `.env`
- Verify test suite works: `cd $REPO_PATH && npm test`
- Review agent's test analysis output
- Check git branch has changes applied

### Deployment failing
- Verify `AUTO_DEPLOY=true` if you want automatic deployment
- Check Vercel/GitHub/Docker credentials
- Review deployment method auto-detection
- Manual deployment always available via created PR

### Code generation issues
- Increase `MAX_RETRIES` in `.env`
- Check LLM API quotas
- Verify target repo structure exists
- Use `VERBOSE=true` for detailed logs

### Git operations failing
- Ensure repo is initialized: `git init`
- Check GitHub token has repo access
- Verify branch name doesn't conflict
- Ensure upstream is configured

## 📚 Architecture Decision Records

### Why Parallel Execution?
- Real feature requests often have independent tasks
- LLM generation is I/O bound (network requests)
- 2-4x speedup with minimal complexity
- Dependency graph prevents conflicts

### Why Non-Blocking Tests?
- Perfect test coverage is unrealistic
- Agent can still create PR for human review
- Failure analysis helps developer understand issues
- Prevents false failures from blocking useful work

### Why No Sandbox?
- Direct filesystem access is simpler
- Agent requires file system write access anyway
- Trust model: agent is trusted code in CI/CD
- Can be added later (Docker, VM isolation)

## 🤝 Contributing

To improve the agent:

1. Add new modules in `lib/`
2. Update prompts in `lib/prompts.js`
3. Add new stages in `agent.js`
4. Test with various feature requests
5. Document changes in README

## 📄 License

MIT

## 🙏 Acknowledgments

Built with:
- [Anthropic Claude](https://claude.ai) or [OpenAI GPT](https://openai.com)
- [GitHub API](https://docs.github.com/en/rest)
- [simple-git](https://github.com/steveukx/git-js)
- [dotenv](https://github.com/motdotla/dotenv)

---

**Ready to automate your development?** Start with `npm start` and watch the agent build features! 