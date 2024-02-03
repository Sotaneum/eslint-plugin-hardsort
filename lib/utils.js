const {
  DEFAULT_JSX_SORTED_ORDER,
  DEFAULT_FUNCTION_KEY_NAMES,
  DEFAULT_OBJECT_SORTED_ORDER,
  DEFAULT_FUNCTION_VALUE_TYPES,
  DEFAULT_FUNCTION_KEY_NAME_PATTERNS,
} = require("./constants");

const compareMap = {
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

const useCompare = ({ sortedOrders } = {}, jsx = false) => {
  const orders =
    sortedOrders ?? jsx
      ? DEFAULT_JSX_SORTED_ORDER
      : DEFAULT_OBJECT_SORTED_ORDER;
  return (a, b) => {
    for (let i = 0; i < orders.length; i++) {
      const select = compareMap[orders[i]] ?? compareMap.default;
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
  (rawSourceText, jsx = false) =>
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
          : rawSourceText.slice(
              oriNodes[idx].nextNode.range[jsx ? 1 : 0],
              node.range[1]
            );
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

const checkPunctuator = ({ type }, jsx = false) =>
  jsx
    ? ["Punctuator", "JSXIdentifier", "JSXText", "String"].includes(type)
    : type === "Punctuator";

const useHasGroupComment = (
  sourceCode,
  { ignoreEnterGroup } = {},
  jsx = false
) => {
  const ignoreGroup = ignoreEnterGroup ?? jsx;
  return (node) => {
    if (ignoreGroup) {
      return false;
    }

    const prev = sourceCode.getTokenBefore(node, {
      filter: (node) => checkPunctuator(node, jsx),
    });

    if (
      (jsx
        ? sourceCode.getTokenBefore(prev).value === "<"
        : prev.value === "{") &&
      sourceCode.commentsExistBetween(prev, node) &&
      sourceCode.getCommentsBefore(node)[0].type === "Line"
    ) {
      return true;
    }

    return /^\n *\n/.test(
      sourceCode.getText().slice(prev.range[1], node.range[0])
    );
  };
};

module.exports = {
  sort,
  toKey,
  useCompare,
  checkPunctuator,
  useCheckFunction,
  useReplaceByNodes,
  useHasGroupComment,
  compareKeys: Object.keys(compareMap),
};
