#!/usr/bin/env node

require('dotenv').config();
const readline = require('readline');
const { callLLM, callLLMWithHistory } = require('./lib/llm');
const { getFileTree, readFile, applyDiff } = require('./lib/files');
const { createBranch, stageChanges, commit, push } = require('./lib/git');
const { createPullRequest } = require('./lib/github');
const { runTests, testsExist, extractTestErrors, lintCode } = require('./lib/test');
const { deployWithVercel, detectDeploymentMethod, deployGitHubPages, deployDocker, checkDeploymentStatus } = require('./lib/deploy');
const {
  CLARIFICATION_SYSTEM,
  getRequirementsPrompt,
  getPlanningPrompt,
  getDiffPrompt,
  getPRPrompt,
  getErrorRecoveryPrompt,
  getTestRecoveryPrompt,
  getDeploymentSuccessPrompt
} = require('./lib/prompts');

const REPO_PATH = process.env.REPO_PATH || '../starter-app';
const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || '1');
const TEST_COMMAND = process.env.TEST_COMMAND || 'npm test';
const AUTO_DEPLOY = process.env.AUTO_DEPLOY === 'true';
const SKIP_TESTS = process.env.SKIP_TESTS === 'true';

// ============================================================================
// STAGE 1: Clarification
// ============================================================================
async function clarifyRequirements(userRequest) {
  console.log('\n🔍 Stage 1: Clarifying Requirements...');
  
  const conversationHistory = [
    { role: 'user', content: userRequest }
  ];

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    const response = await callLLMWithHistory(
      CLARIFICATION_SYSTEM,
      conversationHistory,
      { temperature: 0.3 }
    );

    if (response.startsWith('CLEAR:')) {
      console.log('✓ Requirements are clear');
      return userRequest;
    }

    if (response.startsWith('QUESTIONS:')) {
      console.log('\n' + response);
      
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise(resolve => {
        rl.question('\nYour answer: ', resolve);
      });
      rl.close();

      conversationHistory.push(
        { role: 'assistant', content: response },
        { role: 'user', content: answer }
      );

      attempts++;
    } else {
      break;
    }
  }

  // Compile final requirements
  const finalRequest = conversationHistory
    .filter(m => m.role === 'user')
    .map(m => m.content)
    .join('\n\n');

  return finalRequest;
}

// ============================================================================
// STAGE 2: Requirements Specification
// ============================================================================
async function generateRequirements(clarifiedRequest, fileTree) {
  console.log('\n📝 Stage 2: Generating Requirements Specification...');

  const response = await callLLM(
    getRequirementsPrompt(fileTree),
    clarifiedRequest,
    { expectJSON: true }
  );

  console.log('✓ Requirements generated');
  console.log(JSON.stringify(response, null, 2));

  return response;
}

// ============================================================================
// STAGE 3: Task Planning
// ============================================================================
async function generatePlan(requirements, fileTree) {
  console.log('\n📋 Stage 3: Creating Implementation Plan...');

  const response = await callLLM(
    getPlanningPrompt(requirements, fileTree),
    'Create the implementation plan.',
    { expectJSON: true }
  );

  console.log(`✓ Plan created: ${response.tasks.length} tasks`);
  response.tasks.forEach((task, i) => {
    console.log(`  ${i + 1}. ${task.description} (${task.file})`);
  });

  return response;
}

// ============================================================================
// PARALLEL EXECUTION HELPER
// ============================================================================
/**
 * Build a dependency graph and execute tasks in parallel where possible
 */
function buildDependencyGraph(plan) {
  const graph = new Map();
  const completed = new Set();

  // Initialize graph
  for (const task of plan.tasks) {
    graph.set(task.id, {
      task,
      dependencies: task.dependencies || [],
      ready: (task.dependencies || []).length === 0
    });
  }

  return { graph, completed };
}

/**
 * Execute tasks with dependency awareness
 */
async function executeTasks(plan, requirements) {
  console.log('\n⚙️  Stage 4: Generating Changes (Parallel Execution)...');
  console.log(`📊 Processing ${plan.tasks.length} tasks with dependency analysis`);

  const { graph, completed } = buildDependencyGraph(plan);
  const diffs = [];
  const taskResults = new Map();

  let totalTasks = plan.tasks.length;
  let completedTasks = 0;

  while (completed.size < totalTasks) {
    // Find all ready tasks (dependencies completed)
    const readyTaskIds = Array.from(graph.entries())
      .filter(([id, node]) => 
        !completed.has(id) && 
        node.dependencies.every(depId => completed.has(depId))
      )
      .map(([id]) => id);

    if (readyTaskIds.length === 0 && completed.size < totalTasks) {
      throw new Error('Circular dependency detected in task plan');
    }

    console.log(`\n🔄 Executing ${readyTaskIds.length} task(s) in parallel...`);

    // Execute ready tasks in parallel
    const taskPromises = readyTaskIds.map(async (taskId) => {
      const node = graph.get(taskId);
      const diff = await generateDiff(node.task, requirements);
      return { taskId, diff };
    });

    const results = await Promise.all(taskPromises);

    // Collect results
    for (const { taskId, diff } of results) {
      diffs.push(diff);
      completed.add(taskId);
      completedTasks++;
      console.log(`✓ Task ${taskId} complete (${completedTasks}/${totalTasks})`);
    }
  }

  console.log(`\n✓ All ${diffs.length} changes generated successfully`);
  return diffs;
}

