const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Ensure compatibility with web
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add alias resolution for @/ imports
config.resolver.alias = {
  '@': path.resolve(__dirname, './'),
};

// Reset cache on start
config.resetCache = true;

module.exports = config;