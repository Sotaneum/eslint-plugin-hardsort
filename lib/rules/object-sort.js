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
          sortedOrder: {
            type: "array",
            items: {
              enum: compareKeys,
              type: "string",
            },
            default: [
              "isFunctionAsc",
              "isShortAsc",
              "keyNameLengthAsc",
              "localeCompareAsc",
            ],
            uniqueItems: true,
          },
          functionKeyNames: {
            type: "array",
            items: { type: "string" },
            default: ["select", "next"],
          },
          functionValueTypes: {
            type: "array",
            items: { type: "string" },
            default: [
              "AsyncFunction",
              "MethodDefinition",
              "GeneratorFunction",
              "FunctionExpression",
              "ArrowFunctionExpression",
            ],
          },
          ignoreCommentGroup: { type: "boolean", default: false },
          functionKeyNamePatterns: {
            type: "array",
            items: { type: "string" },
            default: ["^on", "^callback"],
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
        // 검증에 사용합니다.
        node,

        // 정렬에 사용합니다.
        name,
        isShort: name === node?.value?.name,
        isFunction: checkFunction(name, node?.value),

        // 정렬될 텍스트 구성에 사용합니다.
        nextNode,
        text: rawSourceText.slice(prevNextNode.range[0], nextPrevNode.range[1]),
        fullText: rawSourceText.slice(prevNode.range[0], nextNode.range[0]),
      };
    }

    function updateSourceText(node) {
      const key = toKey(node);
      // 정렬된 데이터를 기반으로 소스를 변경합니다.

      const oriGroups = groups[key]
        .map((group) => group.map(toComparePoint))
        .concat([data[key].slice().map(toComparePoint)]);

      const oriNodes = oriGroups.flat();
      const sortedNodes = sort(oriGroups, compare);
      // 정렬전과 후가 같으면 정렬을 하지 않습니다.

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
