module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-case': [2, 'always', ['lower-case', 'upper-case']],
    'header-max-length': [2, 'always', 100],
  },
};
