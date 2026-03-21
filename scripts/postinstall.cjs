// postinstall.cjs — force-install platform-specific packages
// npm's optionalDependencies bug (cli#4828) causes these to not install
// on some platforms. This script ensures they're present.
const { execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

const platform = os.platform();
const arch = os.arch();

// Map platform+arch to the packages we need
const platformPackages = {
  darwin: ['@esbuild/darwin-arm64', '@rollup/rollup-darwin-arm64', '@tailwindcss/oxide-darwin-arm64', 'lightningcss-darwin-arm64'],
  linux: ['@esbuild/linux-x64', '@rollup/rollup-linux-x64-gnu', '@tailwindcss/oxide-linux-x64-gnu', 'lightningcss-linux-x64-gnu'],
};

const packages = platformPackages[platform];
if (!packages) {
  console.log(`[postinstall] Unknown platform ${platform}, skipping`);
  process.exit(0);
}

// Check which ones are missing
const missing = packages.filter(pkg => {
  try {
    const dir = path.join(process.cwd(), 'node_modules', pkg);
    if (!fs.existsSync(dir)) return true;
    // Also check package.json exists inside
    if (!fs.existsSync(path.join(dir, 'package.json'))) return true;
    return false;
  } catch {
    return true;
  }
});

if (missing.length === 0) {
  process.exit(0);
}

console.log(`[postinstall] Installing missing platform packages: ${missing.join(', ')}`);

try {
  // --ignore-scripts prevents recursion (npm won't run postinstall of child packages)
  // --no-save prevents modifying package.json
  execSync(`npm install --no-save --ignore-scripts ${missing.join(' ')}`, {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
  console.log('[postinstall] Done');
} catch (err) {
  console.warn('[postinstall] Failed to install platform packages, build may not work:', err.message);
  // Don't fail the install — these are optional
}
