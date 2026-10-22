# Release checklist

Use this before publishing `@likhaeditor/*` packages to npm.

## Windows workspace path

If you use the `C:\xampp\htdocs\likhaeditor` junction, pnpm may print a harmless filter warning (`C:\...\D:\Websites\likhaeditor`). Prefer running publish and builds from the canonical git root:

`D:\Websites\likhaeditor`

## Versioning

- [ ] Bump **the same version** in root `package.json`, all `packages/*/package.json` npm packages, and docs (`docs/changelog.md`, `docs/status.md`, VitePress nav).
- [ ] Record API or behavior changes (especially `onChange` timing and URL policy).

## Validation (match CI)

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm lint
pnpm pre-publish
pnpm test:packages
pnpm exec playwright install --with-deps chromium firefox webkit
pnpm test:browser
pnpm docs:build
pnpm test:site
pnpm audit --audit-level=high
```

## Publish

```sh
npm login
pnpm publish:all
```

If npm prompts for **OTP** (2FA), complete browser auth before each publish batch finishes.

### React package only (first publish or retry)

When `@likhaeditor/likhaeditor-react` is missing on the registry:

```sh
cd D:\Websites\likhaeditor
pnpm build
pnpm --filter @likhaeditor/likhaeditor-react publish --access public
```

If `0.0.3` already exists, bump `packages/react/package.json` patch version and republish.

## Post-release

Registry index can lag **1–10 minutes** after a successful CLI `+ @scope/pkg@version`. Wait before `npm view @scope/pkg@version`.

Verify all five packages:

```sh
npm view @likhaeditor/core version
npm view @likhaeditor/ui version
npm view @likhaeditor/plugins version
npm view @likhaeditor/likhaeditor version
npm view @likhaeditor/likhaeditor-react version
npm view @likhaeditor/likhaeditor@<version> version
```

Smoke install:

```sh
npm install @likhaeditor/likhaeditor@<version>
```

CDN (may lag slightly longer than npm):

- `https://unpkg.com/@likhaeditor/likhaeditor@<version>/dist/likha-editor.umd.js`
- `https://cdn.jsdelivr.net/npm/@likhaeditor/likhaeditor@<version>/dist/likha-editor.css`

- [ ] Deploy documentation site (Netlify) so playground matches the release.
- [ ] Copy UMD + CSS into `packages/laravel/resources/assets` for Composer consumers when tagging PHP packages.

## PHP packages (optional separate tags)

- [ ] `likha/laravel` and `likha/livewire` validated in a Laravel 11+ app with published assets.
