module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y', 'prefer-arrow'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier'
  ],
  settings: { react: { version: 'detect' } },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'func-style': ['error', 'expression'],
    'prefer-arrow/prefer-arrow-functions': [
      'error',
      {
        disallowPrototype: true,
        singleReturnOnly: false,
        classPropertiesAllowed: false
      }
    ],
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function'
      }
    ],
    'react/no-unknown-property': [
      'error',
      {
        ignore: [
          'args',
          'attach',
          'renderOrder',
          'intensity',
          'position',
          'rotation',
          'transparent',
          'opacity',
          'blending',
          'depthWrite',
          'roughness',
          'metalness',
          'emissive',
          'emissiveIntensity',
          'clearcoat',
          'clearcoatRoughness'
        ]
      }
    ],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'jsx-a11y/anchor-is-valid': 'off'
  }
}
