---
"react-design-tokens": minor
---

Add `useVariant()` hook to read the currently active variant key.

```tsx
const { useVariant } = create(tokens);

const MyComponent = () => {
  const variant = useVariant(); // "dark" | "light"
  return <img src={variant === "dark" ? darkIcon : lightIcon} />;
};
```

Throws if called outside a `<VariantSelector>`.
