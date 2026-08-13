# effect-vue

A Vue port of Kit Langton's [Effect Atom Examples](https://atom.kitlangton.com) — a routed,
interactive tour of [Effect](https://effect.website) Atom.

All twelve examples from the reference tour are included, from `Atom.make(0)` through the three
streaming-search patterns. Each example is a normal application page that mounts the Vue
components from `src/examples` directly; there is no embedded editor or playground runtime.

```sh
npm install
npm run dev
```

Arrow keys move between examples, and each one has its own URL (`/basic-atom`, `/atom-fn`, …).

## Adding an example

1. Create `src/examples/<slug>/`.
2. Put the atom definitions in `atoms.ts`.
3. Add one `.vue` file per panel, plus any helper components the panels import.
4. Add the example to the ordered list in `src/examples/registry.ts`. Its `panels` array controls
   the mounted panels and their order; `writablePanels` controls the badges.

Example components stay deliberately plain — a `value` block, an `actions` row, ordinary
elements — and `src/styles/main.css` gives them the shared application styling.

## The Vue bindings

`@effect/atom-vue` exposes `useAtom`, `useAtomValue`, `useAtomSet`, `useAtomRef` and
`injectRegistry`. Two differences from the React bindings are worth calling out on stage:

- **Every composable takes a thunk**, `useAtom(() => someAtom)`. The thunk is reactive, so an
  atom picked by another atom's value (see the Atom Family example) resubscribes on its own.
- **There is no `useAtomRefresh`.** Refreshing goes through the registry:
  `injectRegistry().refresh(atom)`.

Each routed example page provides and disposes its own registry with
`provide(registryKey, AtomRegistry.make())`. Without it, everything falls back to the module-level
`defaultRegistry`.

## Credit

The original is [Effect Atom Examples](https://atom.kitlangton.com) by
[Kit Langton](https://kitlangton.com) — the example sequence and most of the individual examples
are his. This repository rewrites them against the Vue bindings
(`@effect/atom-vue`) and Effect v4; any mistakes in the translation are mine.
