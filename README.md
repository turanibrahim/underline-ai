# Underline AI

> Pull underlined text from any image. Runs entirely in your browser.

Drop screenshots, scans, or photos in. Underline AI resizes them for the
model, asks Gemini to read only the underlined lines, and hands back a
clean bulleted list.

- **No account.** Use your own free Google Gemini API key.
- **No tracking.** No analytics, no third-party scripts, no telemetry.
- **No backend.** Images, history, and the encrypted API key all live in
  your browser's IndexedDB.

```
notes.png  ──►  resize + grayscale  ──►  Gemini  ──►  result.md
              (in your browser)        (your key)
```

## Features

**Input** — batch upload of PNG / JPG / WebP images.

**Processing** — done in the browser:
- Resize, grayscale, re-encode (JPEG or WebP)
- Five Gemini models: Flash Lite, Flash, 3.5 Flash, Pro Preview, Gemma 4
- Custom system prompt — rewrite the OCR rules to match your workflow

**Output** — ready to use:
- Markdown list, sanitized, one-click copy
- Per-image retry without restarting the whole batch
- Preview modal to inspect the source image full-size

**Storage** — stays local:
- API key AES-encrypted in IndexedDB
- Every run saved with thumbnail, model, duration, and the model response
- Zero tracking, zero third-party scripts

## Quick start

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

Then open the app, go to **Settings**, paste a Gemini API key from
[aistudio.google.com/apikey](https://aistudio.google.com/apikey) (free
tier is fine), and run your first extraction.

## Scripts

| | |
|---|---|
| `pnpm dev` | Vite dev server with HMR |
| `pnpm build` | Type-check + production build to `dist/` |
| `pnpm preview` | Serve the built bundle |
| `pnpm typecheck` | Type-check only |
| `pnpm lint` | ESLint over the whole repo |
| `pnpm lint:layers` | ESLint focused on import-boundary rules |
| `pnpm test` | Vitest, single run |
| `pnpm test:watch` | Vitest in watch mode |

## Tech stack

- **Vue 3.5** + **TypeScript 6** + **Vite 8**
- **Pinia** for state, **Vue Router 5** with two layouts (`app` / `empty`)
- **Tailwind CSS 4** + **shadcn-vue** (reka-nova style) for UI
- **Dexie** (IndexedDB) for persistence
- **CryptoJS** for API-key obfuscation
- **@google/genai** for the Gemini API
- **browser-image-compression** + Canvas API for in-browser optimization
- **DOMPurify** + **marked** for safe markdown rendering
- **Vitest** + **jsdom** for unit tests

## Project structure

```
src/
├── pages/        # Route-level views (home, operation, history, settings)
├── layouts/      # AppLayout (with nav), EmptyLayout (marketing)
├── components/   # ui/ (shadcn), molecules/, organisms/, templates/
├── composables/  # use-app-ready, use-copy-actions
├── stores/       # Pinia: gemini, history, optimizer
├── services/     # config, gemini, history, image-optimizer
├── resources/db/ # Dexie schema, types
├── plugins/      # pinia, router (with guards)
└── lib/          # Pure utilities: utils, format, image-utils, markdown
```

The codebase follows a strict layered architecture enforced by ESLint:
`resources → services → stores → composables/components → pages`. See
[docs/architecture.md](docs/architecture.md) for the full picture.

## Documentation

- **[Architecture](docs/architecture.md)** — layers, data flow, state, security model
- **[Developer Guide](docs/developer-guide.md)** — setup, conventions, recipes, testing

## Contributing

PRs welcome. Before opening one:

```bash
pnpm lint && pnpm typecheck && pnpm test
```

CI runs the same checks plus `pnpm build`. The
[`pnpm lint:layers`](docs/developer-guide.md#import-boundary-rules) rule
will fail your PR if you import across layer boundaries.

## License

[MIT](LICENSE)
