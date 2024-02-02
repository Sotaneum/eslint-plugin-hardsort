# Sorts object properties by variables and functions, abbreviation, length, and alphabetical order (`hardsort/object-sort`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

객체를 정렬합니다.

- key와 value에 따라 정렬을 시도합니다.
- 우선순위
  1. 함수가 아닌 변수 > 함수인 변수
  2. 축약이 아니거나 기본값이 있거나 새로운 이름으로 할당 여부
  3. 길이 순서
  4. 알파벳 순서

## Rule Details

- 함수가 아닌 변수보다 함수인 변수가 하단에 위치해야합니다.
- 함수 여부는 `functionKeyNames`, `functionValueTypes`, `functionKeyNamePatterns` 옵션을 통해 커스텀 할 수 있습니다.

  Examples of **incorrect** code for this rule:

  ```js
  // ✗ bad
  const foo = { onCancel: () => {}, title };
  ```

  Examples of **correct** code for this rule:

  ```js
  // ✓ good
  const foo = { title, onCancel: () => {} };
  ```

- 축약된 변수와 축약되지 않은 변수를 구분하여 정렬합니다.

  Examples of **incorrect** code for this rule:

  ```js
  // ✗ bad
  const foo = { context: "테스트", title };
  ```

  Examples of **correct** code for this rule:

  ```js
  // ✓ good
  const foo = { title, context: "테스트" };
  ```

- key의 길이순으로 정렬합니다.

  Examples of **incorrect** code for this rule:

  ```js
  // ✗ bad
  const foo = { context: "테스트", title: "스타일 테스트" };
  ```

  Examples of **correct** code for this rule:

  ```js
  // ✓ good
  const foo = { title: "스타일 테스트", context: "테스트" };
  ```

- 알파벳 순으로 정렬합니다.

  Examples of **incorrect** code for this rule:

  ```js
  // ✗ bad
  const foo = { send: true, post: false };
  ```

  Examples of **correct** code for this rule:

  ```js
  // ✓ good
  const foo = { post: false, send: true };
  ```

- 각 정렬 우선순위에 따라 정렬됩니다.

  Examples of **incorrect** code for this rule:

  ```js
  // ✗ bad
  const foo = {
    inlineFooter: false,
    context,
    subTitle: "",
    title,
    bodyTextColor,
    buttons: [
      { onClick: () => {}, onClose, text: "Cancel" },
      { onClose, text: "Submit", onClick: () => {} },
    ],
  };
  ```

  Examples of **correct** code for this rule:

  ```js
  // ✓ good
  const foo = {
    title,
    context,
    bodyTextColor,
    buttons: [
      { text: "Cancel", onClose, onClick: () => {} },
      { text: "Submit", onClose, onClick: () => {} },
    ],
    subTitle: "",
    inlineFooter: false,
  };
  ```

- 중간에 spread 구문이 있는 경우 그 경계를 기준으로 정렬합니다.

  Examples of **incorrect** code for this rule:

  ```js
  // ✗ bad
  const foo = {
    inlineFooter: false,
    context,
    subTitle: "",
    ...overwrite,
    bodyTextColor,
    title,
    buttons: [
      { onClick: () => {}, onClose, text: "Cancel" },
      { onClose, text: "Submit", onClick: () => {} },
    ],
  };
  ```

  Examples of **correct** code for this rule:

  ```js
  // ✓ good
  const foo = {
    context,
    subTitle: "",
    inlineFooter: false,
    ...overwrite,
    title,
    bodyTextColor,
    buttons: [
      { text: "Cancel", onClose, onClick: () => {} },
      { text: "Submit", onClose, onClick: () => {} },
    ],
  };
  ```

- 중간에 빈 엔터가 있는 경우 그 경계를 기준으로 정렬합니다.

  Examples of **incorrect** code for this rule:

  ```js
  // ✗ bad
  const foo = {
    inlineFooter: false,
    context,
    subTitle: "",

    bodyTextColor,
    title,
    buttons: [
      { onClick: () => {}, onClose, text: "Cancel" },
      { onClose, text: "Submit", onClick: () => {} },
    ],
  };
  ```

  Examples of **correct** code for this rule:

  ```js
  // ✓ good
  const foo = {
    context,
    subTitle: "",
    inlineFooter: false,

    title,
    bodyTextColor,
    buttons: [
      { text: "Cancel", onClose, onClick: () => {} },
      { text: "Submit", onClose, onClick: () => {} },
    ],
  };
  ```

- 중간에 빈 엔터가 있고 라인 주석이 있는 경우 해당 주석을 그룹의 제목으로 취급합니다.
- `ignoreCommentGroup`옵션을 통해 비활성화 할 수 있습니다.

  Examples of **incorrect** code for this rule:

  ```js
  // ✗ bad
  const foo = {
    inlineFooter: false,
    context,
    subTitle: "",

    // Main UI
    bodyTextColor,
    title,
    buttons: [
      { onClick: () => {}, onClose, text: "Cancel" },
      { onClose, text: "Submit", onClick: () => {} },
    ],
  };
  ```

  Examples of **correct** code for this rule:

  ```js
  // ✓ good
  const foo = {
    context,
    subTitle: "",
    inlineFooter: false,

    // Main UI
    title,
    bodyTextColor,
    buttons: [
      { text: "Cancel", onClose, onClick: () => {} },
      { text: "Submit", onClose, onClick: () => {} },
    ],
  };
  ```

### Options

| 옵션                    | 기본값                                                                                                        | 내용                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| functionKeyNames        | `["select", "next"]`                                                                                          | 함수 여부를 식별하는 용도로 활용되며, 해당 배열에 포함된 key인 경우 함수로 취급합니다.                 |
| functionValueTypes      | `["AsyncFunction", "MethodDefinition", "GeneratorFunction", "FunctionExpression", "ArrowFunctionExpression"]` | 함수 여부를 식별하는 용도로 활용되며, 해당 배열에 포함된 value의 type인 경우 함수로 취급힙니다.        |
| ignoreCommentGroup      | `false`                                                                                                       | 정렬 그룹핑 방식 중, 공백 그룹을 허용할지 여부를 지정합니다.                                           |
| functionKeyNamePatterns | `["^on", "^callback"]`                                                                                        | 함수 여부를 식별하는 용도로 활용되며, 해당 배열에 포함된 정규식을 key가 통과한 경우 함수로 취급합니다. |

## When Not To Use It

- 이미 객체 정렬과 관련된 플러그인 및 규칙을 사용하는 경우, 충돌이 발생할 수 있으므로, 필요한 경우에 사용하세요.
- `functionKeyNames`에 포함된 함수가 아닌 key 이름이 많은 경우 옵션으로 조정하세요. 필요에 따라 key 이름을 변경하는 것도 하나의 방법입니다.
- `functionValueTypes`의 값을 수정하는 경우 value의 타입이 함수이거나 함수가 아닌 케이스에서도 함수로 인식될 우려가 있으므로 수정에 주의하세요.
- `ignoreCommentGroup` 옵션이 비활성화되어있는 경우, 블럭 주석이 예상하지 못한 형태로 정렬될 수 있으니, 주어진 조건에 맞게 주석을 활용했는 지 여부를 검토 후에 문제가 있는 경우 활성화하세요.
- `functionKeyNamePatterns`에 포함된 정규식을 통과하는 key 이름은 함수로 추측하게 되므로, 변수 이름 생성시 주의가 필요합니다.
