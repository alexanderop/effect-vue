# effect-vue

A guided tour of [Effect](https://effect.website) Atom for Vue developers, based on Kit Langton's
[Effect Atom Examples](https://atom.kitlangton.com).

Twenty examples, from `Atom.make(0)` to a service-backed todo app, each one a routed page in a
normal Vue application — no embedded editor, no playground runtime. If you know `ref` and
`computed` but have never written an Effect, start with
[docs/effect-for-vue-developers.md](docs/effect-for-vue-developers.md) and then walk the tour in
order.

```sh
npm install
npm run dev
```

Arrow keys move between examples, and each one has its own URL (`/basic-atom`, `/atom-family`, …).

## How an example is laid out

One example is one directory, and it holds everything about that example — atoms, components, and
both of its tests:

```text
src/examples/atom-family/
├── atoms.ts                    # the atom definitions
├── atoms.node.spec.ts          # the atom graph, on a TestClock
├── AtomFamily.vue              # the root component
├── AtomFamily.browser.spec.ts  # one user workflow, real Chromium
├── AtomFamilySelector.vue
└── AtomFamilyVotes.vue
```

**Every example has a root component named after it.** It composes the example's panels and is the
one thing that gets mounted — by the routed page in the app, and by the browser test:

```ts
const mounted = mountWithRegistry(AtomFamily, { label: 'Atom Family' })
```

The test drives the real component tree with a registry of its own. No route, no slug lookup, no
page chrome in between.

Naming follows the [Vue style guide](https://vuejs.org/style-guide/): tightly coupled children
carry their parent's name as a prefix (`AtomFamilySelector`, not `Selector`), so no two files in
the project share a name and an import is never ambiguous. Panel chrome comes from the shared
`BasePanel`, whose `label` becomes the panel's accessible name — which is also how tests find it.

## Adding an example

1. Create `src/examples/<slug>/`.
2. Put the atom definitions in `atoms.ts`.
3. Add a root `<ExampleName>.vue` that lays out `BasePanel`s, plus one child per panel, each
   prefixed with the example name.
4. Add an entry to `src/examples/registry.ts`: import the root component and write the `blurb`,
   `api`, `effectNote`, and `vueNote`. The notes are the teaching layer and are rendered on the
   page.
5. Write `atoms.node.spec.ts` and `<ExampleName>.browser.spec.ts`.

Example components stay deliberately plain — a `value` block, an `actions` row, ordinary elements —
and `src/styles/main.css` gives them the shared application styling.

## The Vue bindings

`@effect/atom-vue` exposes `useAtom`, `useAtomValue`, `useAtomSet`, `useAtomRef` and
`injectRegistry`. Two differences from the React bindings are worth calling out on stage:

- **Every composable takes a thunk**, `useAtom(() => someAtom)`. The thunk is reactive, so an atom
  picked by another atom's value (see the Atom Family example) resubscribes on its own.
- **There is no `useAtomRefresh`.** Refreshing goes through the registry:
  `injectRegistry().refresh(atom)`.

Each routed example page provides and disposes its own registry with
`provide(registryKey, AtomRegistry.make())`. Without it, everything falls back to the module-level
`defaultRegistry`.

## Testing strategy

The suite mirrors Effect's own approach: Atom and Effect behavior is tested in Node with
`@effect/vitest`, `it.effect`, explicit layers, `TestClock`, and deterministic synchronization; the
Vue binding is tested separately in real Chromium with a fresh registry per mount.

```sh
npm run test:node
npm run test:browser
npm test
```

See [docs/testing.md](docs/testing.md) for the upstream findings, the repository rules, and the
patterns worth copying — including the `TestClock` ordering rule that makes atom tests either work
or hang forever.

## Credit

The original is [Effect Atom Examples](https://atom.kitlangton.com) by
[Kit Langton](https://kitlangton.com) — the example sequence and most of the individual examples
are his. This repository rewrites them against the Vue bindings (`@effect/atom-vue`) and Effect v4,
and adds examples for runtimes, persistence, streams, refreshing, and writable derived atoms; any
mistakes in the translation are mine.