// ============================================================================
// STAGE 4: Generate Diffs (with parallel support)
// ============================================================================
async function generateDiff(task, requirements) {
  console.log(`\n⚙️  Generating changes for: ${task.file}`);

  let currentContent = null;
  if (task.action === 'modify') {
    currentContent = await readFile(REPO_PATH, task.file);
    if (!currentContent) {
      console.log(`  Warning: File ${task.file} doesn't exist, treating as create`);
      task.action = 'create';
    }
  }

  let content;
  let attempt = 0;

  while (attempt <= MAX_RETRIES) {
    try {
      content = await callLLM(
        getDiffPrompt(task, requirements, currentContent),
        'Generate the code.',
        { maxTokens: 4000, temperature: 0.2 }
      );

      // Basic validation
      if (task.file.endsWith('.js') || task.file.endsWith('.jsx')) {
        if (!content.includes('export') && !content.includes('module.exports')) {
          throw new Error('Generated code missing exports');
        }
      }

      break;
    } catch (error) {
      console.log(`  ⚠️  Error: ${error.message}`);
      if (attempt < MAX_RETRIES) {
        console.log(`  Retrying... (${attempt + 1}/${MAX_RETRIES})`);
        content = await callLLM(
          getErrorRecoveryPrompt(error.message, task, currentContent),
          'Fix the code.',
          { maxTokens: 4000 }
        );
      } else {
        throw error;
      }
      attempt++;
    }
  }

  return {
    file: task.file,
    action: task.action,
    content,
    explanation: task.description
  };
}

// ============================================================================
// STAGE 5: Apply Changes
// ============================================================================
async function applyChanges(diffs) {
  console.log('\n💾 Stage 5: Applying Changes...');

  for (const diff of diffs) {
    await applyDiff(REPO_PATH, diff);
  }

  console.log(`✓ Applied ${diffs.length} changes`);
}

// ============================================================================
// STAGE 6: Test Verification
// ============================================================================
async function verifyTests(diffs, requirements) {
  if (SKIP_TESTS) {
    console.log('\n✓ Tests skipped (SKIP_TESTS=true)');
    return { success: true, errors: null };
  }

  const hasTests = await testsExist(REPO_PATH);
  
  if (!hasTests) {
    console.log('\n✓ No tests found, skipping verification');
    return { success: true, errors: null };
  }

  const testResult = await runTests(REPO_PATH, TEST_COMMAND);

  if (testResult.success) {
    console.log('\n✓ All tests passed!');
    return { success: true, errors: null };
  }

  console.log('\n⚠️  Tests failed, attempting to recover...');
  
  const errorSummary = extractTestErrors(testResult.error);
  const modifiedFiles = diffs.map(d => d.file);

  // Ask LLM to analyze test failures
  const analysis = await callLLM(
    getTestRecoveryPrompt(errorSummary, modifiedFiles, requirements),
    'Analyze test failures and suggest fixes.',
    { expectJSON: true, maxTokens: 2000 }
  );

  console.log('\n📋 Test Failure Analysis:');
  console.log(analysis.analysis);

  if (analysis.fixes && analysis.fixes.length > 0) {
    console.log('\n🔧 Suggested fixes:');
    analysis.fixes.forEach((fix, i) => {
      console.log(`${i + 1}. ${fix.file}: ${fix.issue}`);
      console.log(`   Solution: ${fix.solution}`);
    });
  }

  return { 
    success: false, 
    errors: errorSummary,
    analysis 
  };
}

// ============================================================================
// STAGE 7: Linting & Code Quality
// ============================================================================
async function validateCodeQuality() {
  console.log('\n🔍 Stage 7: Validating Code Quality...');

  const lintResult = await lintCode(REPO_PATH);

  if (lintResult.success) {
    console.log('✓ Code quality check passed');
    return { success: true };
  } else {
    console.log('⚠️  Linting issues found (non-blocking)');
    return { success: false, issues: lintResult.output };
  }
}

