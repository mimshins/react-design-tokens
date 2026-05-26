# AGENTS.md

Guidelines for AI agents working in this repository.

## Repository Layout

```
react-design-tokens/
├── lib/                  # The publishable npm package (react-design-tokens)
│   ├── src/
│   │   ├── index.ts                        # Public exports
│   │   ├── create-theming.tsx              # Core API: createTheming
│   │   ├── generator/
│   │   │   ├── utils.ts                    # defaultCSSVariableGenerator, helpers
│   │   │   ├── utils.test.ts               # Unit tests for generator utilities
│   │   │   └── variable-generator.tsx      # VariableGenerator component + types
│   │   └── utils/
│   │       ├── is-plain-object.ts
│   │       ├── logger.ts
│   │       └── shallow-merge.ts
│   ├── tsdown.config.ts                    # Build config (tsdown / rolldown)
│   ├── vitest.config.ts                    # Test config
│   └── package.json                        # Package manifest (react-design-tokens)
├── playground/           # Next.js app for manual testing
│   └── app/
│       ├── theming.ts    # Example theming client
│       └── page.tsx
├── scripts/
│   └── check-cycles.ts   # Circular dependency check (madge)
├── .changeset/           # Changesets for versioning
├── eslint.config.js      # ESLint flat config
├── tsconfig.json         # Root TypeScript config
└── pnpm-workspace.yaml   # pnpm workspace definition
```

## Package Manager

This repo uses **pnpm** exclusively. Do not use `npm` or `yarn`.

```bash
pnpm install          # install all workspace dependencies
pnpm build            # build all packages
pnpm test             # run all tests
pnpm format           # format + lint (prettier + eslint --fix)
pnpm check:lint       # lint check without fixing
```

Run commands scoped to a package with `pnpm --filter <name> <script>`, e.g.:

```bash
pnpm --filter react-design-tokens build
pnpm --filter react-design-tokens test
pnpm --filter playground run dev
```

## Node / pnpm Versions

- Node: **24** (see `engines.node` in root `package.json`)
- pnpm: **10.22.0** (see `packageManager` in root `package.json`)

## Building the Library

```bash
cd lib
pnpm build          # runs tsdown, outputs to lib/dist/
```

The build produces ESM-only output (`lib/dist/index.js` +
`lib/dist/index.d.ts`). There is no CJS build.

## Testing

Tests live in `lib/src/**/*.test.ts(x)` and use **Vitest** with **jsdom**.

```bash
pnpm test                   # run all tests once
pnpm test:watch             # watch mode
```

Always run tests after modifying `lib/src/`. The test suite must pass before
committing.

## Code Style

- **TypeScript** everywhere. No plain `.js` files in `lib/src/`.
- **Prettier** for formatting (config: `.prettierrc`). Run
  `pnpm format:prettier` or let the pre-commit hook handle it.
- **ESLint** with `eslint.config.js` (flat config). Run `pnpm format:eslint` to
  auto-fix.
- Imports are auto-sorted by `prettier-plugin-organize-imports`.
- No circular dependencies — enforced by `pnpm check:cycles` (uses `madge`).

## Core Architecture

### `createTheming(tokens, config?)`

The single factory function exported from `lib/src/create-theming.tsx`. It:

1. Pre-computes merged tokens (`{ ...variantTokens, ...commonTokens }`) for
   every variant at call time and stores them in a `Map`. This means
   `useTokens()` is a single map lookup — no work per render.
2. Creates a React context (`ActiveVariantContext`) that holds the active
   variant key.
3. Returns
   `{ VariantSelector, useTokens, useVariant, generateCSSVariablesAsInlineStyle, generateStylesheet }`.

### CSS Variable Generation

`lib/src/generator/utils.ts` contains:

- `defaultCSSVariableGenerator` — converts a token path like
  `colors.primary.base` to `--colors-primary-base`.
- `generateCssVariables(tokens, generator)` — recursively walks the token tree
  and calls the generator for each scalar leaf.
- `getCSSVariablesAsInlineStyle(variables)` — converts the flat array of
  descriptors to a React `style` object.

The `VariableGenerator` component (`lib/src/generator/variable-generator.tsx`)
wraps the subtree in a DOM element, injects the CSS variables as inline styles,
and sets `data-variant` on the element.

### Token Merging

`shallowMerge(target, source)` in `lib/src/utils/shallow-merge.ts` performs
`{ ...target, ...source }`. Source (common tokens) wins on key collisions. Both
arguments must be plain objects.

## Changesets

This repo uses **Changesets** for versioning and changelogs.

```bash
pnpm changesets:create    # create a new changeset
pnpm changesets:apply     # bump versions and update changelogs
pnpm changesets:status    # show pending changesets since main
```

When adding a feature or fixing a bug in `lib/`, create a changeset:

- `patch` — bug fix, internal refactor, no API change.
- `minor` — new exported API, new prop, new option.
- `major` — breaking change.

## Making Changes to the Library

1. Edit files under `lib/src/`.
2. Run `pnpm --filter react-design-tokens test` to verify nothing is broken.
3. Run `pnpm check:lint` to catch type errors and lint issues.
4. If the change is user-facing, add a changeset with `pnpm changesets:create`.
5. Update `lib/README.md` if the public API changed.

## Playground

The `playground/` directory is a Next.js app used for manual integration
testing. It is not published.

```bash
pnpm playground:dev    # start dev server
pnpm playground:prod   # build + start production server
```

Edit `playground/app/theming.ts` to experiment with the library.

## What Not to Do

- Do not add CJS output or change `"type": "module"` in `lib/package.json`.
- Do not introduce new runtime dependencies to `lib/` — it has no runtime deps
  (only peer deps: react, react-dom).
- Do not push directly to `main`. Open a pull request.
- Do not skip the changeset step for user-facing changes.
- Do not use `npm` or `yarn` — pnpm only.
