const { spawn } = require('child_process');
const path = require('path');

/**
 * Run tests in the target repository
 * @param {string} repoPath - Path to repository
 * @param {string} testCommand - Command to run tests (default: 'npm test')
 * @returns {Promise<{success: boolean, output: string, error: string|null}>}
 */
async function runTests(repoPath, testCommand = 'npm test') {
  return new Promise((resolve) => {
    console.log(`\n🧪 Running tests with: ${testCommand}`);

    const [cmd, ...args] = testCommand.split(' ');
    let output = '';
    let errorOutput = '';

    const proc = spawn(cmd, args, {
      cwd: repoPath,
      shell: true,
      timeout: 120000 // 2 minute timeout
    });

    proc.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      process.stdout.write(text);
    });

    proc.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      process.stderr.write(text);
    });

    proc.on('error', (error) => {
      console.error(`Test process error: ${error.message}`);
      resolve({
        success: false,
        output,
        error: error.message
      });
    });

    proc.on('close', (code) => {
      if (code === 0) {
        console.log('✓ Tests passed');
        resolve({
          success: true,
          output,
          error: null
        });
      } else {
        console.log(`✗ Tests failed with code ${code}`);
        resolve({
          success: false,
          output,
          error: errorOutput || output
        });
      }
    });
  });
}

/**
 * Check if tests exist in the repository
 * @param {string} repoPath - Path to repository
 * @returns {Promise<boolean>}
 */
async function testsExist(repoPath) {
  const fs = require('fs').promises;
  
  try {
    // Check for test files or scripts
    const packageJsonPath = path.join(repoPath, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
    
    return !!packageJson.scripts?.test;
  } catch {
    return false;
  }
}

/**
 * Extract key error information from test output
 * @param {string} testOutput - Full test output
 * @returns {string} - Condensed error summary
 */
function extractTestErrors(testOutput) {
  const lines = testOutput.split('\n');
  const errors = [];
  
  // Look for common error patterns
  for (const line of lines) {
    if (line.includes('Error') || line.includes('FAIL') || line.includes('failed')) {
      errors.push(line.trim());
    }
  }

  if (errors.length > 0) {
    return errors.slice(0, 10).join('\n'); // Limit to first 10 errors
  }

  // If no specific errors found, return last 5 lines
  return lines.slice(-5).join('\n');
}

/**
 * Validate code by running linter (if available)
 * @param {string} repoPath - Path to repository
 * @returns {Promise<{success: boolean, output: string}>}
 */
async function lintCode(repoPath) {
  return new Promise((resolve) => {
    const fs = require('fs').promises;
    const packageJsonPath = path.join(repoPath, 'package.json');

    fs.readFile(packageJsonPath, 'utf-8')
      .then(content => {
        const packageJson = JSON.parse(content);
        const lintCmd = packageJson.scripts?.lint;

        if (!lintCmd) {
          resolve({ success: true, output: 'No lint script found' });
          return;
        }

        console.log(`\n🔍 Running linter: ${lintCmd}`);

        const [cmd, ...args] = lintCmd.split(' ');
        let output = '';

        const proc = spawn(cmd, args, {
          cwd: repoPath,
          shell: true,
          timeout: 60000
        });

        proc.stdout.on('data', (data) => {
          output += data.toString();
          process.stdout.write(data);
        });

        proc.stderr.on('data', (data) => {
          output += data.toString();
          process.stderr.write(data);
        });

        proc.on('close', (code) => {
          if (code === 0) {
            console.log('✓ Linting passed');
            resolve({ success: true, output });
          } else {
            console.log('✗ Linting failed');
            resolve({ success: false, output });
          }
        });

        proc.on('error', (error) => {
          resolve({ success: false, output: error.message });
        });
      })
      .catch(() => {
        resolve({ success: true, output: 'Could not read package.json' });
      });
  });
}

module.exports = {
  runTests,
  testsExist,
  extractTestErrors,
  lintCode
};
