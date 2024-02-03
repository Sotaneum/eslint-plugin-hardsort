/**
 * @fileoverview Sorts object properties by variables and functions, abbreviation, length, and alphabetical order.
 * @author sotaneum
 */
"use strict";

const {
  sort,
  toKey,
  useCompare,
  compareKeys,
  checkPunctuator,
  useCheckFunction,
  useReplaceByNodes,
  useHasGroupComment,
} = require("../utils");

const {
  DEFAULT_FUNCTION_KEY_NAMES,
  DEFAULT_OBJECT_SORTED_ORDER,
  DEFAULT_FUNCTION_VALUE_TYPES,
  DEFAULT_FUNCTION_KEY_NAME_PATTERNS,
} = require("../constants");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    docs: {
      url: "https://github.com/Sotaneum/eslint-plugin-hardsort/blob/main/docs/rules/object-sort.md",
      description:
        "Sorts object properties by variables and functions, abbreviation, length, and alphabetical order.",
      recommended: true,
    },
    type: "suggestion",
    schema: [
      {
        type: "object",
        properties: {
          sortedOrders: {
            type: "array",
            items: {
              enum: compareKeys,
              type: "string",
            },
            default: DEFAULT_OBJECT_SORTED_ORDER,
            uniqueItems: true,
          },
          functionKeyNames: {
            type: "array",
            items: { type: "string" },
            default: DEFAULT_FUNCTION_KEY_NAMES,
          },
          ignoreEnterGroup: { type: "boolean", default: false },
          functionValueTypes: {
            type: "array",
            items: { type: "string" },
            default: DEFAULT_FUNCTION_VALUE_TYPES,
          },
          functionKeyNamePatterns: {
            type: "array",
            items: { type: "string" },
            default: DEFAULT_FUNCTION_KEY_NAME_PATTERNS,
          },
        },
        additionalProperties: false,
      },
    ],
    fixable: "code",
    messages: {
      default:
        "Sorts object properties by variables and functions, abbreviation, length, and alphabetical order",
    },
  },

  create({ report, options, sourceCode }) {
    const rawSourceText = sourceCode.getText();

    const compare = useCompare(options[0]);
    const checkFunction = useCheckFunction(options[0]);
    const replaceByNodes = useReplaceByNodes(rawSourceText);
    const hasGroupComment = useHasGroupComment(sourceCode, options[0]);

    const groups = {};
    const data = {};

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    function toComparePoint(node) {
      const name = sourceCode.getText(node.key);

      const prevNode = sourceCode.getTokenBefore(node, {
        filter: checkPunctuator,
      });
      const nextNode = sourceCode.getTokenAfter(node, {
        filter: checkPunctuator,
      });

      const prevNextNode = sourceCode.getTokenAfter(prevNode, {
        includeComments: !hasGroupComment(node),
      });
      const nextPrevNode = sourceCode.getTokenBefore(nextNode, {
        includeComments: true,
      });

      return {
        name,
        node,
        nextNode,
        text: rawSourceText.slice(prevNextNode.range[0], nextPrevNode.range[1]),
        isShort: name === node?.value?.name,
        fullText: rawSourceText.slice(prevNode.range[0], nextNode.range[0]),
        isFunction: checkFunction(name, node?.value),
      };
    }

    function updateSourceText(node) {
      const key = toKey(node);

      if (data[key]) {
        groups[key].push(data[key].slice());
      }

      const oriGroups = groups[key]
        .filter((group) => group.length > 0)
        .map((group) => group.map(toComparePoint));

      const oriNodes = oriGroups.flat();
      const sortedNodes = sort(oriGroups, compare);

      const nextSourceText = replaceByNodes({
        node,
        oriNodes,
        sortedNodes,
      });

      if (nextSourceText === "") {
        return;
      }

      report({
        node,
        messageId: "default",
        fix(fixer) {
          return fixer.replaceText(node, nextSourceText);
        },
      });
    }

    function addNode(node) {
      const key = toKey(node);
      data[key] = [];
      groups[key] = [];
    }

    function addGroup(node, isSelf = false) {
      const key = toKey(node.parent);
      if (!data[key]) {
        return;
      }
      if (isSelf) {
        groups[key].push(data[key].slice(), [node]);
        data[key] = [];
        return;
      }
      groups[key].push(data[key].slice());
      data[key] = [node];
    }

    return {
      Property(node) {
        if (hasGroupComment(node)) {
          return addGroup(node);
        }

        const key = toKey(node.parent);
        if (data[key]) {
          data[key].push(node);
        }
      },
      ObjectPattern(node) {
        addNode(node);
      },
      SpreadElement(node) {
        addGroup(node, true);
      },
      ObjectExpression(node) {
        addNode(node);
      },
      "ObjectPattern:exit"(node) {
        updateSourceText(node);
      },
      "ObjectExpression:exit"(node) {
        updateSourceText(node);
      },
    };
  },
};
