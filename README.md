# eslint-plugin-hardsort

Sorting is attempted under limited conditions.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-hardsort`:

```sh
npm install eslint-plugin-hardsort --save-dev
```

## Usage

Add `hardsort` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["hardsort"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "hardsort/object-sort": [
      "error",
      {
        "sortedOrders": ["keyNameLengthAsc"],
        "functionKeyNames": ["select"],
        "ignoreEnterGroup": false,
        "functionValueTypes": [
          "AsyncFunction",
          "MethodDefinition",
          "GeneratorFunction",
          "FunctionExpression",
          "ArrowFunctionExpression"
        ],
        "functionKeyNamePatterns": ["^on", "^callback"]
      }
    ],
    "hardsort/jsx-attr-sort": [
      "error",
      {
        "sortedOrders": ["keyNameLengthAsc"],
        "functionKeyNames": ["select"],
        "ignoreEnterGroup": true,
        "functionValueTypes": [
          "AsyncFunction",
          "MethodDefinition",
          "GeneratorFunction",
          "FunctionExpression",
          "ArrowFunctionExpression"
        ],
        "functionKeyNamePatterns": ["^on", "^callback"]
      }
    ],
    "hardsort/import-grouping": [
      "error",
      [
        {
          "id": "components",
          "pathPatterns": ["^.*/components(/.*)?"]
        },
        {
          "id": "pages",
          "pathPatterns": ["^.*/pages(/.*)?"]
        },
        {
          "id": "default",
          "sortedOrders": ["aliasAsc"]
        }
      ],
      {
        "alias": {
          "@": "src"
        },
        "orders": ["default", "pages", "components"]
      }
    ]
  }
}
```

## Rules

<!-- begin auto-generated rules list -->

🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                             | Description                     | 🔧  |
| :----------------------------------------------- | :------------------------------ | :-- |
| [import-grouping](docs/rules/import-grouping.md) | import를 그룹화하여 정리합니다. | 🔧  |
| [jsx-attr-sort](docs/rules/jsx-attr-sort.md)     | JSX Attributes를 정렬합니다.    | 🔧  |
| [object-sort](docs/rules/object-sort.md)         | Object를 정렬합니다.            | 🔧  |

<!-- end auto-generated rules list -->
