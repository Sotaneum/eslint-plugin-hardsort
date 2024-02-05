# JSX Attributes를 정렬합니다 (`hardsort/jsx-attr-sort`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

해당 문서에서는 `jsx-attr-sort` 규칙의 기본 설정값을 기준으로 소개하며, `sortedOrders`를 비롯하여 다른 옵션에 대한 자세한 내용은 [여기](https://github.com/Sotaneum/eslint-plugin-hardsort/wiki/options)를 참조하세요.

## Rule Details

`jsx-attr-sort` 규칙의 기본 정렬은 다음과 같습니다.

```
1. boolean 타입 생략 여부
2. 함수 여부
3. key의 길이 순서
4. key의 알파벳 순서
```

### Boolean 타입 생략 여부

Boolean 타입인 attribute에서 생략했을 경우 앞에 위치하도록 합니다.

Examples of **incorrect** code for this rule:

```jsx
// ✗ bad
<Foo onClick={() => {}} title="Download" check />
```

Examples of **correct** code for this rule:

```jsx
// ✓ good
<Foo check title="Download" onClick={() => {}} />
```

### 함수 여부

함수가 아닌 변수를 앞쪽에 위치하고 함수인 변수를 뒤쪽에 위치하도록 합니다.

Examples of **incorrect** code for this rule:

```jsx
// ✗ bad
<Foo onClick={handleClick} cry={name} />
```

Examples of **correct** code for this rule:

```jsx
// ✓ good
<Foo cry={name} onClick={handleClick} />
```

### key의 길이 순서

key의 길이에 따라 짧은 순서가 앞에 위치하도록 합니다.

Examples of **incorrect** code for this rule:

```jsx
// ✗ bad
<Foo charm climb cry capture cake />
```

Examples of **correct** code for this rule:

```jsx
// ✓ good
<Foo cry cake charm climb capture />
```

### key의 알파벳 순서

key의 알파벳 순서에 따라 앞에 위치하도록 합니다.

Examples of **incorrect** code for this rule:

```jsx
// ✗ bad
<Foo love bold kind care open />
```

Examples of **correct** code for this rule:

```jsx
// ✓ good
<Foo bold care kind love open />
```

### Spread 그룹

`Spread`로 `attribute` 값을 전달하고 있는 경우, `Spread` 기준으로 그룹화하여 순서를 지정합니다.

Examples of **incorrect** code for this rule:

```jsx
// ✗ bad
<Foo
  capture=""
  climb=""
  charm=""
  {...props}
  onClick={handleClick}
  cake=""
  cry={name}
/>
```

Examples of **correct** code for this rule:

```jsx
// ✓ good
<Foo
  charm=""
  climb=""
  capture=""
  {...props}
  cry={name}
  cake=""
  onClick={handleClick}
/>
```

### Options

#### sortedOrders

정렬 방식 및 순서를 지정합니다.

```
# 기본값
[
  "isShortAsc",
  "isFunctionAsc",
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
true
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

- 이미 `JSX Attribute` 정렬과 관련된 플러그인 및 규칙을 사용하는 경우, 충돌이 발생할 수 있으므로, 필요한 경우에 사용하세요.
