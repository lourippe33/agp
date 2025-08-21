module.exports = {
  extends: ['expo', '@expo/eslint-config'],
  plugins: ['import'],
  rules: {
    'import/no-duplicates': 'error',
  },
};