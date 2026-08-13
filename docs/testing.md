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

| Layer | Runner | What belongs here |
| --- | --- | --- |
| Atom and Effect contracts | Vitest in Node + `@effect/vitest` | Derived state, atom families, typed failures, service layers, async transitions, interruption, and deterministic time/randomness |
| Vue adapter contracts | Vitest Browser + Chromium | Registry injection, composable subscriptions, shared/isolated registries, component updates, and cleanup |
| Routed application smoke tests | Vitest Browser + Chromium | Navigation-level rendering and the most important user journeys |

Node tests should carry most of the behavior because they are fast and precise. Browser tests
should prove only the Vue seam and visible workflows; they should not duplicate every Atom core
law.

## Rules used in this repository

1. Use `it.effect` for any test whose subject returns an `Effect`.
2. Provide `AtomRegistry.layer` explicitly in Node tests. It creates a fresh registry and disposes
   it when the test scope closes.
3. Create and provide a fresh `AtomRegistry` for every independent Vue mount. Never rely on
   `defaultRegistry` in a test.
4. Use `TestClock.adjust` for `Effect.sleep`, schedules, retries, and streams. Fork the work before
   advancing the clock.
5. Seed `Random` when the values matter, and otherwise assert domain invariants rather than one
   lucky roll.
6. Use `Deferred`, `Latch`, `Queue`, or another semantic signal for concurrent work. Do not add
   arbitrary sleeps or polling loops to tests.
7. Use role, label, and visible-text locators in browser tests. Assert what a user can observe, not
   Vue component internals.
8. Do not call public network services in the deterministic suite. Put the transport behind a
   service/layer and provide a test implementation when a network example gains business logic.

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

Time is controlled rather than awaited in real time:

```ts
it.effect('finishes after 800 ms', () =>
  Effect.gen(function* () {
    const fiber = yield* rollDice(3).pipe(Effect.forkChild)
    yield* TestClock.adjust('800 millis')
    assert.lengthOf(yield* Fiber.join(fiber), 3)
  }),
)
```

Vue tests mount with an explicit registry and use browser locators. The shared helper in
`src/__tests__/support/mountWithRegistry.ts` owns unmounting and registry disposal.

## Commands

```sh
npm run test:node
npm run test:browser
npm test
npm run type-check
```

Run Node tests while changing an atom or Effect. Run the focused browser project when changing a
Vue component or composable boundary. Run the complete suite and type-check before publishing.
