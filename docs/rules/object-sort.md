# Object를 정렬합니다 (`hardsort/object-sort`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

해당 문서에서는 `object-sort` 규칙의 기본 설정값을 기준으로 소개하며, `sortedOrders`를 비롯하여 다른 옵션에 대한 자세한 내용은 [여기](https://github.com/Sotaneum/eslint-plugin-hardsort/wiki/options)를 참조하세요.

## Rule Details

`object-sort` 규칙의 기본 정렬은 다음과 같습니다.

```
1. 함수 여부
2. 축약이 아니거나 기본값이 있거나 새로운 이름으로 할당 여부
3. key의 길이 순서
4. key의 알파벳 순서
```

### 함수 여부

함수가 아닌 변수를 앞쪽에 위치하고 함수인 변수를 뒤쪽에 위치하도록 합니다.

Examples of **incorrect** code for this rule:

```js
// ✗ bad
const foo = { onClick, title };
```

Examples of **correct** code for this rule:

```js
// ✓ good
const foo = { title, onClick };
```

### 축약이 아니거나 기본값이 있거나 새로운 이름으로 할당 여부

축약이 아니거나 기본값이 있거나 새로운 이름으로 할당했을 경우 뒤쪽에 위치하도록 합니다.

Examples of **incorrect** code for this rule:

```jsx
// ✗ bad
const foo = { done: () => {}, context, onClick, title: "Download" };
```

Examples of **correct** code for this rule:

```jsx
// ✓ good
const foo = { context, title: "Download", onClick, done: () => {} };
```

### key의 길이 순서

key의 길이에 따라 짧은 순서가 앞에 위치하도록 합니다.

Examples of **incorrect** code for this rule:

```jsx
// ✗ bad
const foo = { charm, climb, cry, capture, cake };
```

Examples of **correct** code for this rule:

```jsx
// ✓ good
const foo = { cry, cake, charm, climb, capture };
```

### key의 알파벳 순서

key의 알파벳 순서에 따라 앞에 위치하도록 합니다.

Examples of **incorrect** code for this rule:

```jsx
// ✗ bad
const foo = { care, open, kind, love, bold };
```

Examples of **correct** code for this rule:

```jsx
// ✓ good
const foo = { bold, care, kind, love, open };
```

### Spread 그룹

`Spread`로 `attribute` 값을 전달하고 있는 경우, `Spread` 기준으로 그룹화하여 순서를 지정합니다.

Examples of **incorrect** code for this rule:

```jsx
// ✗ bad
const foo = {
  title: "Not Found",
  ...defaultOptions,
  done: () => {},
  check: false,
};
```

Examples of **correct** code for this rule:

```jsx
// ✓ good
const foo = {
  title: "Not Found",
  ...defaultOptions,
  check: false,
  done: () => {},
};
```

### Enter 그룹

`Enter`를 기준으로 그룹화하여 순서를 지정합니다.
`Enter` 바로 위에 있는 Line 주석은 그룹의 제목으로 취급됩니다.

Examples of **incorrect** code for this rule:

```jsx
// ✗ bad
module.exports = {
  CODE: {
    // HTTP CODE
    UNAUTHORIZED: "401",
    NOT_FOUND: "404",
    OK: "200",

    // API ERROR CODE
    INVALID: "-1",
  },
};
```

Examples of **correct** code for this rule:

```jsx
// ✓ good
module.exports = {
  CODE: {
    // HTTP CODE
    OK: "200",
    NOT_FOUND: "404",
    UNAUTHORIZED: "401",

    // API ERROR CODE
    INVALID: "-1",
  },
};
```

### Options

#### sortedOrders

정렬 방식 및 순서를 지정합니다.

```
# 기본값
[
  "isFunctionAsc",
  "isShortAsc",
  "keyNameLengthAsc",
  "localeCompareAsc",
]
```

#### functionKeyNames

함수로 가정하는 이름 목록을 지정합니다.

```
# 기본값
[
  "next",
  "select",
]
```

#### ignoreEnterGroup

엔터를 기준으로 그룹을 구성하지 않을 지 여부를 지정합니다.

```
# 기본값
false
```

#### functionValueTypes

value가 있는 경우, 함수로 가정하는 value의 type를 지정합니다.

```
# 기본값
[
  "AsyncFunction",
  "MethodDefinition",
  "GeneratorFunction",
  "FunctionExpression",
  "ArrowFunctionExpression",
]
```

#### functionKeyNamePatterns

함수로 가정하는 이름 패턴 목록을 지정합니다.

```
# 기본값
[
  "^on",
  "^callback",
]
```

## When Not To Use It

- 이미 `Object` 정렬과 관련된 플러그인 및 규칙을 사용하는 경우, 충돌이 발생할 수 있으므로, 필요한 경우에 사용하세요.
