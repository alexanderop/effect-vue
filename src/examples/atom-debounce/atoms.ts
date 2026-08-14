import { Atom } from '@effect/atom-vue'
import { Duration, Effect } from 'effect'

/**
 * Exported so the spec advances timers by exactly the window the atom waits.
 *
 * `Atom.debounce` uses a real `setTimeout`, not the Effect clock, which is why
 * the Node spec reaches for Vitest's fake timers rather than `TestClock`.
 */
export const debounceWindow = Duration.millis(400)

const searchLatency = Duration.millis(500)

export const modules: ReadonlyArray<string> = [
  'Effect',
  'Stream',
  'Schedule',
  'Schema',
  'Scope',
  'Layer',
  'Duration',
  'Option',
  'Exit',
  'Atom',
  'AtomRef',
  'AtomRegistry',
  'AsyncResult',
]

export interface SearchOutcome {
  readonly query: string
  readonly matches: ReadonlyArray<string>
  /** Which search this was — the number a burst of keystrokes is meant not to grow. */
  readonly run: number
}

/**
 * Built by a factory so each test gets its own run counter.
 *
 * The app uses the module-level instance below; a spec that asserts on exact
 * run numbers builds a fresh graph instead of inheriting the app's.
 */
export const makeSearchAtoms = () => {
  let runs = 0

  const queryAtom = Atom.make('')

  // `debounce` republishes the source only once it has been quiet for the whole
  // window. The current value is used immediately, so the first read never waits
  // on a timer, and a pending timer is cleared when the atom is disposed.
  const debouncedQueryAtom = queryAtom.pipe(Atom.debounce(debounceWindow))

  const resultsAtom = Atom.make((get) =>
    Effect.gen(function* () {
      const query = get(debouncedQueryAtom).trim()
      yield* Effect.sleep(searchLatency)

      runs += 1

      return {
        query,
        matches:
          query === ''
            ? []
            : modules.filter((name) => name.toLowerCase().includes(query.toLowerCase())),
        run: runs,
      } satisfies SearchOutcome
    }),
  )

  return { queryAtom, debouncedQueryAtom, resultsAtom }
}

export const { queryAtom, debouncedQueryAtom, resultsAtom } = makeSearchAtoms()
