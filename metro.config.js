const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Ensure compatibility with web
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add alias resolution for @/ imports
config.resolver.alias = {
  '@': path.resolve(__dirname, './'),
};

// Fix SVG constructor error on web by using web-specific build
config.resolver.extraNodeModules = {
  'react-native-svg': path.resolve(__dirname, 'node_modules/react-native-svg/lib/module/ReactNativeSVG.web.js'),
};

// Reset cache on start
config.resetCache = true;

module.exports = config;