/**
 * @fileoverview Sorts object properties by variables and functions, abbreviation, length, and alphabetical order.
 * @author sotaneum
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/object-sort"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: "latest" } });
ruleTester.run("object-sort", rule, {
  valid: [
    {
      code: "const foo = { title, bodyText, cancelText, submitText, bodyTextColor, subTitle: '', inlineFooter: false, onSubmit, onClose: () => {}, onCancel: () => {} };",
    },
    {
      code: `const foo = {};`,
    },
  ],
  invalid: [
    {
      code: `const foo = {
        [4 + 8 + 6 + 9]: () => {},
        [4 + 8 + 6]: () => {},
      };`,
      errors: 1,
      output: `const foo = {
        [4 + 8 + 6]: () => {},
        [4 + 8 + 6 + 9]: () => {},
      };`,
    },
    {
      code: `const foo = {
        ["4 + 8 + 6 + 9"]: () => {},
        ["4 + 8 + 6"]: () => {},
      };`,
      errors: 1,
      output: `const foo = {
        ["4 + 8 + 6"]: () => {},
        ["4 + 8 + 6 + 9"]: () => {},
      };`,
    },
    {
      code: `const foo = {
        "4 + 8 + 6 + 9": () => {},
        "4 + 8 + 6": () => {},
      };`,
      errors: 1,
      output: `const foo = {
        "4 + 8 + 6": () => {},
        "4 + 8 + 6 + 9": () => {},
      };`,
    },
    {
      code: `const foo = { onCancel: () => {}, title };`,
      errors: 1,
      output: `const foo = { title, onCancel: () => {} };`,
    },
    {
      code: `const foo = { context: '테스트', title };`,
      errors: 1,
      output: `const foo = { title, context: '테스트' };`,
    },
    {
      code: `const foo = { context: '테스트', title: '스타일 테스트' };`,
      errors: 1,
      output: `const foo = { title: '스타일 테스트', context: '테스트' };`,
    },
    {
      code: `const foo = { send: true, post: false };`,
      errors: 1,
      output: `const foo = { post: false, send: true };`,
    },
    {
      code: `const foo = { title, onCancel: () => {}, bodyText, subTitle: '', onClose: () => {}, cancelText, inlineFooter: false, submitText, bodyTextColor, onSubmit };`,
      errors: 1,
      output: `const foo = { title, bodyText, cancelText, submitText, bodyTextColor, subTitle: '', inlineFooter: false, onSubmit, onClose: () => {}, onCancel: () => {} };`,
    },
    {
      code: `const foo = {
        inlineFooter: false,
        context,
        subTitle: "",
        title,
        bodyTextColor,
        buttons: [
          {
            // 클릭임
            onClick1: () => {} /*
            이것도 클릭
            아닌가?
             */,
            onClose2,
            // 취소 버튼?,
            text3: "Cancel",
          },
          { onClose, text: "Submit", onClick: () => {} },
        ],
      };`,
      errors: 1,
      output: `const foo = {
        title,
        context,
        bodyTextColor,
        buttons: [
          {
            // 취소 버튼?,
            text3: "Cancel",
            onClose2,
            // 클릭임
            onClick1: () => {} /*
            이것도 클릭
            아닌가?
             */,
          },
          { text: "Submit", onClose, onClick: () => {} },
        ],
        subTitle: "",
        inlineFooter: false,
      };`,
    },
    {
      code: `const foo = [{ inlineFooter: false, context, subTitle: "", title, bodyTextColor, buttons: [ { onClick: () => {}, onClose, text: "Cancel" }, { onClose, text: "Submit", onClick: () => {} } ] }, { inlineFooter: false, context, subTitle: "", title, bodyTextColor, buttons: [ { onClick: () => {}, onClose, text: "Cancel" }, { onClose, text: "Submit", onClick: () => {} } ] }];`,
      errors: 1,
      output: `const foo = [{ title, context, bodyTextColor, buttons: [ { text: "Cancel", onClose, onClick: () => {} }, { text: "Submit", onClose, onClick: () => {} } ], subTitle: "", inlineFooter: false }, { title, context, bodyTextColor, buttons: [ { text: "Cancel", onClose, onClick: () => {} }, { text: "Submit", onClose, onClick: () => {} } ], subTitle: "", inlineFooter: false }];`,
    },
    {
      code: `foo({ onClose: ()=>{}, onSubmit, context, title });`,
      errors: 1,
      output: `foo({ title, context, onSubmit, onClose: ()=>{} });`,
    },
    {
      code: `const { context, title } = foo;`,
      errors: 1,
      output: `const { title, context } = foo;`,
    },
    {
      code: `const { title = "", context } = foo;`,
      errors: 1,
      output: `const { context, title = "" } = foo;`,
    },
    {
      code: `const [{ title = "", context }] = foo;`,
      errors: 1,
      output: `const [{ context, title = "" }] = foo;`,
    },
    {
      code: `const data = {
        onClose: () => {},
        onSubmit,
        // test
        authToken: 'a',
        // yo
        baseOfUrlToken,
        ...test,
        base,
        onCallback: () => {},
        onUpdate,
        [url2 + 2 + 4]: '',
        url: 'b' /*
          yes
        */,
      }`,
      errors: 1,
      output: `const data = {
        // yo
        baseOfUrlToken,
        // test
        authToken: 'a',
        onSubmit,
        onClose: () => {},
        ...test,
        base,
        url: 'b' /*
          yes
        */,
        [url2 + 2 + 4]: '',
        onUpdate,
        onCallback: () => {},
      }`,
    },
    {
      code: `const data = {
            authToken: 'a',
            url: 'b',
          }`,
      errors: 1,
      output: `const data = {
            url: 'b',
            authToken: 'a',
          }`,
    },
    {
      code: `const data = {
            authToken: 'a',
            url: 'b'
          }`,
      errors: 1,
      output: `const data = {
            url: 'b',
            authToken: 'a'
          }`,
    },
    {
      code: `const data = {
            c: 'c',
            // test
            b: 'b',
            a: 'a',
          }`,
      errors: 1,
      output: `const data = {
            a: 'a',
            // test
            b: 'b',
            c: 'c',
          }`,
    },
    {
      code: `const data = {
            c: 'c',

            // test
            b: 'b',
            a: 'a',
          }`,
      errors: 1,
      output: `const data = {
            c: 'c',

            // test
            a: 'a',
            b: 'b',
          }`,
    },
    {
      code: `const data = {
            c: 'c',

            /*
            test
            test1
            */
            b: 'b',
            a: 'a',
          }`,
      errors: 1,
      output: `const data = {
            c: 'c',

            /*
            test
            test1
            */
            a: 'a',
            b: 'b',
          }`,
    },
    {
      code: `const data = {
            c: 'c',

            // test
            b: 'b',
            a: 'a',
          }`,
      errors: 1,
      output: `const data = {
            a: 'a',

            // test
            b: 'b',
            c: 'c',
          }`,
      options: [
        {
          ignoreCommentGroup: true,
        },
      ],
    },
    {
      code: `const foo = {
        AAAAAA: '1',
        TTTTT: '2',
        WWWW_WWWWWWWW: '3',
        TTTTT_TTTT_TTTTTTTT: '4',
        SSSSSSSSS: '5',
        WWWW_WWWWWWWWW: '6',
        SSSSSSS_SSSSS_SSSSSSS: '7',

        /* 알파벳 */
        AAAAAA_AAAAAAA: '8',
      };`,
      errors: 1,
      output: `const foo = {
        TTTTT: '2',
        AAAAAA: '1',
        SSSSSSSSS: '5',
        WWWW_WWWWWWWW: '3',
        WWWW_WWWWWWWWW: '6',
        TTTTT_TTTT_TTTTTTTT: '4',
        SSSSSSS_SSSSS_SSSSSSS: '7',

        /* 알파벳 */
        AAAAAA_AAAAAAA: '8',
      };`,
    },
    {
      code: `const foo = {
        /* 알파벳 */
        AAAAAA_AAAAAAA: '8',
        A: '9',

        AAAAAA: '1',
        TTTTT: '2',
        WWWW_WWWWWWWW: '3',
        TTTTT_TTTT_TTTTTTTT: '4',
        SSSSSSSSS: '5',
        WWWW_WWWWWWWWW: '6',
        SSSSSSS_SSSSS_SSSSSSS: '7',
      };`,
      errors: 1,
      output: `const foo = {
        /* 알파벳 */
        A: '9',
        AAAAAA_AAAAAAA: '8',

        TTTTT: '2',
        AAAAAA: '1',
        SSSSSSSSS: '5',
        WWWW_WWWWWWWW: '3',
        WWWW_WWWWWWWWW: '6',
        TTTTT_TTTT_TTTTTTTT: '4',
        SSSSSSS_SSSSS_SSSSSSS: '7',
      };`,
    },
    {
      code: `module.exports = {
        meta: {
          type: "suggestion",
          docs: {},
          fixable: "code",
          schema: [
            {
              type: "object",
              properties: {},
              additionalProperties: false,
            },
          ],
        },
        create() {
          return {};
        },
      };`,
      errors: 1,
      output: `module.exports = {
        meta: {
          docs: {},
          type: "suggestion",
          schema: [
            {
              type: "object",
              properties: {},
              additionalProperties: false,
            },
          ],
          fixable: "code",
        },
        create() {
          return {};
        },
      };`,
    },
  ],
});
