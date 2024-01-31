/**
 * @fileoverview Sorts object properties by variables and functions, abbreviation, length, and alphabetical order.
 * @author sotaneum
 */
"use strict";

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
    const {
      functionKeyNames = ["select", "next"],
      functionValueTypes = [
        "AsyncFunction",
        "MethodDefinition",
        "GeneratorFunction",
        "FunctionExpression",
        "ArrowFunctionExpression",
      ],
      ignoreCommentGroup = false,
      functionKeyNamePatterns = ["^on", "^callback"],
    } = { ...options[0] };
    let sourceText = sourceCode.getText();

    const data = {};
    const groups = {};

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function toKey(node) {
      return node.range.join(", ");
    }

    function compare(a, b) {
      if (a.isFunc && !b.isFunc) return 1;
      if (!a.isFunc && b.isFunc) return -1;
      if (a.isAssignmentPattern && !b.isAssignmentPattern) return 1;
      if (!a.isAssignmentPattern && b.isAssignmentPattern) return -1;
      if (a.isShort && !b.isShort) return -1;
      if (!a.isShort && b.isShort) return 1;
      if (a.name.length !== b.name.length) return a.name.length - b.name.length;

      return a.name?.localeCompare(b.name) ?? 0;
    }

    function isPunctuator({ type }) {
      return type === "Punctuator";
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    function getFullText({ node, isGroupComment }) {
      const prevNode = sourceCode.getTokenBefore(node, {
        filter: isPunctuator,
      });
      const nextNode = sourceCode.getTokenAfter(node, { filter: isPunctuator });

      const prevNextNode = sourceCode.getTokenAfter(prevNode, {
        includeComments: !isGroupComment,
      });
      const nextPrevNode = sourceCode.getTokenBefore(nextNode, {
        includeComments: true,
      });

      return {
        nextNode,
        text: sourceText.slice(prevNextNode.range[0], nextPrevNode.range[1]),
        fullText: sourceText.slice(prevNode.range[0], nextNode.range[0]),
      };
    }

    function hasGroupComment(node) {
      if (ignoreCommentGroup) {
        return false;
      }

      const prev = sourceCode.getTokenBefore(node, { filter: isPunctuator });

      if (
        prev.value === "{" &&
        sourceCode.commentsExistBetween(prev, node) &&
        sourceCode.getCommentsBefore(node)[0].type === "Line"
      ) {
        return true;
      }

      return /^\n *\n/.test(sourceText.slice(prev.range[1], node.range[0]));
    }

    function toComparePoint(node) {
      const { key, value, shorthand } = node;
      const name = sourceCode.getText(key);

      return {
        name,
        node,
        isFunc:
          functionValueTypes.includes(value?.type) ||
          functionKeyNames.includes(name) ||
          functionKeyNamePatterns.some((pattern) =>
            new RegExp(pattern).test(name)
          ),
        isShort: shorthand,
        isGroupComment: hasGroupComment(node),
        isAssignmentPattern: value?.type === "AssignmentPattern",
      };
    }

    function isOrders(node) {
      const key = toKey(node);
      if (!groups[key]) {
        return;
      }
      const target = groups[key].map((group) => group.map(toComparePoint));

      if (data[key] && data[key].length > 0) {
        target.push(data[key].slice().map(toComparePoint));
      }

      const sortedGroups = target.map((group) => group.slice().sort(compare));

      const targetFlat = target.flat();
      const sortedGroupsFlat = sortedGroups.flat();

      delete groups[key];

      if (
        sortedGroupsFlat.every(
          (item, idx) => targetFlat[idx].node === item.node
        )
      ) {
        return null;
      }

      const nextText = sortedGroupsFlat.reduce((acc, targetItem, idx) => {
        const ori = getFullText(targetFlat[idx]);
        const target = getFullText(targetItem);

        const lastText =
          idx < sortedGroupsFlat.length - 1
            ? ""
            : sourceCode.getText().slice(ori.nextNode.range[0], node.range[1]);

        return acc + ori.fullText.replace(ori.text, target.text) + lastText;
      }, "");

      sourceText =
        sourceText.slice(0, node.range[0]) +
        nextText +
        sourceText.slice(node.range[1]);
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
      "Program:exit"(node) {
        if (sourceText === sourceCode.getText()) {
          return;
        }
        report({
          node,
          messageId: "default",
          fix(fixer) {
            return fixer.replaceText(node, sourceText);
          },
        });
      },
      ObjectExpression(node) {
        addNode(node);
      },
      "ObjectPattern:exit"(node) {
        isOrders(node);
      },
      "ObjectExpression:exit"(node) {
        isOrders(node);
      },
    };
  },
};
