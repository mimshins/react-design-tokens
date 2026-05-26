---
"react-design-tokens": minor
---

Rename primary export from `createTheming` to `create`, matching the README documentation and playground usage.

`createTheming` is still exported as an alias for backwards compatibility but should be considered deprecated. Update your imports:

```ts
// before
import { createTheming } from "react-design-tokens";

// after
import { create } from "react-design-tokens";
```
