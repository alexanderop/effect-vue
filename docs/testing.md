# Testing Effect Atom in Vue

This project follows the testing shape used by Effect itself, with one extra layer for Vue. The
goal is not to retest all of Effect Atom. It is to prove that our atom graphs are correct, our
Effects are deterministic, and the Vue adapter connects them to real user interactions.

## What upstream Effect does

The project is pinned to Effect's `4.0.0-rc.108` release tuple. The strategy below was checked
against upstream commit [`bef7bf3`](https://github.com/Effect-TS/effect/tree/bef7bf38ae4b73d5511043f707aed083de5da7cc):

- [`@effect/vitest`](https://github.com/Effect-TS/effect/blob/bef7bf38ae4b73d5511043f707aed083de5da7cc/packages/vitest/README.md)
  uses `it.effect` for scoped Effect tests. Every test receives test services such as `TestClock`
  and a fresh `Scope`; `it.live` is reserved for behavior that intentionally needs the live
  runtime.
- Effect's [core Atom suite](https://github.com/Effect-TS/effect/blob/bef7bf38ae4b73d5511043f707aed083de5da7cc/packages/effect/test/reactivity/Atom.test.ts)
  tests registry state, subscriptions, async results, streams, optimistic updates, persistence,
  and runtime disposal directly against `Atom` and `AtomRegistry`.
- The upstream [`@effect/atom-vue` test file](https://github.com/Effect-TS/effect/blob/bef7bf38ae4b73d5511043f707aed083de5da7cc/packages/atom/vue/test/index.test.ts)
  is still a placeholder. Vue applications therefore need their own focused adapter tests instead
  of assuming framework integration is covered upstream.

These findings are from the pinned source, not from examples written for an older Effect API.

## The test pyramid

| Layer                          | Runner                            | What belongs here                                                                                                               |
| ------------------------------ | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Atom and Effect contracts      | Vitest in Node + `@effect/vitest` | Derived state, atom families, typed failures, service layers, async transitions, interruption, and deterministic time/randomness |
| Vue adapter contracts          | Vitest Browser + Chromium         | Registry injection, composable subscriptions, shared/isolated registries, component updates, and cleanup                        |
| Routed application smoke tests | Vitest Browser + Chromium         | Navigation-level rendering and the most important user journeys                                                                 |

Node tests carry most of the behavior because they are fast and precise. Browser tests prove only
the Vue seam and visible workflows; they do not duplicate every Atom core law.

## Suite layout

Every example is one directory containing its atoms, its components, and both of its tests:

```text
src/examples/atom-family/
├── atoms.ts
├── atoms.node.spec.ts          # the atom graph, on a TestClock
├── AtomFamily.vue              # the root component
├── AtomFamily.browser.spec.ts  # one user workflow, real Chromium
├── AtomFamilySelector.vue
└── AtomFamilyVotes.vue

src/testing/                    # mounting, locators, clock helpers
src/__tests__/                  # only what no single example owns
├── node/features/              # cross-cutting Atom primitives
├── node/registry.node.spec.ts  # the tour itself
└── browser/integration/        # adapter and app-shell contracts
```

A test belongs in `src/__tests__` only when no single example owns the behavior — registry
isolation, the example registry, the page shell. Everything else lives next to the code it tests.

## The root component is the unit

Each example exposes a root component named after the example, and that is what its browser spec
mounts:

```ts
const mounted = mountWithRegistry(AtomFamily, { label: 'Atom Family' })
const votes = panel('Votes')
```

No slug, no router, no glob — the real component tree with a registry that belongs to the test.
`BasePanel` turns each panel's `label` into the accessible name of a `region`, so `panel('Votes')`
finds the same thing a screen reader would. Locators therefore survive restyling, and a renamed
panel breaks the test loudly instead of silently matching nothing.

## Rules used in this repository

1. Use `it.effect` for any test whose subject returns an `Effect`.
2. Provide `AtomRegistry.layer` explicitly in Node tests. It creates a fresh registry and disposes
   it when the test scope closes.
3. Create and provide a fresh `AtomRegistry` for every independent Vue mount. Never rely on
   `defaultRegistry` in a test.
4. Use `TestClock` for `Effect.sleep`, schedules, retries, and streams — through `settle`, and read
   the ordering rule below before writing one by hand.
5. Seed `Random` when the values matter, and otherwise assert domain invariants rather than one
   lucky roll.
6. Use `Deferred`, `Latch`, `Queue`, or another semantic signal for concurrent work. Do not add
   arbitrary sleeps or polling loops to tests.
7. Use role, label, and visible-text locators in browser tests. Assert what a user can observe, not
   Vue component internals.
8. Do not call public network services in the deterministic suite. Put the transport behind a
   service/layer, or stub it at its boundary and restore it afterwards.
9. Name Node tests `*.node.spec.ts` and browser tests `*.browser.spec.ts`. The Vitest projects use
   those suffixes as the only routing rule; a test must not depend on an implicit fallback.
10. Give every example one meaningful browser workflow and one Node spec for its atom graph. Cover
    the initial visible state and the primary interaction in the browser, and keep edge cases and
    state-machine laws in Node.
11. When an example keeps module-level mutable state, write one ordered flow rather than several
    tests that silently inherit each other's leftovers.

Browser files run sequentially because the examples intentionally contain module-scoped atoms and
in-memory service state.

## Representative patterns

A pure Atom graph uses the registry as an Effect service:

```ts
it.effect('recomputes derived state', () =>
  Effect.gen(function* () {
    yield* Atom.set(countAtom, 4)
    assert.strictEqual(yield* Atom.get(doubledAtom), 8)
  }).pipe(Effect.provide(AtomRegistry.layer)),
)
```

### Time: fork first, then advance

This is the one thing that costs an afternoon if you get it wrong. `TestClock.adjust` only wakes
fibers that are **already sleeping**, and an atom's Effect does not start until something
subscribes and yields. Advance the clock first and the atom stays `Initial` forever:

```ts
yield* Atom.mount(feedAtom)
yield* TestClock.adjust('500 millis')
yield* Atom.get(feedAtom) // still Initial — the fiber never started
```

`src/testing/settle.ts` encodes the correct order — fork the read, advance, join:

```ts
const rolls = yield* settle(Atom.getResult(diceAtom), '800 millis')
```

Two follow-on rules:

- To await a **subsequent** value rather than the first, pass `{ suspendOnWaiting: true }` to
  `Atom.getResult`. Without it you get the value the atom already holds and assert against stale
  state.
- A schedule that re-runs an atom, such as `Atom.withRefresh`, needs the clock **stepped** once per
  interval. One large jump produces one run. `settle` takes several durations for this:

  ```ts
  const prices = yield* settle(
    Atom.toStreamResult(autoPriceAtom).pipe(Stream.take(2), Stream.runCollect),
    '600 millis',
    '3 seconds',
    '600 millis',
  )
  ```

`Atom.toStreamResult` is the clean way to assert a sequence of emissions from a stream-backed or
auto-refreshing atom.

### Randomness

Prefer Effect's `Random` service over `Math.random` in example code — it is what makes the outcome
pinnable from a test:

```ts
}).pipe(Random.withSeed('effect-vue-quote'), Effect.provide(AtomRegistry.layer))
```

When the value genuinely should not matter, assert the contract instead:

```ts
assert.match(price, /^\d+\.\d{2}$/)
```

### Layers make an example testable

`src/examples/persisted-atom` exports a factory over its storage Layer, so the app wires
`layerStorage(() => localStorage)` and the Node spec wires `layerMemory` — the same atoms, no
component involved:

```ts
const { nameAtom, themeAtom } = makeSettingsAtoms(Atom.runtime(KeyValueStore.layerMemory))
```

Its browser spec still exercises real `localStorage`, so both halves of the claim are covered.

## Commands

```sh
npm run test:node
npm run test:browser
npm test
npm run type-check
```

Run Node tests while changing an atom or Effect. Run the focused browser project when changing a
Vue component or composable boundary. Run the complete suite and type-check before publishing.
