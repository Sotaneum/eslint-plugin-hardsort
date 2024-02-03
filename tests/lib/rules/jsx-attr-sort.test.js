/**
 * @fileoverview jsx attributes 를 정렬합니다.
 * @author sotaneum
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/jsx-attr-sort"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: "module",
    ecmaVersion: "latest",
    ecmaFeatures: {
      jsx: true,
    },
  },
});
ruleTester.run("jsx-attr-sort", rule, {
  valid: [
    `<Foo />`,
    `<Foo check />`,
    `<Foo title="Download" onClick={() => {}} />`,
    `<Foo check title="Download" onClick={() => {}} />`,
    `<Foo bold care kind love open />`,
    `<Foo cry cake charm climb capture />`,
    `<Foo onClick cry="" cake="" charm="" climb="" capture="" />`,
    `<Foo cry={name} cake="" charm="" climb="" capture="" />`,
    `<Foo charm="" climb="" capture="" {...props} cry={name} cake="" />`,
    `<Foo
      capture=""

      charm=""
      climb=""
      {...props}
      cry={name}
      cake=""
    />`,
    `<Foo
      // http props
      capture=""

      // ui props
      cake
      charm=""
      climb=""
      {...props}
      cry={name}
    />`,
    `<Foo
      // ui props
      cake
      charm=""
      climb=""
      // http props
      capture=""
      {...props}
      cry={name}
    />`,
  ],
  invalid: [
    {
      code: `<Foo onClick={() => {}} title="Download" />`,
      errors: 1,
      output: `<Foo title="Download" onClick={() => {}} />`,
    },
    {
      code: `<Foo onClick={() => {}} title="Download" check />`,
      errors: 1,
      output: `<Foo check title="Download" onClick={() => {}} />`,
    },
    {
      code: `<Foo love bold kind care open />`,
      errors: 1,
      output: `<Foo bold care kind love open />`,
    },
    {
      code: `<Foo charm climb cry capture cake />`,
      errors: 1,
      output: `<Foo cry cake charm climb capture />`,
    },
    {
      code: `<Foo cry="" climb="" capture="" cake="" charm="" onClick />`,
      errors: 1,
      output: `<Foo onClick cry="" cake="" charm="" climb="" capture="" />`,
    },
    {
      code: `<Foo cake="" climb="" capture="" charm="" cry={name} />`,
      errors: 1,
      output: `<Foo cry={name} cake="" charm="" climb="" capture="" />`,
    },
    {
      code: `<Foo capture="" charm="" climb="" {...props} cake="" cry={name} />`,
      errors: 1,
      output: `<Foo charm="" climb="" capture="" {...props} cry={name} cake="" />`,
    },
    {
      code: `<Foo
      capture=""

      climb=""
      charm=""
      {...props}
      cake=""
      cry={name}
    />`,
      errors: 1,
      output: `<Foo
      capture=""

      charm=""
      climb=""
      {...props}
      cry={name}
      cake=""
    />`,
    },
    {
      code: `<Foo
      // http props
      capture=""

      // ui props
      charm=""
      climb=""
      cake
      {...props}
      cry={name}
    />`,
      errors: 1,
      output: `<Foo
      // http props
      capture=""

      // ui props
      cake
      charm=""
      climb=""
      {...props}
      cry={name}
    />`,
    },
    {
      code: `<Foo
      // ui props
      climb=""
      cake
      charm=""
      // http props
      capture=""
      {...props}
      cry={name}
    />`,
      errors: 1,
      output: `<Foo
      // ui props
      cake
      charm=""
      climb=""
      // http props
      capture=""
      {...props}
      cry={name}
    />`,
    },
  ],
});
