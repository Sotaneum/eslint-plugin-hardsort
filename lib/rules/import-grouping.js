/**
 * @fileoverview import를 그룹화하여 정리합니다.
 * @author sotaneum
 */
"use strict";

const {
  importCompareMap,
  useCompare,
  useToAbsolutePath,
  getChangeableRange,
} = require("../utils");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    docs: {
      url: "https://github.com/Sotaneum/eslint-plugin-hardsort/blob/main/docs/rules/import-grouping.md",
      description: "import를 그룹화하여 정리합니다.",
      recommended: true,
    },
    type: "suggestion",
    schema: [
      {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            pathPatterns: {
              type: "array",
              items: { type: "string" },
              uniqueItems: true,
            },
            sortedOrders: {
              type: "array",
              items: {
                enum: Object.keys(importCompareMap),
                type: "string",
              },
              default: ["aliasDesc"],
              uniqueItems: true,
            },
          },
          additionalProperties: false,
        },
      },
      {
        type: "object",
        properties: {
          alias: {
            type: "object",
          },
          orders: {
            type: "array",
            items: {
              type: "string",
            },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    fixable: "code",
    messages: {
      default: "import를 그룹화하여 정리해야합니다.",
    },
    dependsOn: ["import/first"],
  },

  create({ report, options, filename, sourceCode }) {
    const rawSourceText = sourceCode.getText();
    const paths = filename.split(/[\\/]/g);

    const toAbsolutePath = useToAbsolutePath(paths);

    const [groupOptions = [], sortOptions = {}] = options;
    const { alias = {}, orders = groupOptions.map(({ id }) => id) } =
      sortOptions;

    if (!orders.find((id) => id === "default")) {
      orders.unshift("default");
    }

    const groups = groupOptions.reduce(
      (acc, { id }) => ({ ...acc, [id]: [] }),
      { default: [] }
    );

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    function toComparePoint(node) {
      const from = node.source.value;

      const aliasPoint = Object.keys(alias).find(
        (key) => key === from || from.startsWith(key + "/")
      );
      const aliasPath = alias[aliasPoint];

      const prevNode = sourceCode.getTokenBefore(node);

      let start = prevNode?.range[1] ?? node.range[0];
      if (prevNode && sourceCode.commentsExistBetween(prevNode, node)) {
        start = sourceCode.getCommentsAfter(prevNode)[0].range[0];
      }

      const end = node.range[1];

      const text = rawSourceText.slice(start, end).replace(/^\n*/, "");

      return {
        from,
        node,
        text,
        isAlias: !!aliasPoint,
        fromPath: toAbsolutePath(
          aliasPoint ? from.replace(aliasPoint, aliasPath) : from
        ),
        nextNode: node,
        isRelative: from.startsWith("."),
      };
    }

    return {
      "Program:exit"() {
        const oriNodes = Object.values(groups).flat();
        const importRange = getChangeableRange(oriNodes);

        const sortedSourceText = orders
          .reduce((acc, id) => {
            if (!groups[id] || groups[id].length === 0) {
              return acc;
            }

            const option = groupOptions.find((option) => option.id === id);

            const compare = useCompare(option, {
              compareMap: importCompareMap,
              defaultSortedOrders: ["aliasDesc"],
            });

            return [
              ...acc,
              groups[id]
                .slice()
                .sort(compare)
                .map(({ text }) => text)
                .join("\n"),
            ];
          }, [])
          .join("\n\n");

        if (sortedSourceText === rawSourceText.slice(...importRange)) {
          return;
        }

        report({
          loc: {
            end: sourceCode.getLocFromIndex(importRange[1]),
            start: sourceCode.getLocFromIndex(importRange[0]),
          },
          messageId: "default",
          fix(fixer) {
            return fixer.replaceTextRange(importRange, sortedSourceText);
          },
        });
      },
      ImportDeclaration(node) {
        if (!groupOptions || groupOptions.length === 0) {
          return;
        }

        const item = toComparePoint(node);

        const targetGroup = groupOptions.find(({ pathPatterns = [] }) =>
          pathPatterns.some((pattern) =>
            new RegExp(pattern).test(item.fromPath)
          )
        );

        groups[targetGroup?.id ? targetGroup?.id : "default"].push(item);
      },
    };
  },
};
