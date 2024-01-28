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
    "plugins": [
        "hardsort"
    ]
}
```

Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "hardsort/rule-name": 2
    }
}
```

## Rules

<!-- begin auto-generated rules list -->

🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                     | Description                                                                                       | 🔧 |
| :--------------------------------------- | :------------------------------------------------------------------------------------------------ | :- |
| [object-sort](docs/rules/object-sort.md) | Sorts object properties by variables and functions, abbreviation, length, and alphabetical order. | 🔧 |

<!-- end auto-generated rules list -->
