// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 1,
    // allow async-await
    'generator-star-spacing': 1,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    //不能有声明后未被使用的变量或参数
    "no-unused-vars": [1, {"vars": "all", "args": "after-used"}],
    "camelcase": 1,
    'semi': 0,
    'indent': 1,
    'space-before-function-paren': 1,
    'comma-spacing': 1,
    'space-before-block': 0,
    'space-infix-ops': 1,
    'spaced-comment': 1,
    'keyword-spacing': 1,
    'no-unused-vars': 1,
    'quotes': 1,
    'semi-spacing': 1,
    'block-spacing': 1,
    'no-sequences': 1,
    'brace-style': 1,
    'eqeqeq': 1,
    'key-spacing':0
  }
}
