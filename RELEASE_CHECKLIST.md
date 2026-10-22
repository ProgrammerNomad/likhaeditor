# Release checklist

Use this before publishing `@likhaeditor/*` packages to npm.

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

## Post-release

- [ ] `npm view @likhaeditor/likhaeditor@<version>`
- [ ] Smoke install in a clean project (ESM, CJS, CSS, UMD CDN URLs).
- [ ] Deploy documentation site (Netlify) so playground matches the release.
- [ ] Copy UMD + CSS into `packages/laravel/resources/assets` for Composer consumers when tagging PHP packages.

## PHP packages (optional separate tags)

- [ ] `likha/laravel` and `likha/livewire` validated in a Laravel 11+ app with published assets.
