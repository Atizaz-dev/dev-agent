const https = require('https');
const { spawn } = require('child_process');

const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

/**
 * Deploy using Vercel API
 * @param {string} branchName - Git branch to deploy
 * @returns {Promise<{success: boolean, url: string, deploymentId: string}>}
 */
async function deployWithVercel(branchName) {
  if (!VERCEL_API_TOKEN || !VERCEL_PROJECT_ID) {
    throw new Error('VERCEL_API_TOKEN and VERCEL_PROJECT_ID environment variables are required');
  }

  console.log('\n🚀 Deploying to Vercel...');

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      port: 443,
      path: `/v13/deployments?projectId=${VERCEL_PROJECT_ID}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VERCEL_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const deploymentData = {
      name: VERCEL_PROJECT_ID,
      env: {
        'VERCEL_GIT_COMMIT_REF': branchName
      },
      gitMetadata: {
        ref: branchName
      }
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const response = JSON.parse(body);
          console.log(`✓ Deployment initiated: ${response.url}`);
          resolve({
            success: true,
            url: response.url,
            deploymentId: response.id
          });
        } else {
          console.log(`✗ Vercel deployment failed: ${res.statusCode}`);
          reject(new Error(`Vercel API error: ${res.statusCode} - ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Deployment request failed: ${error.message}`));
    });

    req.write(JSON.stringify(deploymentData));
    req.end();
  });
}

/**
 * Check Vercel deployment status
 * @param {string} deploymentId - Vercel deployment ID
 * @returns {Promise<{status: string, url: string}>}
 */
async function checkDeploymentStatus(deploymentId) {
  if (!VERCEL_API_TOKEN) {
    throw new Error('VERCEL_API_TOKEN environment variable is required');
  }

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      port: 443,
      path: `/v13/deployments/${deploymentId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${VERCEL_API_TOKEN}`
      }
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          const deployment = JSON.parse(body);
          resolve({
            status: deployment.state,
            url: deployment.url
          });
        } else {
          reject(new Error(`Status check failed: ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * Deploy to GitHub Pages (for static sites)
 * @param {string} repoPath - Path to repository
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function deployGitHubPages(repoPath) {
  console.log('\n🚀 Deploying to GitHub Pages...');

  return new Promise((resolve) => {
    // Run build command first
    const buildProc = spawn('npm', ['run', 'build'], {
      cwd: repoPath,
      shell: true,
      timeout: 300000 // 5 minute timeout
    });

    let buildOutput = '';

    buildProc.stdout.on('data', (data) => {
      buildOutput += data.toString();
      process.stdout.write(data);
    });

    buildProc.stderr.on('data', (data) => {
      buildOutput += data.toString();
      process.stderr.write(data);
    });

    buildProc.on('close', (code) => {
      if (code === 0) {
        console.log('✓ Build successful');
        console.log('Note: Push changes to trigger GitHub Pages deployment');
        resolve({
          success: true,
          message: 'Build completed successfully. GitHub Pages will deploy automatically on push.'
        });
      } else {
        console.log('✗ Build failed');
        resolve({
          success: false,
          message: `Build failed with code ${code}`
        });
      }
    });

    buildProc.on('error', (error) => {
      resolve({
        success: false,
        message: `Build process error: ${error.message}`
      });
    });
  });
}

/**
 * Deploy using Docker (if Dockerfile exists)
 * @param {string} repoPath - Path to repository
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function deployDocker(repoPath) {
  const fs = require('fs').promises;
  const dockerfilePath = require('path').join(repoPath, 'Dockerfile');

  try {
    await fs.access(dockerfilePath);
  } catch {
    throw new Error('Dockerfile not found in repository');
  }

  console.log('\n🐳 Deploying with Docker...');

  return new Promise((resolve) => {
    const buildProc = spawn('docker', ['build', '-t', 'app:latest', '.'], {
      cwd: repoPath,
      shell: true,
      timeout: 600000 // 10 minute timeout
    });

    let output = '';

    buildProc.stdout.on('data', (data) => {
      output += data.toString();
      process.stdout.write(data);
    });

    buildProc.stderr.on('data', (data) => {
      output += data.toString();
      process.stderr.write(data);
    });

    buildProc.on('close', (code) => {
      if (code === 0) {
        console.log('✓ Docker build successful');
        resolve({
          success: true,
          message: 'Docker image built successfully. Ready to push or run.'
        });
      } else {
        console.log('✗ Docker build failed');
        resolve({
          success: false,
          message: `Docker build failed with code ${code}`
        });
      }
    });

    buildProc.on('error', (error) => {
      resolve({
        success: false,
        message: `Docker build error: ${error.message}`
      });
    });
  });
}

/**
 * Detect which deployment method should be used
 * @param {string} repoPath - Path to repository
 * @returns {Promise<string>} - 'vercel' | 'github-pages' | 'docker' | 'none'
 */
async function detectDeploymentMethod(repoPath) {
  const fs = require('fs').promises;
  const path = require('path');

  // Check for Next.js (Vercel ideal)
  try {
    const packageJson = JSON.parse(
      await fs.readFile(path.join(repoPath, 'package.json'), 'utf-8')
    );
    if (packageJson.dependencies?.next || packageJson.devDependencies?.next) {
      if (VERCEL_API_TOKEN && VERCEL_PROJECT_ID) {
        return 'vercel';
      }
    }
  } catch {
    // Continue
  }

  // Check for Dockerfile
  try {
    await fs.access(path.join(repoPath, 'Dockerfile'));
    return 'docker';
  } catch {
    // Continue
  }

  // Check for GitHub Pages config
  try {
    await fs.access(path.join(repoPath, '.github'));
    return 'github-pages';
  } catch {
    // Continue
  }

  return 'none';
}

module.exports = {
  deployWithVercel,
  checkDeploymentStatus,
  deployGitHubPages,
  deployDocker,
  detectDeploymentMethod
};
