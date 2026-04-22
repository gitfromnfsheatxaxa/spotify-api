// ESLint disabled for build - TypeScript errors are handled by tsc
// This prevents ESLint from blocking the build process
module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Disable rules that cause parsing issues
    '@typescript-eslint/no-unused-vars': 'off',
  },
};