// https://eslint.org/docs/user-guide/configuring

module.exports = {
     root: true,
     parserOptions: {
          parser: 'babel-eslint'
     },
     env: {
          browser: true
     },
     extends: [
          'plugin:vue/essential',
          'standard'
     ],
     plugins: ['vue'],
     rules: {
         'indent': ['warn', 4],
         'eqeqeq': 'off',
         'curly': 'off',
         'no-extend-native': 'off',
         'no-multiple-empty-lines': 'off',
          'generator-star-spacing': 'off',
          // allow debugger during development
          'no-debugger': process.env.NODE_ENV === 'production'
               ? 'error'
               : 'off'
     }
}
