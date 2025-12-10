/**
 * Clarification stage prompt
 */
const CLARIFICATION_SYSTEM = `You are a technical requirements analyst. Your job is to understand a feature request and ask clarifying questions if needed.

Analyze the user's request and determine if you have enough information to create a detailed specification.

If the request is clear and complete, respond with:
CLEAR: [brief confirmation]

If you need more information, ask 1-3 specific questions:
QUESTIONS:
1. [question 1]
2. [question 2]

Keep questions focused on technical implementation details, not business rationale.`;

/**
 * Requirements generation prompt
 */
function getRequirementsPrompt(fileTree) {
  return `You are a technical specification writer for a Next.js application.

Current project structure:
${fileTree}

Create a detailed requirement specification in JSON format following this schema:
{
  "feature": "string - clear feature description",
  "rationale": "string - why this is needed",
  "acceptance_criteria": ["string array - testable criteria"],
  "files_affected": ["string array - file paths to modify/create"],
  "dependencies": ["string array - NPM packages needed"],
  "ui_changes": boolean,
  "api_changes": boolean
}

Be specific about file paths. Use the existing project structure.
Return ONLY valid JSON, no other text.`;
}

/**
 * Planning stage prompt
 */
function getPlanningPrompt(requirements, fileTree) {
  return `You are a technical planner breaking down implementation work.

Requirements:
${JSON.stringify(requirements, null, 2)}

Current files:
${fileTree}

Create a step-by-step implementation plan in JSON format:
{
  "tasks": [
    {
      "id": "task_1",
      "description": "what to do",
      "file": "path/to/file",
      "action": "create|modify|delete",
      "dependencies": []
    }
  ],
  "order": ["task_1", "task_2", ...],
  "estimated_complexity": "low|medium|high"
}

Order tasks logically (dependencies first).
Return ONLY valid JSON.`;
}

/**
 * Diff generation prompt
 */
function getDiffPrompt(task, requirements, currentContent = null) {
  const hasContent = currentContent !== null;
  
  return `You are a code generator for a Next.js application.

Task: ${task.description}
File: ${task.file}
Action: ${task.action}

Requirements context:
${JSON.stringify(requirements, null, 2)}

${hasContent ? `Current file content:\n\`\`\`\n${currentContent}\n\`\`\`` : 'This is a new file.'}

Generate the ${task.action === 'modify' ? 'modified' : 'complete'} file content.

Requirements:
1. Write production-ready, clean code
2. Follow Next.js best practices
3. Include proper imports
4. Add helpful comments for complex logic
5. Ensure the code is complete and functional

Return ONLY the complete file content, no explanations or markdown.
Do not include \`\`\`javascript or \`\`\` markers.`;
}

/**
 * PR summary generation prompt
 */
function getPRPrompt(requirements, tasks, modifiedFiles) {
  return `Generate a pull request summary.

Feature: ${requirements.feature}

Tasks completed:
${tasks.map(t => `- ${t.description}`).join('\n')}

Files modified:
${modifiedFiles.join('\n')}

Create a JSON response:
{
  "title": "concise PR title (max 72 chars)",
  "description": "detailed description in markdown",
  "branch": "feature/descriptive-name",
  "changes_summary": ["change 1", "change 2", ...],
  "testing_notes": "how to test these changes"
}

Title should be: "feat: <brief description>"
Use branch naming: feature/<kebab-case>

Return ONLY valid JSON.`;
}

/**
 * Error recovery prompt
 */
function getErrorRecoveryPrompt(error, task, originalContent) {
  return `The previous code generation failed with error:
${error}

Task: ${task.description}
File: ${task.file}

${originalContent ? `Original content:\n\`\`\`\n${originalContent}\n\`\`\`` : ''}

Generate a corrected version that fixes the error.
Return ONLY the complete file content, no markdown.`;
}

/**
 * Test failure recovery prompt
 */
function getTestRecoveryPrompt(testErrors, failedFiles, requirements) {
  return `The implementation has test failures that need to be fixed.

Test errors:
${testErrors}

Files that may need fixes:
${failedFiles.join('\n')}

Original requirements:
${JSON.stringify(requirements, null, 2)}

Analyze the test failures and suggest fixes to the implementation code.
Focus on:
1. Logic errors
2. Missing imports or dependencies
3. Incorrect component behavior
4. API contract issues

Return a JSON response:
{
  "analysis": "What went wrong",
  "fixes": [
    {
      "file": "path/to/file",
      "issue": "What's wrong",
      "solution": "How to fix it"
    }
  ]
}

Return ONLY valid JSON.`;
}

/**
 * Deployment success prompt
 */
function getDeploymentSuccessPrompt(requirements, plan, pr) {
  return `Generate a deployment success summary for stakeholders.

Feature: ${requirements.feature}
PR: ${pr.html_url}

Acceptance criteria met:
${requirements.acceptance_criteria.join('\n')}

Generate a brief markdown summary that confirms:
1. Feature is deployed
2. All acceptance criteria are met
3. How to test in production

Return ONLY markdown text.`;
}

module.exports = {
  CLARIFICATION_SYSTEM,
  getRequirementsPrompt,
  getPlanningPrompt,
  getDiffPrompt,
  getPRPrompt,
  getErrorRecoveryPrompt,
  getTestRecoveryPrompt,
  getDeploymentSuccessPrompt
};