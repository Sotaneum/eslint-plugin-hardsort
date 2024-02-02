const DEFAULT_SORTED_ORDER = [
  "isFunctionAsc",
  "isShortAsc",
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

const COMPARE_MAP = {
  default: () => 0,
  isShortAsc: (a, b) => {
    return a.isShort && !b.isShort ? -1 : !a.isShort && b.isShort ? 1 : 0;
  },
  isShortDesc: (a, b) => {
    return a.isShort && !b.isShort ? 1 : !a.isShort && b.isShort ? -1 : 0;
  },
  isFunctionAsc: (a, b) => {
    return a.isFunction && !b.isFunction
      ? 1
      : !a.isFunction && b.isFunction
      ? -1
      : 0;
  },
  isFunctionDesc: (a, b) => {
    return a.isFunction && !b.isFunction
      ? -1
      : !a.isFunction && b.isFunction
      ? 1
      : 0;
  },
  keyNameLengthAsc: (a, b) => {
    return a.name.length === b.name.length ? 0 : a.name.length - b.name.length;
  },
  localeCompareAsc: (a, b) => a.name.localeCompare(b.name) ?? 0,
  keyNameLengthDesc: (a, b) => {
    return a.name.length === b.name.length ? 0 : b.name.length - a.name.length;
  },
  localeCompareDesc: (a, b) => b.name.localeCompare(a.name),
};

const toKey = (node) => node.range.join(", ");

const useCompare = ({ sortedOrder = DEFAULT_SORTED_ORDER } = {}) => {
  return (a, b) => {
    for (let i = 0; i < sortedOrder.length; i++) {
      const select = COMPARE_MAP[sortedOrder[i]] ?? COMPARE_MAP.default;
      const result = select(a, b);
      if (result !== 0) {
        return result > 0 ? 1 : -1;
      }
    }
    return 0;
  };
};

const sort = (groups, fn) => groups.map((group) => [...group].sort(fn)).flat();

const useReplaceByNodes =
  (rawSourceText) =>
  ({ node, oriNodes = [], sortedNodes = [] }) => {
    if (
      oriNodes.length == 0 ||
      sortedNodes.length === 0 ||
      sortedNodes.every((item, idx) => oriNodes[idx].node === item.node)
    ) {
      return "";
    }

    return sortedNodes.reduce((acc, sortedNode, idx) => {
      const postText =
        idx < sortedNodes.length - 1
          ? ""
          : rawSourceText.slice(oriNodes[idx].nextNode.range[0], node.range[1]);
      return (
        acc +
        oriNodes[idx].fullText.replace(oriNodes[idx].text, sortedNode.text) +
        postText
      );
    }, "");
  };

const useCheckFunction = ({
  functionKeyNames = DEFAULT_FUNCTION_KEY_NAMES,
  functionValueTypes = DEFAULT_FUNCTION_VALUE_TYPES,
  functionKeyNamePatterns = DEFAULT_FUNCTION_KEY_NAME_PATTERNS,
} = {}) => {
  return (name, value) => {
    if (
      functionValueTypes.includes(value?.type) ||
      (value?.type === "AssignmentPattern" &&
        functionValueTypes.includes(value?.right?.type))
    ) {
      return true;
    }
    if (functionKeyNames.includes(name)) {
      return true;
    }

    if (
      functionKeyNamePatterns.some((pattern) => new RegExp(pattern).test(name))
    ) {
      return true;
    }

    return false;
  };
};

const checkPunctuator = ({ type }) => type === "Punctuator";

const useHasGroupComment =
  (sourceCode, { ignoreCommentGroup = false } = {}) =>
  (node) => {
    if (ignoreCommentGroup) {
      return false;
    }

    const prev = sourceCode.getTokenBefore(node, { filter: checkPunctuator });

    if (
      prev.value === "{" &&
      sourceCode.commentsExistBetween(prev, node) &&
      sourceCode.getCommentsBefore(node)[0].type === "Line"
    ) {
      return true;
    }

    return /^\n *\n/.test(
      sourceCode.getText().slice(prev.range[1], node.range[0])
    );
  };

module.exports = {
  sort,
  toKey,
  useCompare,
  checkPunctuator,
  useCheckFunction,
  useReplaceByNodes,
  useHasGroupComment,
  compareKeys: Object.keys(COMPARE_MAP),
};