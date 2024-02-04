/**
 * @fileoverview import를 그룹화하여 정리합니다.
 * @author sotaneum
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/import-grouping"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const options = [
  [
    {
      id: "components",
      pathPatterns: ["^.*/components(/.*)?"],
    },
    {
      id: "pages",
      pathPatterns: ["^.*/pages(/.*)?"],
    },
    {
      id: "default",
      sortedOrders: ["aliasAsc"],
    },
  ],
  {
    alias: {
      "@": "src",
    },
    orders: ["default", "pages", "components"],
  },
];

const ruleTester = new RuleTester({
  parserOptions: { sourceType: "module", ecmaVersion: "latest" },
});

ruleTester.run("import-grouping", rule, {
  valid: [],
  invalid: [
    {
      options,
      code: `"use strict";\nimport home from '@/pages/home';\nimport React from 'react';`,
      errors: 1,
      output: `"use strict";\nimport React from 'react';\n\nimport home from '@/pages/home';`,
    },
    {
      options,
      code: `"use strict";\nimport React from 'react';\nimport home from '@/pages/home';`,
      errors: 1,
      output: `"use strict";\nimport React from 'react';\n\nimport home from '@/pages/home';`,
    },
    {
      options,
      code: `"use strict";\nimport Button from '@/components/Button';\nimport React from 'react';\nimport home from '@/pages/home';`,
      errors: 1,
      output: `"use strict";\nimport React from 'react';\n\nimport home from '@/pages/home';\n\nimport Button from '@/components/Button';`,
    },
    {
      options,
      code: `"use strict";\nimport Button from './Button';\nimport React from 'react';\nimport Label from '@/components/Label';\nimport home from '@/pages/home';`,
      errors: 1,
      output: `"use strict";\nimport React from 'react';\n\nimport home from '@/pages/home';\n\nimport Label from '@/components/Label';\nimport Button from './Button';`,
      filename: "src/components/Checkbox.jsx",
    },
  ],
});
