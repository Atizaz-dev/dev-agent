const simpleGit = require('simple-git');

/**
 * Create and checkout feature branch
 */
async function createBranch(repoPath, branchName) {
  const git = simpleGit(repoPath);
  
  // Ensure we're on main/master
  try {
    await git.checkout('main');
  } catch {
    await git.checkout('master');
  }

  // Pull latest changes
  await git.pull();

  // Create and checkout new branch
  await git.checkoutLocalBranch(branchName);
  
  console.log(`✓ Created and checked out branch: ${branchName}`);
}

/**
 * Stage all changes
 */
async function stageChanges(repoPath) {
  const git = simpleGit(repoPath);
  await git.add('.');
  console.log('✓ Staged all changes');
}

/**
 * Commit changes
 */
async function commit(repoPath, message) {
  const git = simpleGit(repoPath);
  await git.commit(message);
  console.log(`✓ Committed: ${message}`);
}

/**
 * Push branch to remote
 */
async function push(repoPath, branchName) {
  const git = simpleGit(repoPath);
  await git.push('origin', branchName, ['--set-upstream']);
  console.log(`✓ Pushed branch ${branchName} to origin`);
}

/**
 * Get current branch name
 */
async function getCurrentBranch(repoPath) {
  const git = simpleGit(repoPath);
  const status = await git.status();
  return status.current;
}

/**
 * Check if repository is clean
 */
async function isClean(repoPath) {
  const git = simpleGit(repoPath);
  const status = await git.status();
  return status.isClean();
}

/**
 * Get list of modified files
 */
async function getModifiedFiles(repoPath) {
  const git = simpleGit(repoPath);
  const status = await git.status();
  return [
    ...status.modified,
    ...status.created,
    ...status.deleted
  ];
}

module.exports = {
  createBranch,
  stageChanges,
  commit,
  push,
  getCurrentBranch,
  isClean,
  getModifiedFiles
};