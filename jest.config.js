module.exports = {
  preset: 'react-native',
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-clone-referenced-element|@expo|expo(nent)?|expo-modules-core|@expo/vector-icons|@react-navigation|react-native-svg)/)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};