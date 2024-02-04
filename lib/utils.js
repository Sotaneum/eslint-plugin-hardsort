const path = require("path");

const {
  DEFAULT_FUNCTION_KEY_NAMES,
  DEFAULT_FUNCTION_VALUE_TYPES,
  DEFAULT_FUNCTION_KEY_NAME_PATTERNS,
} = require("./constants");

const objectCompareMap = {
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

const aliasRegex = /^@.*/;

const importCompareMap = {
  aliasAsc: (a, b) => {
    const aIsAlias = !!aliasRegex.test(a.from);
    const bIsAlias = !!aliasRegex.test(b.from);
    if (aIsAlias === bIsAlias) {
      return 0;
    }
    return aIsAlias ? 1 : -1;
  },
  localAsc: (a, b) => {
    const aIsLocal = a.from.startsWith(".");
    const bIsLocal = b.from.startsWith(".");
    if (aIsLocal === bIsLocal) {
      return 0;
    }
    return aIsLocal ? 1 : -1;
  },
  aliasDesc: (a, b) => {
    const aIsAlias = !!aliasRegex.test(a.from);
    const bIsAlias = !!aliasRegex.test(b.from);
    if (aIsAlias === bIsAlias) {
      return 0;
    }
    return aIsAlias ? -1 : 1;
  },
  localDesc: (a, b) => {
    const aIsLocal = a.from.startsWith(".");
    const bIsLocal = b.from.startsWith(".");
    if (aIsLocal === bIsLocal) {
      return 0;
    }
    return aIsLocal ? -1 : 1;
  },
};

const toKey = (node) => node.range.join(", ");

const useCompare = (
  { sortedOrders } = {},
  { compareMap, defaultSortedOrders }
) => {
  const orders = sortedOrders ?? defaultSortedOrders;
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
  (rawSourceText, excludeNextNode = false) =>
  ({ range, oriNodes = [], sortedNodes = [] }) => {
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
              oriNodes[idx].nextNode.range[excludeNextNode ? 1 : 0],
              range[1]
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
    ? ["String", "JSXText", "JSXIdentifier", "Punctuator"].includes(type)
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

const useToAbsolutePath = (paths = []) => {
  return (fromPath) => {
    return /^\.\.?\/?.*/.test(fromPath)
      ? path.join(
          paths.slice(0, paths.length - fromPath.split("../").length).join("/"),
          fromPath
        )
      : fromPath;
  };
};

module.exports = {
  importCompareMap,
  objectCompareMap,
  sort,
  toKey,
  useCompare,
  checkPunctuator,
  useCheckFunction,
  useReplaceByNodes,
  useToAbsolutePath,
  useHasGroupComment,
};
