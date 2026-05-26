---
"react-design-tokens": minor
---

Add `as` prop to `VariantSelector` to control the rendered wrapper element.

Previously `VariantSelector` always rendered a `<div>`, which broke flex/grid layouts and added unwanted DOM depth. You can now pass any intrinsic element:

```tsx
// render as a <section> instead of a <div>
<VariantSelector variant="dark" as="section">
  ...
</VariantSelector>

// render as a <span> for inline contexts
<VariantSelector variant="dark" as="span">
  ...
</VariantSelector>
```

Defaults to `"div"` for backwards compatibility.
