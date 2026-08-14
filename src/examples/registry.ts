import type { Component } from 'vue'

import AsyncResultStates from './async-result-states/AsyncResultStates.vue'
import AtomDebounce from './atom-debounce/AtomDebounce.vue'
import AtomFamily from './atom-family/AtomFamily.vue'
import AtomFn from './atom-fn/AtomFn.vue'
import AtomOptimistic from './atom-optimistic/AtomOptimistic.vue'
import AtomPull from './atom-pull/AtomPull.vue'
import AtomRef from './atom-ref/AtomRef.vue'
import AtomRefresh from './atom-refresh/AtomRefresh.vue'
import AtomRuntime from './atom-runtime/AtomRuntime.vue'
import AtomSwr from './atom-swr/AtomSwr.vue'
import BasicAtom from './basic-atom/BasicAtom.vue'
import DerivedAtom from './derived-atom/DerivedAtom.vue'
import DerivedAtomMultiSource from './derived-atom-multi-source/DerivedAtomMultiSource.vue'
import EffectAtom from './effect-atom/EffectAtom.vue'
import EffectfulAtom from './effectful-atom/EffectfulAtom.vue'
import EffectfulAtomFetch from './effectful-atom-fetch/EffectfulAtomFetch.vue'
import FilteredTodos from './filtered-todos/FilteredTodos.vue'
import GetResult from './get-result/GetResult.vue'
import PersistedAtom from './persisted-atom/PersistedAtom.vue'
import SearchParam from './search-param/SearchParam.vue'
import StreamAtom from './stream-atom/StreamAtom.vue'
import StreamingSearch from './streaming-search/StreamingSearch.vue'
import TodoList from './todo-list/TodoList.vue'
import WritableDerivedAtom from './writable-derived-atom/WritableDerivedAtom.vue'

/**
 * One entry per routed example, in teaching order.
 *
 * `component` is the example's root component — the same one its browser spec
 * mounts. Importing it here rather than resolving a name through a glob means a
 * missing or misnamed file is a build error, not a runtime throw.
 *
 * `effectNote` and `vueNote` are the teaching layer: what the example shows
 * about Effect, and what a Vue developer should notice about the binding.
 */
export interface Example {
  readonly slug: string
  readonly title: string
  readonly blurb: string
  readonly api: ReadonlyArray<string>
  readonly effectNote: string
  readonly vueNote: string
  readonly component: Component
}

