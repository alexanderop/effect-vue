import type { ImportMap } from '@vue/repl'

/**
 * Versions are injected by `vite.config.ts` straight from `package.json`, so
 * the sandbox always runs the same releases the host app is built against.
 */
const EFFECT = __EFFECT_VERSION__
const ATOM_VUE = __ATOM_VUE_VERSION__

/**
 * The sandbox resolves bare specifiers through this map. Three rules matter:
 *
 *  - `effect/` (trailing slash) has to be here as well as `effect`. Deep
 *    imports like `effect/unstable/persistence/KeyValueStore` appear in the
 *    examples, and `@effect/atom-vue` itself imports nine of them.
 *  - `@effect/atom-vue` is built with `?external=vue,effect` so esm.sh leaves
 *    those two as bare specifiers instead of inlining private copies. Without
 *    it the sandbox ends up with a second Vue (breaking `provide`/`inject`,
 *    which is how the atom registry is passed down) and a second Effect.
 *  - `effect` itself is *not* externalised — esm.sh has to bundle its real npm
 *    dependencies (msgpackr and friends), which the import map cannot resolve.
 *
 * `?bundle=all` collapses effect's entry point into a single file. Without it
 * the entry re-exports every module individually and the sandbox makes ~930
 * requests before it can render; with it, ~200. The cost is that the bundle
 * cannot also serve the `effect/...` deep paths, so `@effect/atom-vue` pulls a
 * second copy of the runtime through them. That is only safe because Effect
 * keys its services by string rather than by module-local symbol — every
 * example here, including the Layer-and-services one, was checked against it.
 * If a future example starts failing to resolve a service, drop `?bundle=all`
 * first: that collapses everything back onto one copy.
 */
export const buildImportMap = (): ImportMap => ({
  imports: {
    effect: `https://esm.sh/effect@${EFFECT}?bundle=all`,
    'effect/': `https://esm.sh/effect@${EFFECT}/`,
    '@effect/atom-vue': `https://esm.sh/@effect/atom-vue@${ATOM_VUE}?external=vue,effect`,
  },
})

/** Fed to Volar so Monaco can pull `.d.ts` files for the two packages. */
export const dependencyVersion: Record<string, string> = {
  effect: EFFECT,
  '@effect/atom-vue': ATOM_VUE,
}
