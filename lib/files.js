const fs = require('fs').promises;
const path = require('path');

/**
 * Read file content
 */
async function readFile(repoPath, filePath) {
  try {
    const fullPath = path.join(repoPath, filePath);
    const content = await fs.readFile(fullPath, 'utf-8');
    return content;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null; // File doesn't exist
    }
    throw error;
  }
}

/**
 * Write file content (creates directories if needed)
 */
async function writeFile(repoPath, filePath, content) {
  const fullPath = path.join(repoPath, filePath);
  const dir = path.dirname(fullPath);

  // Ensure directory exists
  await fs.mkdir(dir, { recursive: true });
  
  await fs.writeFile(fullPath, content, 'utf-8');
}

/**
 * Delete file
 */
async function deleteFile(repoPath, filePath) {
  const fullPath = path.join(repoPath, filePath);
  try {
    await fs.unlink(fullPath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

/**
 * Check if file exists
 */
async function fileExists(repoPath, filePath) {
  try {
    const fullPath = path.join(repoPath, filePath);
    await fs.access(fullPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * List all files in directory recursively
 */
async function listFiles(repoPath, dir = '', extensions = ['.js', '.jsx', '.css', '.json']) {
  const fullPath = path.join(repoPath, dir);
  const files = [];

  try {
    const entries = await fs.readdir(fullPath, { withFileTypes: true });

    for (const entry of entries) {
      const relativePath = path.join(dir, entry.name);
      
      // Skip node_modules and .next
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') {
        continue;
      }

      if (entry.isDirectory()) {
        const subFiles = await listFiles(repoPath, relativePath, extensions);
        files.push(...subFiles);
      } else if (extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(relativePath);
      }
    }
  } catch (error) {
    console.error(`Error listing files in ${fullPath}:`, error.message);
  }

  return files;
}

/**
 * Get file tree structure for context
 */
async function getFileTree(repoPath) {
  const files = await listFiles(repoPath);
  return files.join('\n');
}

/**
 * Apply a diff (create/modify/delete file)
 */
async function applyDiff(repoPath, diff) {
  const { file, action, content } = diff;

  console.log(`  Applying ${action} to ${file}...`);

  switch (action) {
    case 'create':
    case 'modify':
      await writeFile(repoPath, file, content);
      break;
    case 'delete':
      await deleteFile(repoPath, file);
      break;
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

module.exports = {
  readFile,
  writeFile,
  deleteFile,
  fileExists,
  listFiles,
  getFileTree,
  applyDiff
};