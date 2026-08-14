# Effect Atom For Vue Developers

You already know `ref`, `computed`, `watch`, and probably Pinia. This page maps what you know onto
Effect Atom, and is honest about where the mapping stops. Read it once, then work through the tour
in `src/examples` — each example page repeats the relevant point in its own notes.

## The one-paragraph version

An **Atom** is a cell of state that lives in a **registry** rather than in a component. Reading an
atom subscribes to it; the subscription ends when the last reader goes away. An atom can hold a
plain value, or it can *be* an Effect — in which case its value is an **AsyncResult** describing
whether that Effect is still running, succeeded, or failed. Because atoms are values defined
outside the component tree, the same graph is testable in Node with no DOM at all.

## The mapping

| Vue                            | Effect Atom                        | Where it stops                                                          |
| ------------------------------ | ---------------------------------- | ----------------------------------------------------------------------- |
| `ref(0)`                       | `Atom.make(0)`                     | The atom is not owned by a component and outlives every reader           |
| `computed(() => a.value * 2)`  | `Atom.make((get) => get(a) * 2)`   | Dependencies are discovered by `get`, and the result is shared globally  |
| `computed({ get, set })`       | `Atom.writable(read, write)`       | The write decides which source atoms to set                             |
| `watch` + `AbortController`    | `Atom.make(Effect…)`               | Re-running interrupts the previous run for you                          |
| `data` / `loading` / `error`   | `AsyncResult` + `waiting`          | A union, so "loading and errored" cannot be represented                  |
| a store action                 | `Atom.fn`                          | Writing the argument runs it; the atom holds the latest result           |
| `provide` / `inject`           | `Atom.runtime(Layer)`              | Services reach atoms, not just components — including in Node tests      |
| a `useLocalStorage` composable | `Atom.kvs`                         | The backend is a Layer, so tests swap storage without touching a component |

## Four things that surprise people

### 1. Every composable takes a thunk

```ts
const [count, setCount] = useAtom(() => countAtom)
```

Not `useAtom(countAtom)`. The thunk is reactive, which is the whole point: an atom picked by
another atom's value resubscribes on its own.

```ts
const selected = useAtomValue(() => selectedAtom)
const [votes, setVotes] = useAtom(() => votesAtom(selected.value))
```

Selecting another key re-runs the thunk and moves the subscription. There is no watcher and no
manual teardown. See `src/examples/atom-family`.

### 2. There is no `useAtomRefresh`

The React bindings have one; the Vue bindings do not. Refreshing goes through the registry:

```ts
const registry = injectRegistry()
const refetch = () => registry.refresh(userAtom)
```

### 3. `useAtom` returns a pair, not an assignable ref

```ts
const [count, setCount] = useAtom(() => countAtom)

count.value = 1 // no
setCount(1) // yes
setCount((current) => current + 1) // also yes
```

`count` is a readonly ref for the template. Every write goes through the setter.

### 4. An unsubscribed atom resets

When the last subscriber goes away, an atom is disposed and comes back at its initial value. That
is right for a query and wrong for a running tally — use `Atom.keepAlive` when you mean the state
to survive. `src/examples/atom-family` depends on exactly this.

## The registry

Atoms are definitions. A registry is where their values actually live, so the same atom can hold
different values in two registries at once.

Each routed page provides and disposes its own:

```ts
const registry = AtomRegistry.make()
provide(registryKey, registry)
onUnmounted(() => registry.dispose())
```

Without a provided registry everything falls back to the module-level `defaultRegistry`, which is
how state leaks between pages and between tests. In tests, always provide one explicitly —
`src/testing/mountWithRegistry.ts` does.

## Reading an AsyncResult

```vue
<div v-if="user._tag === 'Success'" :class="{ waiting: user.waiting }">{{ user.value.name }}</div>
<div v-else-if="user._tag === 'Failure'">{{ String(user.cause) }}</div>
<div v-else>Loading…</div>
```

`waiting` is orthogonal to the tag. A `Success` that is `waiting` is a stale value being
revalidated — render it dimmed rather than throwing away the screen. That is the behaviour a
data-fetching library gives you, and here it is the default.

For anything beyond three branches, `AsyncResult.match` and `AsyncResult.map` avoid unwrapping by
hand. See `src/examples/async-result-states`.

## Where to go next

Work through `src/examples` in the order `src/examples/registry.ts` lists them — it is a teaching
order, not an alphabetical one. Each directory holds its atoms, its components, and both of its
tests, so a single example is one folder with nothing hidden elsewhere.

For how the examples are tested, see [testing.md](./testing.md).
