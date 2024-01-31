/**
 * @fileoverview jsx attributes 를 정렬합니다.
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
      url: "https://github.com/Sotaneum/eslint-plugin-hardsort/blob/main/docs/rules/jsx-attr-sort.md",
      description: "jsx attributes 를 정렬합니다.",
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
    messages: { default: "jsx attributes 를 정렬합니다." },
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
      if (a.isShort && !b.isShort) return -1;
      if (!a.isShort && b.isShort) return 1;
      if (a.name.length !== b.name.length) return a.name.length - b.name.length;

      return a.name?.localeCompare(b.name) ?? 0;
    }

    function isPunctuator(node) {
      return ["Punctuator", "JSXIdentifier"].includes(node.type);
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    function getFullText({ node, isGroupComment }, isFirst = false) {
      const firstPrevNode = sourceCode.getTokenBefore(node, {
        filter: (target) => target.type === "Punctuator",
      });

      const prevNode = sourceCode.getTokenBefore(node, {
        filter: isPunctuator,
      });

      const prevNextNode = sourceCode.getTokenAfter(prevNode, {
        includeComments: !isGroupComment,
      });

      return {
        text: sourceText.slice(prevNextNode.range[0], node.range[1]),
        fullText: sourceText.slice(
          isFirst ? firstPrevNode.range[0] : prevNode.range[1],
          node.range[1]
        ),
      };
    }

    function hasGroupComment(node) {
      if (ignoreCommentGroup) {
        return false;
      }

      const prev = sourceCode.getTokenBefore(node, { filter: isPunctuator });

      if (
        sourceCode.getTokenBefore(prev).value === "<" &&
        sourceCode.commentsExistBetween(prev, node) &&
        sourceCode.getCommentsBefore(node)[0].type === "Line"
      ) {
        return true;
      }

      return /^\n *\n/.test(sourceText.slice(prev.range[1], node.range[0]));
    }

    function toComparePoint(node) {
      const { type, value } = node;
      const name = sourceCode.getText(
        type === "JSXSpreadAttribute" ? node.argument : node.name
      );

      return {
        name,
        node,
        isFunc:
          functionValueTypes.includes(value?.type) ||
          functionKeyNames.includes(name) ||
          functionKeyNamePatterns.some((pattern) =>
            new RegExp(pattern).test(name)
          ),
        isShort: !value,
        isGroupComment: hasGroupComment(node),
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
        const ori = getFullText(targetFlat[idx], idx === 0);
        const target = getFullText(targetItem);

        const lastText =
          idx < sortedGroupsFlat.length - 1
            ? ""
            : sourceCode
                .getText()
                .slice(targetFlat[idx].node.range[1], node.range[1]);

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
      JSXAttribute(node) {
        if (hasGroupComment(node)) {
          return addGroup(node);
        }
        const key = toKey(node.parent);
        if (data[key]) {
          data[key].push(node);
        }
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
        isOrders(node);
      },
      "JSXSelfClosingElement:exit"(node) {
        isOrders(node);
      },
    };
  },
};
