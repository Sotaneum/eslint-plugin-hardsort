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
      code: `const foo = {};`,
    },
    {
      code: `const foo = { title, onClick };`,
    },
    {
      code: `const foo = { title, done: () => {} };`,
    },
    {
      code: `const foo = { context, title: "Download", onClick, done: () => {} };`,
    },
    {
      code: `const foo = { bold, care, kind, love, open };`,
    },
    {
      code: `const foo = { cry, cake, charm, climb, capture };`,
    },
    {
      code: `const { title, onClick } = foo;`,
    },
    {
      code: `const { title, done = () => {} } = foo;`,
    },
    {
      code: `const { context, title = "Download", onClick, done = () => {} } = foo;`,
    },
    {
      code: `const { bold, care, kind, love, open } = foo;`,
    },
    {
      code: `const { cry, cake, charm, climb, capture } = foo;`,
    },
    {
      code: `const { cake, charm, climb, capture, cry: smile } = foo;`,
    },
    {
      code: `const { cake, charm, climb, cry: smile, capture = false } = foo;`,
    },
    {
      code: `const { cake, charm, climb, cry = false, capture: noCapture } = foo;`,
    },
    {
      code: `const { charm, climb, cry = false, cake: ck, capture: noCapture = false } = foo;`,
    },
    {
      code: `module.exports = { title, done: () => {} };`,
    },
    {
      code: `module.exports = { context, title: "Download", onClick, done: () => {} };`,
    },
    {
      code: `module.exports = { bold, care, kind, love, open };`,
    },
    {
      code: `module.exports = { cry, cake, charm, climb, capture };`,
    },
    {
      code: `export const foo = { title, done: () => {} };`,
      parserOptions: { sourceType: "module" },
    },
    {
      code: `export const foo = { context, title: "Download", onClick, done: () => {} };`,
      parserOptions: { sourceType: "module" },
    },
    {
      code: `export const foo = { bold, care, kind, love, open };`,
      parserOptions: { sourceType: "module" },
    },
    {
      code: `export const foo = { cry, cake, charm, climb, capture };`,
      parserOptions: { sourceType: "module" },
    },
    {
      code: `module.exports = {
        FOO: {
          DONE: '0',
          TITLE: '1',
        }
      }`,
    },
    {
      code: `module.exports = {
        CODE: {
          // HTTP CODE
          OK: '200',
          NOT_FOUND: '404',
          UNAUTHORIZED: '401',

          // API ERROR CODE
          INVALID: '-1',
        }
      }`,
    },
    {
      code: `module.exports = {
        CODE: {
          OK: '200',
          NOT_FOUND: '404',
          UNAUTHORIZED: '401',

          INVALID: '-1',
        }
      }`,
    },
    {
      code: `module.exports = {
        CODE: {
          // HTTP CODE
          OK: '200',
          // API ERROR CODE
          INVALID: '-1',
          NOT_FOUND: '404',
          UNAUTHORIZED: '401',
        }
      }`,
      options: [{ ignoreEnterGroup: true }],
    },
    {
      code: `const foo = {
        title: 'Not Found',
        ...defaultOptions,
        check: false,
        done: () => {},
      }`,
    },
  ],
  invalid: [
    {
      code: `const foo = { onClick, title };`,
      errors: 1,
      output: `const foo = { title, onClick };`,
    },
    {
      code: `const foo = { done: () => {}, title };`,
      errors: 1,
      output: `const foo = { title, done: () => {} };`,
    },
    {
      code: `const foo = { done: () => {}, context, onClick, title: "Download" };`,
      errors: 1,
      output: `const foo = { context, title: "Download", onClick, done: () => {} };`,
    },
    {
      code: `const foo = { care, open, kind, love, bold };`,
      errors: 1,
      output: `const foo = { bold, care, kind, love, open };`,
    },
    {
      code: `const foo = { charm, climb, cry, capture, cake };`,
      errors: 1,
      output: `const foo = { cry, cake, charm, climb, capture };`,
    },
    {
      code: `const { onClick, title } = foo;`,
      errors: 1,
      output: `const { title, onClick } = foo;`,
    },
    {
      code: `const { done = () => {}, title } = foo;`,
      errors: 1,
      output: `const { title, done = () => {} } = foo;`,
    },
    {
      code: `const { onClick, title = "Download", done = () => {}, context } = foo;`,
      errors: 1,
      output: `const { context, title = "Download", onClick, done = () => {} } = foo;`,
    },
    {
      code: `const { kind, love, open, bold, care } = foo;`,
      errors: 1,
      output: `const { bold, care, kind, love, open } = foo;`,
    },
    {
      code: `const { capture, climb, cry, cake, charm } = foo;`,
      errors: 1,
      output: `const { cry, cake, charm, climb, capture } = foo;`,
    },
    {
      code: `const { cake, charm, cry: smile, capture, climb } = foo;`,
      errors: 1,
      output: `const { cake, charm, climb, capture, cry: smile } = foo;`,
    },
    {
      code: `const { climb, cake, charm, capture = false, cry: smile } = foo;`,
      errors: 1,
      output: `const { cake, charm, climb, cry: smile, capture = false } = foo;`,
    },
    {
      code: `const { cake, charm, capture: noCapture, climb, cry = false } = foo;`,
      errors: 1,
      output: `const { cake, charm, climb, cry = false, capture: noCapture } = foo;`,
    },
    {
      code: `const { cake: ck, capture: noCapture = false, charm, climb, cry = false } = foo;`,
      errors: 1,
      output: `const { charm, climb, cry = false, cake: ck, capture: noCapture = false } = foo;`,
    },
    {
      code: `module.exports = { done: () => {}, title };`,
      errors: 1,
      output: `module.exports = { title, done: () => {} };`,
    },
    {
      code: `module.exports = { context, onClick, done: () => {}, title: "Download" };`,
      errors: 1,
      output: `module.exports = { context, title: "Download", onClick, done: () => {} };`,
    },
    {
      code: `module.exports = { kind, love, open, bold, care };`,
      errors: 1,
      output: `module.exports = { bold, care, kind, love, open };`,
    },
    {
      code: `module.exports = { cry, cake, capture, charm, climb };`,
      errors: 1,
      output: `module.exports = { cry, cake, charm, climb, capture };`,
    },
    {
      code: `export const foo = { done: () => {}, title };`,
      errors: 1,
      output: `export const foo = { title, done: () => {} };`,
      parserOptions: { sourceType: "module" },
    },
    {
      code: `export const foo = { context, done: () => {}, title: "Download", onClick };`,
      errors: 1,
      output: `export const foo = { context, title: "Download", onClick, done: () => {} };`,
      parserOptions: { sourceType: "module" },
    },
    {
      code: `export const foo = { bold, love, open, care, kind };`,
      errors: 1,
      output: `export const foo = { bold, care, kind, love, open };`,
      parserOptions: { sourceType: "module" },
    },
    {
      code: `export const foo = { cry, climb, capture, cake, charm };`,
      errors: 1,
      output: `export const foo = { cry, cake, charm, climb, capture };`,
      parserOptions: { sourceType: "module" },
    },
    {
      code: `module.exports = {
        FOO: {
          TITLE: '1',
          DONE: '0',
        }
      }`,
      errors: 1,
      output: `module.exports = {
        FOO: {
          DONE: '0',
          TITLE: '1',
        }
      }`,
    },
    {
      code: `module.exports = {
        CODE: {
          // HTTP CODE
          UNAUTHORIZED: '401',
          NOT_FOUND: '404',
          OK: '200',

          // API ERROR CODE
          INVALID: '-1',
        }
      }`,
      errors: 1,
      output: `module.exports = {
        CODE: {
          // HTTP CODE
          OK: '200',
          NOT_FOUND: '404',
          UNAUTHORIZED: '401',

          // API ERROR CODE
          INVALID: '-1',
        }
      }`,
    },
    {
      code: `module.exports = {
        CODE: {
          NOT_FOUND: '404',
          OK: '200',
          UNAUTHORIZED: '401',

          INVALID: '-1',
        }
      }`,
      errors: 1,
      output: `module.exports = {
        CODE: {
          OK: '200',
          NOT_FOUND: '404',
          UNAUTHORIZED: '401',

          INVALID: '-1',
        }
      }`,
    },
    {
      code: `module.exports = {
        CODE: {
          // HTTP CODE
          OK: '200',

          // API ERROR CODE
          NOT_FOUND: '404',
          UNAUTHORIZED: '401',
          INVALID: '-1',
        }
      }`,
      errors: 1,
      output: `module.exports = {
        CODE: {
          // HTTP CODE
          OK: '200',

          INVALID: '-1',
          // API ERROR CODE
          NOT_FOUND: '404',
          UNAUTHORIZED: '401',
        }
      }`,
      options: [{ ignoreEnterGroup: true }],
    },
    {
      code: `const foo = {
        title: 'Not Found',
        ...defaultOptions,
        done: () => {},
        check: false,
      }`,
      errors: 1,
      output: `const foo = {
        title: 'Not Found',
        ...defaultOptions,
        check: false,
        done: () => {},
      }`,
    },
  ],
});
