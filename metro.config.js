const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Ensure compatibility with web
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add alias resolution for @/ imports
config.resolver.alias = {
  '@': path.resolve(__dirname, './'),
};

// Improve SVG compatibility on web
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Enhanced SVG web compatibility
if (process.env.EXPO_PLATFORM === 'web') {
  config.resolver.alias = {
    ...config.resolver.alias,
    'react-native-svg': 'react-native-svg/lib/module/ReactNativeSVG.web.js',
  };
}

// Reset cache on start
config.resetCache = true;

module.exports = config;