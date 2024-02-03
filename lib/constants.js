const DEFAULT_OBJECT_SORTED_ORDER = [
  "isFunctionAsc",
  "isShortAsc",
  "keyNameLengthAsc",
  "localeCompareAsc",
];

const DEFAULT_JSX_SORTED_ORDER = [
  "isShortAsc",
  "isFunctionAsc",
  "keyNameLengthAsc",
  "localeCompareAsc",
];

const DEFAULT_FUNCTION_KEY_NAMES = ["select", "next"];
const DEFAULT_FUNCTION_VALUE_TYPES = [
  "AsyncFunction",
  "MethodDefinition",
  "GeneratorFunction",
  "FunctionExpression",
  "ArrowFunctionExpression",
];
const DEFAULT_FUNCTION_KEY_NAME_PATTERNS = ["^on", "^callback"];

module.exports = {
  DEFAULT_JSX_SORTED_ORDER,
  DEFAULT_FUNCTION_KEY_NAMES,
  DEFAULT_OBJECT_SORTED_ORDER,
  DEFAULT_FUNCTION_VALUE_TYPES,
  DEFAULT_FUNCTION_KEY_NAME_PATTERNS,
};
