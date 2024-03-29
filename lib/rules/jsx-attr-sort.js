/**
 * @fileoverview JSX Attributes를 정렬합니다.
 * @author sotaneum
 */
"use strict";

const {
  objectCompareMap,
  sort,
  toKey,
  useCompare,
  checkPunctuator,
  useCheckFunction,
  useReplaceByNodes,
  useHasGroupComment,
} = require("../utils");

const {
  DEFAULT_JSX_SORTED_ORDER,
  DEFAULT_FUNCTION_KEY_NAMES,
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
      url: "https://github.com/Sotaneum/eslint-plugin-hardsort/blob/main/docs/rules/jsx-attr-sort.md",
      description: "JSX Attributes를 정렬합니다.",
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
              enum: Object.keys(objectCompareMap),
              type: "string",
            },
            default: DEFAULT_JSX_SORTED_ORDER,
            uniqueItems: true,
          },
          functionKeyNames: {
            type: "array",
            items: { type: "string" },
            default: DEFAULT_FUNCTION_KEY_NAMES,
          },
          ignoreEnterGroup: { type: "boolean", default: true },
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
    messages: { default: "jsx attributes 를 정렬합니다." },
  },

  create({ report, options, sourceCode }) {
    const rawSourceText = sourceCode.getText();

    const compare = useCompare(options[0], {
      compareMap: objectCompareMap,
      defaultSortedOrders: DEFAULT_JSX_SORTED_ORDER,
    });
    const checkFunction = useCheckFunction(options[0]);
    const replaceByNodes = useReplaceByNodes(rawSourceText, true);
    const hasGroupComment = useHasGroupComment(sourceCode, options[0], true);

    const groups = {};
    const data = {};

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    function toComparePoint(node, isFirst = false) {
      const name = sourceCode.getText(
        node.type === "JSXSpreadAttribute" ? node.argument : node.name
      );

      const firstPrevNode = sourceCode.getTokenBefore(node, {
        filter: (token) => checkPunctuator(token),
      });

      const prevNode = sourceCode.getTokenBefore(node, {
        filter: (token) => checkPunctuator(token, true),
      });

      const prevNextNode = sourceCode.getTokenAfter(prevNode, {
        includeComments: !hasGroupComment(node),
      });

      return {
        name,
        node,
        text: rawSourceText.slice(prevNextNode.range[0], node.range[1]),
        isShort: !node.value,
        fullText: rawSourceText.slice(
          isFirst ? firstPrevNode.range[0] : prevNode.range[1],
          node.range[1]
        ),
        nextNode: node,
        isFunction: checkFunction(name, node.value),
      };
    }

    function updateSourceText(node) {
      const key = toKey(node);

      if (data[key]?.length > 0) {
        groups[key].push(data[key].slice());
      }

      const oriGroups = groups[key]
        .filter((group) => group.length > 0)
        .map((group, groupsIdx) =>
          group.map((node, groupIdx) =>
            toComparePoint(node, groupsIdx === 0 && groupIdx === 0)
          )
        );

      const oriNodes = oriGroups.flat();
      const sortedNodes = sort(oriGroups, compare);

      const nextSourceText = replaceByNodes({
        oriNodes,
        sortedNodes,
        range: node.range,
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
      JSXAttribute(node) {
        if (hasGroupComment(node)) {
          return addGroup(node);
        }

        const key = toKey(node.parent);
        if (data[key]) {
          data[key].push(node);
        }
      },
      JSXOpeningElement(node) {
        addNode(node);
      },
      JSXSpreadAttribute(node) {
        addGroup(node, true);
      },
      JSXSelfClosingElement(node) {
        addNode(node);
      },
      "JSXOpeningElement:exit"(node) {
        updateSourceText(node);
      },
      "JSXSelfClosingElement:exit"(node) {
        updateSourceText(node);
      },
    };
  },
};
