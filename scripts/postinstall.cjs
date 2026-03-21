// postinstall.cjs — force-install platform-specific packages
// npm's optionalDependencies bug (cli#4828) causes these to not install.
// Downloads tarballs directly from the registry, bypassing npm entirely.
const { execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');
const https = require('https');

const platform = os.platform();

const platformPackages = {
  darwin: [
    { name: '@esbuild/darwin-arm64', version: '0.27.4' },
    { name: '@rollup/rollup-darwin-arm64', version: '4.59.0' },
    { name: '@tailwindcss/oxide-darwin-arm64', version: '4.2.2' },
    { name: 'lightningcss-darwin-arm64', version: '1.32.0' },
  ],
  linux: [
    { name: '@esbuild/linux-x64', version: '0.27.4' },
    { name: '@rollup/rollup-linux-x64-gnu', version: '4.59.0' },
    { name: '@tailwindcss/oxide-linux-x64-gnu', version: '4.2.2' },
    { name: 'lightningcss-linux-x64-gnu', version: '1.32.0' },
  ],
};

const packages = platformPackages[platform];
if (!packages) {
  console.log(`[postinstall] Skipping — unknown platform ${platform}`);
  process.exit(0);
}

// Check which ones are missing
const missing = packages.filter(({ name }) => {
  const dir = path.join('node_modules', ...name.split('/'));
  return !fs.existsSync(path.join(dir, 'package.json'));
});

if (missing.length === 0) {
  process.exit(0);
}

console.log(`[postinstall] Installing missing: ${missing.map(p => p.name).join(', ')}`);

for (const { name, version } of missing) {
  const dir = path.join('node_modules', ...name.split('/'));
  try {
    console.log(`[postinstall] Installing ${name}@${version}...`);
    // Use npm install directly for the specific package (no recursion — no postinstall on root)
    execSync(`npm install --no-save --ignore-scripts ${name}@${version}`, {
      stdio: 'pipe',
      cwd: process.cwd(),
      timeout: 30000,
    });
    if (fs.existsSync(path.join(dir, 'package.json'))) {
      console.log(`[postinstall] ✓ ${name}`);
    } else {
      console.warn(`[postinstall] ✗ ${name} — installed but package.json missing`);
    }
  } catch (err) {
    console.warn(`[postinstall] ✗ ${name} — ${err.message?.split('\n')[0]}`);
  }
}