// ============================================================================
// STAGE 8: Git Operations
// ============================================================================
async function performGitOperations(branchName, commitMessage) {
  console.log('\n🌿 Stage 8: Git Operations...');

  await createBranch(REPO_PATH, branchName);
  await stageChanges(REPO_PATH);
  await commit(REPO_PATH, commitMessage);
  await push(REPO_PATH, branchName);

  console.log('✓ Git operations complete');
}

// ============================================================================
// STAGE 9: Create Pull Request
// ============================================================================
async function createPR(requirements, plan, modifiedFiles) {
  console.log('\n📤 Stage 9: Creating Pull Request...');

  const prMetadata = await callLLM(
    getPRPrompt(requirements, plan.tasks, modifiedFiles),
    'Generate PR metadata.',
    { expectJSON: true }
  );

  const pr = await createPullRequest(prMetadata);

  console.log('✓ Pull request created successfully!');
  console.log(`  URL: ${pr.html_url}`);

  return pr;
}

// ============================================================================
// STAGE 10: Deployment
// ============================================================================
async function deployChanges(branchName, requirements, pr) {
  if (!AUTO_DEPLOY) {
    console.log('\n📡 Deployment skipped (AUTO_DEPLOY=false)');
    console.log('To enable automatic deployment, set AUTO_DEPLOY=true in .env');
    return { success: true, deployed: false };
  }

  console.log('\n🚀 Stage 10: Deploying Changes...');

  try {
    const deployMethod = await detectDeploymentMethod(REPO_PATH);
    console.log(`📍 Detected deployment method: ${deployMethod}`);

    let deployResult;

    switch (deployMethod) {
      case 'vercel':
        deployResult = await deployWithVercel(branchName);
        console.log(`✓ Deployed to Vercel`);
        console.log(`  Preview URL: ${deployResult.url}`);
        return { success: true, deployed: true, ...deployResult };

      case 'github-pages':
        deployResult = await deployGitHubPages(REPO_PATH);
        return { success: deployResult.success, deployed: deployResult.success };

      case 'docker':
        deployResult = await deployDocker(REPO_PATH);
        return { success: deployResult.success, deployed: deployResult.success };

      case 'none':
      default:
        console.log('⚠️  No deployment method detected');
        console.log('Supported methods: Vercel, GitHub Pages, Docker');
        return { success: true, deployed: false };
    }
  } catch (error) {
    console.error(`⚠️  Deployment failed: ${error.message}`);
    console.log('The PR has been created, but automatic deployment failed.');
    console.log('You can manually review and deploy from the PR.');
    return { success: false, deployed: false, error: error.message };
  }
}

// ============================================================================
// MAIN ORCHESTRATOR
// ============================================================================
async function main() {
  console.log('🤖 Dev Agent Starting...\n');

  // Get user input
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const userRequest = await new Promise(resolve => {
    rl.question('Enter feature request: ', resolve);
  });
  rl.close();

  if (!userRequest.trim()) {
    console.log('No request provided. Exiting.');
    return;
  }

  try {
    // Stage 1: Clarify
    const clarifiedRequest = await clarifyRequirements(userRequest);

    // Stage 2: Requirements
    const fileTree = await getFileTree(REPO_PATH);
    const requirements = await generateRequirements(clarifiedRequest, fileTree);

    // Stage 3: Plan
    const plan = await generatePlan(requirements, fileTree);

    // Stage 4: Generate diffs with parallel execution support
    const diffs = await executeTasks(plan, requirements);

    // Stage 5: Apply changes
    await applyChanges(diffs);

    // Stage 6: Verify tests
    let testResult = await verifyTests(diffs, requirements);
    if (!testResult.success && !SKIP_TESTS) {
      console.log('⚠️  Tests failed. You may need to review the analysis above.');
      // Don't fail the entire pipeline, but alert user
    }

    // Stage 7: Validate code quality
    await validateCodeQuality();

    // Stage 8: Git operations
    const branchName = `feature/${requirements.feature
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .substring(0, 50)}`;
    
    const commitMessage = `feat: ${requirements.feature}`;
    
    await performGitOperations(branchName, commitMessage);

    // Stage 9: Create PR
    const modifiedFiles = diffs.map(d => d.file);
    const pr = await createPR(requirements, plan, modifiedFiles);

    // Stage 10: Deploy
    const deployResult = await deployChanges(branchName, requirements, pr);

    // Final summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ Agent completed successfully!');
    console.log('='.repeat(60));
    console.log(`\n📊 Summary:`);
    console.log(`  ✓ Feature: ${requirements.feature}`);
    console.log(`  ✓ Files modified: ${diffs.length}`);
    console.log(`  ✓ Tests: ${testResult.success ? 'PASSED' : 'NEEDS REVIEW'}`);
    console.log(`  ✓ PR URL: ${pr.html_url}`);
    if (deployResult.deployed) {
      console.log(`  ✓ Deployed: ${deployResult.url}`);
    }
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (process.env.VERBOSE === 'true') {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };

