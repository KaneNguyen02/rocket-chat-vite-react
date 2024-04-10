// module.exports = {
//   root: true,
//   env: { browser: true, es2020: true },
//   extends: [
//     'eslint:recommended',
//     'plugin:@typescript-eslint/recommended',
//     'plugin:react-hooks/recommended',
//   ],
//   ignorePatterns: ['dist', '.eslintrc.cjs'],
//   parser: '@typescript-eslint/parser',
//   plugins: ['react-refresh'],
//   rules: {
//     'react-refresh/only-export-components': [
//       'warn',
//       { allowConstantExport: true },
//     ],
//   },
// }


module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "eslint-config-prettier",
    "prettier",
    "plugin:storybook/recommended",
    "plugin:react-hooks/recommended"
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'prettier', "react-hooks", "unused-imports", "simple-import-sort"],
  rules: {
    'react-refresh/only-export-components': [
      'off',
      { allowConstantExport: true },
    ],
    'prettier/prettier': [
      'warn',
      {
        arrowParens: 'always',
        semi: false,
        trailingComma: 'none',
        tabWidth: 2,
        endOfLine: 'auto',
        useTabs: false,
        singleQuote: true,
        printWidth: 120,
        jsxSingleQuote: true
      }
    ],
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "off",
      {
        "vars": "all",
        "varsIgnorePattern": "^_",
        "args": "after-used",
        "argsIgnorePattern": "^_"
      }
    ],
    "simple-import-sort/imports": [
      "error",
      {
        "groups": [
          // Packages `react` related packages come first.
          [
            "^react",
            "^@?\\w"
          ],
          // Internal packages.
          [
            "^(@|components)(/.*|$)"
          ],
          // Side effect imports.
          [
            "^\\u0000"
          ],
          // Parent imports. Put `..` last.
          [
            "^\\.\\.(?!/?$)",
            "^\\.\\./?$"
          ],
          // Other relative imports. Put same-folder imports and `.` last.
          [
            "^\\./(?=.*/)(?!/?$)",
            "^\\.(?!/?$)",
            "^\\./?$"
          ],
          // Style imports.
          [
            "^.+\\.?(css)$"
          ]
        ]
      }
    ],
    // "sort-imports": [
    //   "error",
    //   {
    //     "ignoreDeclarationSort": true
    //   }
    // ],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    // disallow use of eval()-like methods
    "no-implied-eval": "error",
    // disallow use of eval()
    "no-eval": "error",
    "react/no-inline-styles": 0,
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-empty-function": "off",
    "no-async-promise-executor": "off",
    "react/no-multi-comp": "off",
    "no-useless-escape": "off",
    "no-prototype-builtins": "off"
  },
}