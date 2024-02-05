# Import를 그룹화하여 정리합니다 (`hardsort/import-grouping`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

해당 문서에서는 `import-grouping` 규칙의 기본 설정값을 기준으로 소개하며, `sortedOrders`를 비롯하여 다른 옵션에 대한 자세한 내용은 [여기](https://github.com/Sotaneum/eslint-plugin-hardsort/wiki/options)를 참조하세요.

## Rule Details

`import-grouping` 규칙의 기본 정렬은 다음과 같습니다.

```
1. default인 것과 아닌 것
2. alias를 사용하는 것과 아닌 것
```

### default인 것과 아닌 것

별도의 옵션이 없는 경우 모든 import는 default그룹으로 취급됩니다.

Examples of **incorrect** code for this rule:

```jsx
// ✗ bad
import React from "react";

import Button from "@/components/Button";
```

Examples of **correct** code for this rule:

```jsx
// ✓ good
import React from "react";
import Button from "@/components/Button";
```

### alias를 사용하는 것과 아닌 것

같은 그룹간에 정렬도 지정할 수 있습니다. alias 사용시 아래에 위치하도록 합니다.

Examples of **incorrect** code for this rule:

```jsx
// ✗ bad
importCheckbox from "./Checkbox";
import Button from "@/components/Button";
```

Examples of **correct** code for this rule:

```jsx
// ✓ good
import Button from "@/components/Button";
importCheckbox from "./Checkbox";
```

### Options

#### grouping

그룹을 식별할 수 있는 `id`, 해당 그룹에 속할 `pathPatterns`, 그룹 내의 정렬 방식을 지정하는 `sortedOrders` 를 지정합니다.
배열로 지정하며, 먼저 정의한 내용부터 분배됩니다.

```
# 기본값
[
  {
    "id": "default",
    "sortedOrders": ["aliasDesc"]
  }
]
```

**default는 pathPatterns을 지정하여도 나머지 정보가 포함됩니다.**

#### sort

`alias`, `orders`를 통해 alias 이해와 각 그룹을 표시될 순서를 지정합니다.

```
# 기본값
{
  "orders": ["default"]
}
```

## When Not To Use It

해당 규칙은 import 구분이 항상 파일의 상단에만 위치한다는 가정을 하고 있습니다.
따라서, import 상단에 다른 구문이 있는 경우 사용을 피해야합니다.
