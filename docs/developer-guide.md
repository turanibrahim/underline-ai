# Developer Guide

How to set up the project, run it, and add code without breaking the
layered architecture.

## Prerequisites

- **Node.js 24+**
- **pnpm** (the project uses `pnpm-workspace.yaml`)
- A **Google Gemini API key** from [aistudio.google.com/apikey](https://aistudio.google.com/apikey) (free tier is fine)

## Setup

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

On first run, open the app, go to **Settings**, paste your API key, and
save. After that it persists in IndexedDB.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Vite dev server with HMR |
| `pnpm build` | Type-check (`vue-tsc -b`) then build to `dist/` |
| `pnpm preview` | Serve the built bundle locally |
| `pnpm typecheck` | Type-check only |
| `pnpm lint` | Run ESLint over the whole repo |
| `pnpm lint:layers` | Run ESLint focused on import-boundary rules |
| `pnpm test` | Vitest, single run |
| `pnpm test:watch` | Vitest in watch mode |
| `pnpm check:no-resource-leaks` | `rg` check that stores/components/pages/composables don't import `@/resources` |

## Project layout

```
src/
├── main.ts                  # App bootstrap: createApp, pinia, router
├── App.vue                  # Layout switcher (app vs empty)
├── style.css                # Tailwind + shadcn theme tokens
├── assets/                  # Static images shipped with the build
├── components/
│   ├── ui/                  # shadcn-vue primitives — treat as third-party
│   ├── molecules/           # Small composed units
│   ├── organisms/           # Larger composed units
│   └── templates/           # Reserved (empty)
├── composables/             # Reusable reactive hooks
├── layouts/                 # AppLayout, EmptyLayout
├── lib/                     # Pure utilities, no Vue/DOM deps where possible
├── pages/                   # Route-level views
├── plugins/
│   ├── pinia.ts             # Pinia instance
│   └── router/              # Routes + guards
├── resources/
│   └── db/                  # Dexie schema, types — the only data layer
├── services/                # Domain logic: config, gemini, history, optimizer
└── stores/                  # Pinia stores
```

The `@/` alias resolves to `src/` (configured in `vite.config.ts` and
`tsconfig.json`).

## Code conventions

Defined in `eslint.config.js` and enforced on save in `.vscode/settings.json`:

- **Indentation:** 2 spaces, **single quotes**, no semicolons noise (Antfu stylistic).
- **Functions:** arrow functions only. No `function foo() {}` at the top level, no `function () {}` expressions outside of methods. Use `const foo = () => {}`.
- **Types:** `ts/no-explicit-any` is an error. Use `unknown` and narrow.
- **Vue:** `vue/component-name-in-template-casing` requires PascalCase. Custom event names are not auto-fixed (`vue/custom-event-name-casing: off`).
- **Console:** `console.log` warns in dev, errors in production.
- **No comments in source.** Only add one if asked.

## Import-boundary rules

These are enforced by ESLint and checked again by `pnpm lint:layers`:

```
src/resources/**    → may not import from anywhere except @/lib
src/services/**     → may not import stores, components, pages, composables
src/stores/**       → may not import resources
src/components/**   → may not import resources
src/pages/**        → may not import resources
src/composables/**  → may not import resources, components, pages
```

If you find yourself wanting to break one of these, you almost certainly
want to put the code in a different layer. See the recipes below.

## Recipes

### Add a new service

1. Create `src/services/foo-service.ts`.
2. Export a singleton instance: `export const fooService = new FooService()`.
3. Inject dependencies via the constructor or module imports (e.g. `db`).
4. Add a co-located `foo-service.test.ts` that mocks `@/resources/db` and
   any other dependencies with `vi.mock(...)`.
5. Run `pnpm lint && pnpm test` to confirm the import rules pass.

### Add a new store

1. Create `src/stores/foo-store.ts`. Use the setup-style Pinia store:
   ```ts
   export const useFooStore = defineStore('foo', () => {
     const value = ref(...)
     const hydrate = async () => { ... }
     return { value, hydrate }
   })
   ```
2. Import services and lib, never `resources` directly.
3. Add a co-located test. Use `createPinia()` + `setActivePinia(...)` in
   `beforeEach`, and `vi.mock('@/services/...')` to mock the service.
4. If the store needs to be ready before routes mount, call
   `store.hydrate()` in `app-layout.vue`'s `init()` and add the store's
   `isReady` ref to `useAppReady`.

### Add a new page

1. Create `src/pages/foo-page.vue`. Use `<script setup lang="ts">`.
2. Add a lazy route in `src/plugins/router/routes.ts`:
   ```ts
   {
     path: '/foo',
     name: 'foo-page',
     component: lazyView(async () => (await import('@/pages/foo-page.vue')).default),
     meta: { layout: 'app' },           // or 'empty' for marketing pages
     beforeEnter: requireApiKey,        // optional
   }
   ```
3. If the page needs nav, add a `NavItem` entry in `app-layout.vue`.

### Add a new component

- **Pure UI primitive** (a styled wrapper, a control): add to `src/components/ui/` and
  keep it dumb. Re-export from `@/components/ui/...` in a sibling `index.ts`
  if the shadcn-vue CLI generated one.
- **A small composed piece** (a card, a row, a header, a button group): add to
  `src/components/molecules/foo.vue`.
- **A larger composed piece** (a form, a list item with sub-components): add
  to `src/components/organisms/foo.vue`.

PascalCase, no `default` exports from `.vue` files unless the
`lazyView` loader pattern in `routes.ts` is being used (it expects
`{ default: Component }`).

### Add a new optimizer option

1. Add the type and default in `src/lib/image-utils.ts`
   (`MAX_DIMENSION_CHOICES`, `DEFAULT_*`, etc.).
2. Add state, hydrate, and setter in `src/stores/optimizer-store.ts`.
3. Add a typed getter/setter in `src/services/config-service.ts`.
4. Surface the control in `src/components/molecules/image-optimization-card.vue`.
5. The page wiring (`operation-page.vue → imageOptimizerService.optimize()`) needs
   no changes — it already passes `optimizerStore.asOptions()`.

### Add a new Gemini model

Edit the `AVAILABLE_MODELS` array in `src/stores/gemini-store.ts`. The
select control picks them up automatically.

## Testing

```bash
pnpm test              # run once
pnpm test:watch        # watch mode
```

Tests live next to the code they cover. Run only one file:

```bash
pnpm test src/services/gemini-service.test.ts
```

Patterns used in the existing suite:

- **Mock the boundary, not the internals.** Service tests mock
  `@/resources/db` and `@google/genai`; store tests mock
  `@/services/config-service`. Components/pages/layouts are **not
  covered by Vitest** (see `test.exclude` in `vite.config.ts`) — rely on
  manual smoke testing + the type-checker for those.
- **Use `vi.hoisted()`** when the mock factory needs references to
  spies created outside the factory.
- **Fake timers** (`vi.useFakeTimers()`) for debounce-style code like
  `useCopyActions`.
- **jsdom stubs** for `navigator.clipboard` when testing copy actions.

## Debugging tips

- **Pinia state** — install the Pinia devtools browser extension; stores
  appear under their id (`gemini`, `optimizer`, `history`).
- **IndexedDB** — open DevTools → Application → IndexedDB →
  `underline-ai`. The two tables are `config` and `history`. To reset
  the app during dev, delete the database and reload.
- **Encrypted key** — `db.config` row `gemini.encryptedKey` holds the
  AES-encrypted blob. Decryption happens in `aiService.initializeKey()`.
- **Gemini failures** — `aiService.generate()` rejects with the original
  SDK error message, so the operation page shows it inline. Check the
  model name against `AVAILABLE_MODELS` first.
- **Layer-violation ESLint error** — read the message; it tells you
  which folder tried to import which. Move the code, don't disable the
  rule.

## Common pitfalls

- **Trying to import from `@/resources` in a component.** The data
  access must go through a service. Use `historyService.add(...)`, not
  `db.history.add(...)`.
- **Forgetting to call `store.hydrate()`.** Stores start with defaults
  only. Boot happens in `app-layout.vue`. If you add a new store, add
  it to `init()` and to `useAppReady` if its readiness gates anything.
- **Adding a `function` declaration.** The arrow-functions-only rule
  catches it. Use `const x = () => {}`.
- **Adding a top-level `console.log`.** Warns in dev, errors in prod.
  Remove or use a structured logger if you need one.
- **Mutating the DOM outside a component.** `URL.createObjectURL` blobs
  need to be revoked — see `history-row.vue` and
  `operation-image-preview-modal.vue` for the pattern.

## Releasing

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

The output in `dist/` is a static SPA. Drop it on any static host.
`vite.config.ts` uses `createWebHistory`, so the host needs SPA
fallback (rewrite all routes to `index.html`).
