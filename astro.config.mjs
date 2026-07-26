// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages *project* site: served from techspeque.github.io under the
  // repository path (ADR-0006). `site` is the origin only — Astro joins it
  // with `base` itself — and `base` is the path segment every internal URL
  // has to carry.
  //
  // Consequences the rest of the codebase depends on, all measured against a
  // real build rather than assumed (brief §Measurement):
  //   - `Astro.url.pathname` includes the base ("/metiswww/"), so an absolute
  //     page URL resolves the pathname against SITE.url instead of
  //     concatenating onto it (src/layouts/Base.astro).
  //   - `import.meta.env.BASE_URL` is "/metiswww" for this value — no
  //     trailing slash — but Astro normalizes it against `trailingSlash`, so
  //     consumers must not assume either form.
  //   - Root-absolute `url()` in CSS that resolves into public/ is rebased by
  //     the build; hand-written HTML attributes are not.
  //   - src/consts.ts SITE.url mirrors these two values (see its comment).
  //
  // `trailingSlash` and `build.format` are deliberately left at their
  // defaults: changing either moves every URL on the site.
  site: 'https://techspeque.github.io',
  base: '/metiswww',
});
