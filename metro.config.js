const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
// Required by the existing Expo SQLite adapter's browser worker.
config.resolver.assetExts.push('wasm');
module.exports = config;
