// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

/** @descprition Find the project and workspace directories */
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

/** @type {import('@expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

/** @descprition Enable package exports so Metro respects package.json "exports" fields */
config.resolver.unstable_enablePackageExports = true;

/** @descprition Ensure Metro watches the monorepo root in addition to the defaults */
config.watchFolders = Array.from(
  new Set([...(config.watchFolders ?? []), monorepoRoot]),
);

/** @descprition Let Metro know where to resolve packages from while preserving defaults */
config.resolver.nodeModulesPaths = Array.from(
  new Set([
    ...(config.resolver?.nodeModulesPaths ?? []),
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(monorepoRoot, 'node_modules'),
  ]),
);

/** 
 * @descprition Ensure legacy asset hashing plugin is present so Expo CLI heuristics succeed
 * Implemented to fix the following issue
 * Issue:
 * -> It looks like that you are using a custom metro.config.js that does not extend @expo/metro-config.
 * -> This can result in unexpected and hard to debug issues, like missing assets in the production bundle.
 * -> We recommend you to abort, fix the metro.config.js, and try again.
 * -> Learn more on customizing Metro */
config.transformer.assetPlugins = Array.from(
  new Set([
    ...(config.transformer.assetPlugins ?? []),
    'expo-asset/tools/hashAssetFiles',
  ]),
);

module.exports = config;
