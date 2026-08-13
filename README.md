# effect-vue

A Vue port of Kit Langton's [Effect Atom Examples](https://atom.kitlangton.com) — an interactive
tour of [Effect](https://effect.website) Atom with the source on the left and the running
component on the right.

Sixteen examples, from `Atom.make(0)` to an atom persisted in `localStorage` through a
`KeyValueStore` Layer. Every panel on the right is the code on the left — the pane reads the
example files with `import.meta.glob('...', { query: '?raw' })` and highlights them with Shiki,
so the two can never drift.

```sh
npm install
npm run dev
```

Arrow keys move between examples, and each one has its own URL (`/basic-atom`, `/atom-fn`, …).

## Adding an example

1. Create `src/examples/<slug>/`.
2. Put the atom definitions in `atoms.ts` — it is always shown first.
3. Add one `.vue` file per panel. The filename becomes the panel label, panels are ordered
   alphabetically, and a panel that calls `useAtom` or `useAtomSet` gets the `writable` badge.
4. Add `{ slug, title, blurb }` to the ordered list in `src/examples/registry.ts`.

Example components stay deliberately plain — a `value` block, an `actions` row, ordinary
elements — and `src/styles/main.css` gives them the panel chrome, so what the audience reads is
component code rather than styling.

## The Vue bindings

`@effect/atom-vue` exposes `useAtom`, `useAtomValue`, `useAtomSet`, `useAtomRef` and
`injectRegistry`. Two differences from the React bindings are worth calling out on stage:

- **Every composable takes a thunk**, `useAtom(() => someAtom)`. The thunk is reactive, so an
  atom picked by another atom's value (see the Atom Family example) resubscribes on its own.
- **There is no `useAtomRefresh`.** Refreshing goes through the registry:
  `injectRegistry().refresh(atom)`.

`src/main.ts` provides a registry with `app.provide(registryKey, AtomRegistry.make())`. Without
it, everything falls back to the module-level `defaultRegistry`.

## Credit

The original is [Effect Atom Examples](https://atom.kitlangton.com) by
[Kit Langton](https://kitlangton.com) — the example sequence, the split-screen layout and most of
the individual examples are his. This repository rewrites them against the Vue bindings
(`@effect/atom-vue`) and Effect v4; any mistakes in the translation are mine.
