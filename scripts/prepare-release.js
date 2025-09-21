#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

/**
 * Enhanced Release Preparation Script with Changesets Integration
 *
 * This script enhances Changesets workflow by:
 * 1. Removing @repo/ dependencies completely during release
 * 2. Preserving Changesets-managed internal dependencies (DO NOT override!)
 * 3. Respecting Changesets dependency updates for proper version resolution
 * 4. Supporting both development (workspace:*) and release modes
 */

const PUBLISHABLE_PACKAGES = [
  {
    name: '@snapkit-studio/core',
    directory: 'packages/core'
  },
  {
    name: '@snapkit-studio/react',
    directory: 'packages/react'
  },
  {
    name: '@snapkit-studio/nextjs',
    directory: 'packages/nextjs'
  }
];

// Removed workspace dependency mapping functions - Changesets handles this!

/**
 * Read package.json from a directory
 */
function readPackageJson(packageDir) {
  const packagePath = path.join(packageDir, 'package.json');
  const packageContent = fs.readFileSync(packagePath, 'utf8');
  return JSON.parse(packageContent);
}

/**
 * Write package.json to a directory
 */
function writePackageJson(packageDir, packageData, suffix = '') {
  const fileName = suffix ? `package${suffix}.json` : 'package.json';
  const packagePath = path.join(packageDir, fileName);
  fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2) + '\n');
  console.log(`✅ Created ${packagePath}`);
}

/**
 * Remove @repo/ dependencies from dependency object
 */
function removeRepoDependencies(deps) {
  if (!deps) return deps;

  const cleaned = { ...deps };
  let removedCount = 0;

  Object.keys(cleaned).forEach(dep => {
    if (dep.startsWith('@repo/')) {
      delete cleaned[dep];
      removedCount++;
      console.log(`   🗑️  Removed @repo/ dependency: ${dep}`);
    }
  });

  return removedCount > 0 ? cleaned : deps;
}

// Removed workspace transformation - Changesets handles internal dependencies!

/**
 * Transform package for release - ONLY removes @repo/ dependencies
 * Changesets handles all internal dependency updates correctly!
 */
function transformPackageForRelease(packageData, packageInfo) {
  const transformed = { ...packageData };

  console.log(`\n🔄 Preparing ${packageInfo.name} for release...`);
  console.log(`   ℹ️  Changesets has already updated internal dependencies correctly`);

  // ONLY remove @repo/ dependencies - preserve everything else!
  transformed.dependencies = removeRepoDependencies(transformed.dependencies);
  transformed.devDependencies = removeRepoDependencies(transformed.devDependencies);
  transformed.peerDependencies = removeRepoDependencies(transformed.peerDependencies);

  // Clean up empty dependency objects
  if (transformed.dependencies && Object.keys(transformed.dependencies).length === 0) {
    delete transformed.dependencies;
  }
  if (transformed.devDependencies && Object.keys(transformed.devDependencies).length === 0) {
    delete transformed.devDependencies;
  }
  if (transformed.peerDependencies && Object.keys(transformed.peerDependencies).length === 0) {
    delete transformed.peerDependencies;
  }

  return transformed;
}

/**
 * Main function to prepare all packages for release
 */
async function prepareRelease() {
  console.log('🚀 Preparing packages for release...\n');
  console.log('📋 Changesets has already handled internal dependency updates');
  console.log('📋 We only need to remove @repo/ dependencies\n');

  // Process each publishable package
  PUBLISHABLE_PACKAGES.forEach(packageInfo => {
    try {
      // Read original package.json
      const originalPackage = readPackageJson(packageInfo.directory);

      // Transform for release (only remove @repo/ deps)
      const releasePackage = transformPackageForRelease(originalPackage, packageInfo);

      // Write release package.json
      writePackageJson(packageInfo.directory, releasePackage, '.release');

    } catch (error) {
      console.error(`❌ Error processing ${packageInfo.name}:`, error.message);
      process.exit(1);
    }
  });

  console.log('\n✅ All release packages prepared successfully!');
  console.log('\n📋 Release-ready files created:');
  PUBLISHABLE_PACKAGES.forEach(pkg => {
    console.log(`   - ${pkg.directory}/package.release.json`);
  });

  console.log('\n📋 Next steps:');
  console.log('1. Review the .release.json files');
  console.log('2. Test builds with release configurations');
  console.log('3. When ready, copy .release.json to package.json and publish');
  console.log('4. Restore original package.json files after publishing');
}

/**
 * Restore original package.json files (cleanup after release)
 */
function restoreOriginalPackages() {
  console.log('🔄 Restoring original package.json files...\n');

  PUBLISHABLE_PACKAGES.forEach(packageInfo => {
    const releaseFile = path.join(packageInfo.directory, 'package.release.json');

    // Remove release file if it exists
    if (fs.existsSync(releaseFile)) {
      fs.unlinkSync(releaseFile);
      console.log(`🗑️  Removed ${releaseFile}`);
    }
  });

  console.log('\n✅ Cleanup completed!');
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];

  switch (command) {
    case 'prepare':
    case undefined:
      prepareRelease().catch(error => {
        console.error('❌ Release preparation failed:', error.message);
        process.exit(1);
      });
      break;
    case 'cleanup':
      restoreOriginalPackages();
      break;
    case 'help':
      console.log('Enhanced Release Preparation Script with Changesets Integration');
      console.log('');
      console.log('Usage:');
      console.log('  node scripts/prepare-release.js [command]');
      console.log('');
      console.log('Commands:');
      console.log('  prepare   Prepare packages for release (default)');
      console.log('            - Removes @repo/ dependencies only');
      console.log('            - Preserves Changesets internal dependency updates');
      console.log('            - Creates .release.json files for safe publishing');
      console.log('  cleanup   Remove .release.json files');
      console.log('  help      Show this help message');
      console.log('');
      console.log('Integration with Changesets:');
      console.log('  1. Use "changeset version" to update versions and internal deps');
      console.log('  2. Run this script to clean @repo/ dependencies only');
      console.log('  3. Use "changeset publish" for dependency-ordered deployment');
      break;
    default:
      console.error(`Unknown command: ${command}`);
      console.error('Run "node scripts/prepare-release.js help" for usage information');
      process.exit(1);
  }
}

module.exports = {
  prepareRelease,
  restoreOriginalPackages,
  transformPackageForRelease,
  PUBLISHABLE_PACKAGES
};