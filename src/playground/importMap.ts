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
 * `?bundle=all` collapses Effect's root entry point into a single file instead
 * of making the sandbox load hundreds of re-exported modules. Deep imports are
 * still mapped separately for `@effect/atom-vue`.
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
