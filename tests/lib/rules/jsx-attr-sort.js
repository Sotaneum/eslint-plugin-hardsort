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
  valid: [`<Foo />`],

  invalid: [
    {
      code: `<Foo aaaa={aaaa} bb={bb} onClick={handleClick} {...props} cacc={cccc} check/>`,
      errors: 1,
      output: `<Foo bb={bb} aaaa={aaaa} onClick={handleClick} {...props} check cacc={cccc}/>`,
    },
    {
      code: `<Foo /*test*/ aaaa={aaaa} bb={bb} onClick={handleClick} {...props} cacc={cccc} check/>`,
      errors: 1,
      output: `<Foo bb={bb} /*test*/ aaaa={aaaa} onClick={handleClick} {...props} check cacc={cccc}/>`,
    },
    {
      code: `<Foo
        /*test*/
        aaaa={aaaa}
        bb={bb}
        onClick={handleClick}
        {...props}
        cacc={cccc}
        check
      />`,
      errors: 1,
      output: `<Foo
        bb={bb}
        /*test*/
        aaaa={aaaa}
        onClick={handleClick}
        {...props}
        check
        cacc={cccc}
      />`,
    },
    {
      code: `<Foo
        // test
        aaaa={aaaa}
        a={a}

        // update
        onClick={handleClick}
        bb={bb}
        {...props}
        cacc={cccc}

        // data
        check
        b={b}
      />`,
      errors: 1,
      output: `<Foo
        // test
        a={a}
        aaaa={aaaa}

        // update
        bb={bb}
        onClick={handleClick}
        {...props}
        cacc={cccc}

        // data
        check
        b={b}
      />`,
    },
    {
      code: `<Foo
        aaaa={aaaa}
        a={a}

        onClick={handleClick}
        bb={bb}
        {...props}
        cacc={cccc}

        check
        b={b}
      />`,
      errors: 1,
      output: `<Foo
        a={a}
        aaaa={aaaa}

        bb={bb}
        onClick={handleClick}
        {...props}
        cacc={cccc}

        check
        b={b}
      />`,
    },
    {
      code: `<Foo
        aaaa={aaaa}
        a={a}
        onClick={handleClick}
        bb={bb}
        {...props}
        cacc={cccc}
        check
        b={b}
      />`,
      errors: 1,
      output: `<Foo
        a={a}
        bb={bb}
        aaaa={aaaa}
        onClick={handleClick}
        {...props}
        check
        b={b}
        cacc={cccc}
      />`,
    },
    {
      code: `<Foo
        aaaa={aaaa}
        a={a}
        onClick={handleClick}
        bb={bb}
        cacc={cccc}
        check
        b={b}
      />`,
      errors: 1,
      output: `<Foo
        check
        a={a}
        b={b}
        bb={bb}
        aaaa={aaaa}
        cacc={cccc}
        onClick={handleClick}
      />`,
    },
    {
      code: `<Foo
        aaaa={{b:1, a:1}}
        a={a}
        onClick={handleClick}
        bb={bb}
        cacc={cccc}
        check
        b={b}
      />`,
      errors: 1,
      output: `<Foo
        check
        a={a}
        b={b}
        bb={bb}
        aaaa={{b:1, a:1}}
        cacc={cccc}
        onClick={handleClick}
      />`,
    },
    {
      code: `<Foo
        aaaa={{b:1, a:1}}
        a={a}
        onClick={handleClick}
        bb={bb}
        cacc={cccc}
        check
        b={b}
      ><p b={a} a={b}>test</p></Foo>`,
      errors: 1,
      output: `<Foo
        check
        a={a}
        b={b}
        bb={bb}
        aaaa={{b:1, a:1}}
        cacc={cccc}
        onClick={handleClick}
      ><p a={b} b={a}>test</p></Foo>`,
    },
    {
      code: `<Foo
        aaaa={{b:1, a:1}}
        a={a}
        onClick={handleClick}
        bb={bb}
        cacc={cccc}
        check
        b={b}
      >
        <p b={a} a={b}>
          test
        </p>
      </Foo>`,
      errors: 1,
      output: `<Foo
        check
        a={a}
        b={b}
        bb={bb}
        aaaa={{b:1, a:1}}
        cacc={cccc}
        onClick={handleClick}
      >
        <p a={b} b={a}>
          test
        </p>
      </Foo>`,
    },
  ],
});
