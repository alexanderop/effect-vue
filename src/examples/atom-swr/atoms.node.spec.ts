import { assert, describe, it } from '@effect/vitest'
import { Atom, AtomRegistry } from '@effect/atom-vue'
import { Effect } from 'effect'

import { settle } from '@/testing/settle'

import { makeStatusAtoms } from './atoms'

describe('Stale-While-Revalidate', () => {
  it.effect('revalidates on focus only once the value is stale', () =>
    Effect.gen(function* () {
      // A plain writable atom stands in for `Atom.windowFocusSignal`: the
      // combinator only cares that the signal changed, not where it came from.
      const focusSignal = Atom.make(0)
      const { alwaysAtom, freshFirstAtom } = makeStatusAtoms({ focusSignal })

      yield* Atom.mount(freshFirstAtom)
      yield* Atom.mount(alwaysAtom)

      const fresh = yield* settle(Atom.getResult(freshFirstAtom), '400 millis')
      const always = yield* settle(Atom.getResult(alwaysAtom), '400 millis')
      assert.strictEqual(fresh.load, 1)
      assert.strictEqual(always.load, 1)

      yield* Atom.set(focusSignal, 1)

      // "always" ignores staleTime and refetches.
      const alwaysAgain = yield* settle(
        Atom.getResult(alwaysAtom, { suspendOnWaiting: true }),
        '400 millis',
      )
      assert.strictEqual(alwaysAgain.load, 2)

      // Staleness is measured against the wall clock, which a TestClock does not
      // move — so the other atom is still inside its five-second window and the
      // focus was ignored outright.
      assert.strictEqual(yield* Atom.getResult(freshFirstAtom), fresh)
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )

  it.effect('forwards a manual refresh even while the value is fresh', () =>
    Effect.gen(function* () {
      const focusSignal = Atom.make(0)
      const { freshFirstAtom } = makeStatusAtoms({ focusSignal })

      yield* Atom.mount(freshFirstAtom)

      const first = yield* settle(Atom.getResult(freshFirstAtom), '400 millis')
      assert.strictEqual(first.load, 1)

      yield* Atom.refresh(freshFirstAtom)

      const second = yield* settle(
        Atom.getResult(freshFirstAtom, { suspendOnWaiting: true }),
        '400 millis',
      )
      assert.strictEqual(second.load, 2)
      assert.strictEqual(second.unread, 7)
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )
})
