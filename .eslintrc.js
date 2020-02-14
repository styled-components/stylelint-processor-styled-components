module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  env: {
    jest: true,
    node: true
  },
  rules: {
    'prettier/prettier': 1,

    // Repo preferences
    'class-methods-use-this': 0,
    'symbol-description': 0,
    'no-unused-vars': [2, { varsIgnorePattern: '^_+$' }],
    'import/no-extraneous-dependencies': 0,
    'no-confusing-arrow': 0,
    'no-else-return': 0,
    'no-prototype-builtins': 0
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
}