export const examples: ReadonlyArray<Example> = [
  {
    slug: 'basic-atom',
    title: 'Basic Atom',
    blurb: 'Create reactive state with Atom.make() and read it with useAtom.',
    api: ['Atom.make', 'useAtom'],
    effectNote:
      'An Atom is a named cell of state that lives in a registry rather than in a component. ' +
      'Nothing runs until something subscribes, and the value survives the components that read it.',
    vueNote:
      'useAtom returns a [value, setValue] pair, not a ref you assign to. The value is a readonly ' +
      'ref for the template; every write goes through the setter, which also accepts an updater ' +
      'function the way Vue never needs to for a plain ref.',
    component: BasicAtom,
  },
  {
    slug: 'derived-atom',
    title: 'Derived Atom',
    blurb: 'Derive read-only values that stay in sync with their source atom.',
    api: ['Atom.make', 'useAtomValue'],
    effectNote:
      'Passing a read function to Atom.make builds a derived atom. Whatever it touches through ' +
      '`get` becomes a dependency, so the graph is discovered at read time instead of declared.',
    vueNote:
      'This is computed(), with one difference that matters: the dependency lives in the registry, ' +
      'so two components in two different Vue trees can share one derivation.',
    component: DerivedAtom,
  },
  {
    slug: 'derived-atom-multi-source',
    title: 'Derived Atom, Multiple Sources',
    blurb: 'A derived atom recomputes when any of the atoms it reads changes.',
    api: ['Atom.make', 'useAtomValue'],
    effectNote:
      '`get` subscribes to every atom it touches during the read. Two sources, one subscription, ' +
      'and no dependency array to keep correct by hand.',
    vueNote:
      'The consuming component names only the derived atom. It never imports the two source atoms, ' +
      'which is what keeps a growing graph from leaking into every template.',
    component: DerivedAtomMultiSource,
  },
  {
    slug: 'writable-derived-atom',
    title: 'Writable Derived Atom',
    blurb: 'A derived atom that also writes back through to its source.',
    api: ['Atom.writable', 'useAtom'],
    effectNote:
      'Atom.writable takes a read function and a write function. The write receives a context and ' +
      'decides which source atoms to set, so a two-way conversion stays in one place.',
    vueNote:
      'The equivalent Vue pattern is a computed with a getter and a setter. The difference is that ' +
      'both panels here subscribe independently and neither owns the state.',
    component: WritableDerivedAtom,
  },
  {
    slug: 'atom-family',
    title: 'Atom Family',
    blurb: 'One atom per key, created on demand and cached.',
    api: ['Atom.family', 'Atom.withLabel', 'useAtom'],
    effectNote:
      'Atom.family turns a key into an atom. Each key gets its own independent state, atoms are ' +
      'built on first use, and the cache holds them weakly so unused keys can be collected.',
    vueNote:
      'This is where the thunk earns its keep. Because useAtom(() => votesAtom(selected.value)) is ' +
      'reactive, picking another key resubscribes on its own — no watcher, no manual teardown.',
    component: AtomFamily,
  },
  {
    slug: 'effect-atom',
    title: 'Atom From An Effect',
    blurb: 'Run an Effect as an atom and refresh it on demand.',
    api: ['Atom.make', 'useAtomValue', 'injectRegistry'],
    effectNote:
      'An atom built from an Effect runs when it is first mounted and is interrupted when the last ' +
      'subscriber goes away. Its value is an AsyncResult rather than the success type.',
    vueNote:
      'There is no useAtomRefresh in the Vue bindings. Refreshing goes through the registry: ' +
      'injectRegistry().refresh(atom).',
    component: EffectAtom,
  },
  {
    slug: 'async-result-states',
    title: 'AsyncResult States',
    blurb: 'Match on Initial, Success, and Failure — plus the waiting flag.',
    api: ['AsyncResult.match', 'AsyncResult.error', 'Schema.TaggedError'],
    effectNote:
      'AsyncResult is a tagged union, and `waiting` is orthogonal to it. A successful value can be ' +
      'waiting on a refresh, which is how a stale value stays on screen instead of flashing a spinner.',
    vueNote:
      'This replaces the data/loading/error triple most Vue apps hand-roll. The union makes the ' +
      'impossible combinations — loading and errored at once — unrepresentable in the template.',
    component: AsyncResultStates,
  },
  {
    slug: 'effectful-atom',
    title: 'Effectful Atom',
    blurb: 'An Effect atom reruns its async work when a source atom changes.',
    api: ['Atom.make', 'AsyncResult.map', 'Effect.fn'],
    effectNote:
      'Reading a source atom inside the Effect makes the whole run reactive. Change the count and ' +
      'the in-flight roll is interrupted and restarted — cancellation you did not have to write.',
    vueNote:
      'watch() plus an abort controller is the usual Vue shape for this. Here interruption is the ' +
      'default, and the derived total maps over the AsyncResult without unwrapping it first.',
    component: EffectfulAtom,
  },
  {
    slug: 'effectful-atom-fetch',
    title: 'Effectful Atom, Real Request',
    blurb: 'Fetch and decode live data whenever the selected city changes.',
    api: ['Effect.tryPromise', 'Schema.decodeUnknownEffect'],
    effectNote:
      'Effect.tryPromise hands the fetch an AbortSignal, so interruption cancels the request itself. ' +
      'The response is decoded through a Schema, so an unexpected shape is a typed failure.',
    vueNote:
      'The component never sees a promise, an abort controller, or a cast. It renders three branches ' +
      'of an AsyncResult and the request lifecycle stays in the atom.',
    component: EffectfulAtomFetch,
  },
  {
    slug: 'atom-debounce',
    title: 'Debounced Atom',
    blurb: 'Republish a fast-changing atom only once it settles.',
    api: ['Atom.debounce', 'useAtom'],
    effectNote:
      'debounce derives an atom that mirrors its source after a quiet window. The search reads the ' +
      'derived atom, so a burst of keystrokes produces one run instead of one per character.',
    vueNote:
      'The usual Vue shape is a watcher plus a timer ref plus a clear in onUnmounted. Here the ' +
      'timer belongs to the atom, and disposing the atom clears it.',
    component: AtomDebounce,
  },
  {
    slug: 'atom-fn',
    title: 'Atom.fn',
    blurb: 'Trigger an Effect with an argument and expose its result as an atom.',
    api: ['Atom.fn', 'useAtom', 'useAtomSet'],
    effectNote:
      'Atom.fn is the write-to-run atom: writing an argument starts the Effect, and the atom holds ' +
      'the AsyncResult of the latest run. It is the mutation half of the model.',
    vueNote:
      'useAtom gives you [result, run] from one call, so the button that triggers the work and the ' +
      'panel that shows it can be separate components with no props between them.',
    component: AtomFn,
  },
  {
    slug: 'atom-runtime',
    title: 'Atom.runtime',
    blurb: 'Build a Layer once and provide its services to every atom made from it.',
    api: ['Atom.runtime', 'Context.Service', 'Layer.effect'],
    effectNote:
      'Atom.runtime builds the Layer lazily, once, and releases it when nothing subscribes. Atoms ' +
      'created from the runtime get the services in their environment.',
    vueNote:
      'This is dependency injection that provide/inject cannot do: the same service graph is ' +
      'available to atoms tested in Node, with no component tree involved.',
    component: AtomRuntime,
  },
  {
    slug: 'get-result',
    title: 'get.result',
    blurb: 'Combine independent async results and choose whether stale values may be reused.',
    api: ['get.result', 'suspendOnWaiting'],
    effectNote:
      'get.result unwraps a dependency inside the Effect: the run suspends until it succeeds and ' +
      'inherits its failure if it does not. suspendOnWaiting decides what a stale dependency means.',
    vueNote:
      'Toggle the flag and watch the rate briefly mix a new lifespan with an old book count. That ' +
      'inconsistency is the one a hand-written combination of two loading flags produces silently.',
    component: GetResult,
  },
  {
    slug: 'atom-refresh',
    title: 'Refresh And Revalidate',
    blurb: 'Refresh an atom by hand, or on a timer, without losing the current value.',
    api: ['Atom.withRefresh', 'injectRegistry'],
    effectNote:
      'Atom.withRefresh reruns an atom on a schedule for as long as it is mounted. The previous ' +
      'value stays put and `waiting` turns on while the next run is in flight.',
    vueNote:
      'The stale-while-revalidate behaviour most Vue apps reach for a data library to get is the ' +
      'default here, and it is a single pipe on the atom rather than a wrapper around the component.',
    component: AtomRefresh,
  },
  {
    slug: 'atom-swr',
    title: 'Stale-While-Revalidate',
    blurb: 'Serve the cached value, and refetch on focus only once it is stale.',
    api: ['Atom.swr', 'Atom.windowFocusSignal'],
    effectNote:
      'swr adds a freshness window on top of an async atom. Automatic revalidation is skipped ' +
      'inside staleTime; a manual refresh always forwards to the source regardless.',
    vueNote:
      'This is the part of a data library people usually install one for. revalidateOnFocus needs ' +
      'a focusSignal to watch, which is what makes the behaviour testable without a real window.',
    component: AtomSwr,
  },
  {
    slug: 'stream-atom',
    title: 'Stream Atom',
    blurb: 'An atom backed by a Stream emits every value the Stream produces.',
    api: ['Stream.fromSchedule', 'Atom.make'],
    effectNote:
      'The subscription starts on mount and is interrupted when the last subscriber unmounts, so ' +
      'navigating away really does stop the clock. No interval to clear.',
    vueNote:
      'Deriving from a stream-backed atom is the same as deriving from any other atom, which is why ' +
      'the elapsed panel does not know it is reading a stream.',
    component: StreamAtom,
  },
  {
    slug: 'atom-pull',
    title: 'Atom.pull',
    blurb: 'Consume a Stream one chunk at a time — pagination with no state machine.',
    api: ['Atom.pull', 'Stream.paginate'],
    effectNote:
      'The first chunk is pulled on mount and each write pulls the next. Items accumulate and `done` ' +
      'reports when the Stream is exhausted.',
    vueNote:
      'The load-more button writes `void` to the atom. Page number, accumulated items, and the ' +
      'end-of-list flag all stay out of the component.',
    component: AtomPull,
  },
  {
    slug: 'atom-optimistic',
    title: 'Atom.optimistic',
    blurb: 'Update instantly, track the mutation, and roll back when the Effect fails.',
    api: ['Atom.optimistic', 'Atom.optimisticFn'],
    effectNote:
      'The reducer applies the expected result immediately; the fn runs the real mutation. A failure ' +
      'discards the optimistic value automatically — the rollback is not something you write.',
    vueNote:
      'Turn on failure simulation and watch the count snap back. Doing this by hand in Vue means ' +
      'keeping a shadow copy of the state and remembering to restore it on every error path.',
    component: AtomOptimistic,
  },
  {
    slug: 'persisted-atom',
    title: 'Persisted Atom',
    blurb: 'Back an atom with a KeyValueStore and a Schema.',
    api: ['Atom.kvs', 'KeyValueStore', 'Schema'],
    effectNote:
      'Reads and writes go through the store, encoded with the schema. Swap layerStorage for ' +
      'layerMemory in a test and nothing else changes.',
    vueNote:
      'Compared with a localStorage composable, the encoding is typed and the storage backend is a ' +
      'Layer — which is what makes the same atom testable in Node.',
    component: PersistedAtom,
  },
  {
    slug: 'search-param',
    title: 'URL Search Params',
    blurb: 'Read and write query parameters as atoms, schema and all.',
    api: ['Atom.searchParam', 'Schema.NumberFromString', 'get.setSelf'],
    effectNote:
      'searchParam is a writable atom over one query parameter. With a schema it holds an Option, ' +
      'so an absent or unparseable value is a case in the type rather than a sentinel.',
    vueNote:
      'The components never touch the router. Deep links, the back button, and shareable URLs come ' +
      'from the atom, which is a different seam than useRoute/useRouter gives you.',
    component: SearchParam,
  },
  {
    slug: 'atom-ref',
    title: 'AtomRef',
    blurb: 'Local observable state with no registry behind it.',
    api: ['AtomRef.make', 'AtomRef.collection', 'useAtomRef'],
    effectNote:
      'An AtomRef is a standalone cell: read it, map it, narrow it to a property, subscribe to it. ' +
      'A collection holds one ref per item and reports inserts, removals, and item changes.',
    vueNote:
      'This is the fourth Vue composable and the only one that never injects a registry. Reach for ' +
      'it when state is genuinely local and the atom graph would be ceremony.',
    component: AtomRef,
  },
  {
    slug: 'todo-list',
    title: 'Todo List',
    blurb: 'Service state, Atom.runtime, Atom.family, and reactive CRUD mutations.',
    api: ['Atom.runtime', 'Atom.family', 'Atom.withReactivity'],
    effectNote:
      'The service owns the data; atoms are views onto it. Reactivity keys tell the registry which ' +
      'queries a mutation invalidates, so a create refreshes the list without a manual refetch.',
    vueNote:
      'Each row subscribes to its own atom from the family, so toggling one todo rerenders one row. ' +
      'That granularity comes from the atom graph, not from memoizing components.',
    component: TodoList,
  },
  {
    slug: 'filtered-todos',
    title: 'Filtered Todos',
    blurb: 'Derive a filtered list from service data and local filter state.',
    api: ['AsyncResult.map', 'Atom.make'],
    effectNote:
      'The filter is a plain atom and the list is service-backed. Combining them derives the view ' +
      'without asking the service again.',
    vueNote:
      'The filter buttons and the list are siblings with no shared parent state. In a props-and-emits ' +
      'design this is the point where a store usually appears.',
    component: FilteredTodos,
  },
  {
    slug: 'streaming-search',
    title: 'Streaming Search',
    blurb: 'Compare Stream.scan, Atom.pull, and manual state for streaming results.',
    api: ['Stream.scan', 'Atom.pull', 'Atom.fn'],
    effectNote:
      'Three ways to land streamed results in state: accumulate inside the stream, pull on demand, ' +
      'or write each element into a separate atom as it arrives.',
    vueNote:
      'Compare the three panels for how much state each leaves in the component. The scan pattern ' +
      'leaves none.',
    component: StreamingSearch,
  },
]

const bySlug = new Map(examples.map((example) => [example.slug, example]))

export const getExample = (slug: string): Example | undefined => bySlug.get(slug)

export const exampleIndex = (slug: string): number =>
  examples.findIndex((example) => example.slug === slug)
