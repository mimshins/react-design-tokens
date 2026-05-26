---
"react-design-tokens": patch
---

Fix `logLevel` config option not being optional in TypeScript.

`logLevel` was typed as required but the implementation already defaulted it to `LogLevel.WARN`. Passing `{ cssVariableGenerator: myFn }` without `logLevel` was a TypeScript error.
