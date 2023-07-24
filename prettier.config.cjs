module.exports = {
  endOfLine: 'lf',
  printWidth: 80,
  tabWidth: 2,
  trailingComma: 'es5',
  singleQuote: true,
  jsxSingleQuote: true,
  semi: true,
  importOrder: [
    '^@/repositories/(.*)$',
    '^@/interfaces/(.*)$',
    '^@/errors/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
