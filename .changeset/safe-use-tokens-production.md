---
"react-design-tokens": patch
---

`useTokens` no longer throws in production when called outside a `<VariantSelector>`.

In development the error is still thrown to catch mistakes early. In production it returns an empty object so a misplaced hook call degrades gracefully instead of crashing the app.
