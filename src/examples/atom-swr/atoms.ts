import { Atom } from '@effect/atom-vue'
import { Duration, Effect } from 'effect'

/** How long a loaded value counts as fresh. */
export const staleTime = Duration.seconds(5)

export interface Snapshot {
  /** Which load produced this value — the number a *respected* staleTime keeps flat. */
  readonly load: number
  readonly unread: number
}

const makeFetch = () => {
  let loads = 0

  return Effect.gen(function* () {
    yield* Effect.sleep('400 millis')
    loads += 1
    return { load: loads, unread: 3 + loads * 2 } satisfies Snapshot
  })
}

/**
 * `swr` needs to be told what "focus" means.
 *
 * `revalidateOnFocus` does nothing on its own — the combinator only subscribes
 * when a `focusSignal` is supplied too. The app passes `Atom.windowFocusSignal`,
 * which is browser-only; the Node spec passes a plain writable atom it can bump
 * on demand, which is the whole reason this is a factory.
 */
export const makeStatusAtoms = (options: { readonly focusSignal: Atom.Atom<unknown> }) => {
  // Refetches on focus only when the value has gone stale.
  const freshFirstAtom = Atom.make(makeFetch()).pipe(
    Atom.swr({
      staleTime,
      revalidateOnFocus: true,
      focusSignal: options.focusSignal,
    }),
  )

  // Refetches on every focus, however fresh the value is.
  const alwaysAtom = Atom.make(makeFetch()).pipe(
    Atom.swr({
      staleTime,
      revalidateOnFocus: 'always',
      focusSignal: options.focusSignal,
    }),
  )

  return { freshFirstAtom, alwaysAtom }
}

// The app watches the real thing: `windowFocusSignal` listens for
// `visibilitychange` and only counts a transition back to a visible document.
export const { freshFirstAtom, alwaysAtom } = makeStatusAtoms({
  focusSignal: Atom.windowFocusSignal,
})
