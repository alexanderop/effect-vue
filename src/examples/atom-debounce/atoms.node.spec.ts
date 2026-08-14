import { assert, describe, it } from '@effect/vitest'
import { Atom, AtomRegistry } from '@effect/atom-vue'
import { Duration, Effect } from 'effect'
import { afterEach, vi } from 'vitest'

import { settle } from '@/testing/settle'

import { debounceWindow, makeSearchAtoms } from './atoms'

const windowMillis = Duration.toMillis(debounceWindow)

/** Waits out the debounce on the real clock, which is the only one it listens to. */
const flushDebounce = Effect.promise(
  () => new Promise((resolve) => setTimeout(resolve, windowMillis + 50)),
)

afterEach(() => {
  vi.useRealTimers()
})

describe('Debounced Atom', () => {
  it.effect('publishes the source only after it stops changing', () =>
    Effect.gen(function* () {
      // `Atom.debounce` schedules with a real `setTimeout`, so `TestClock` cannot
      // move it — Vitest's fake timers can. Only the timer functions are faked;
      // replacing the microtask queue too would stall Effect's own scheduler.
      // This test stays synchronous for exactly that reason.
      yield* Effect.sync(() => vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] }))

      const { debouncedQueryAtom, queryAtom } = makeSearchAtoms()

      yield* Atom.mount(debouncedQueryAtom)

      // The current value is used immediately — the first read waits for nothing.
      assert.strictEqual(yield* Atom.get(debouncedQueryAtom), '')

      yield* Atom.set(queryAtom, 'S')
      yield* Effect.sync(() => vi.advanceTimersByTime(windowMillis - 1))
      assert.strictEqual(yield* Atom.get(debouncedQueryAtom), '')

      // A keystroke inside the window restarts it rather than extending it.
      yield* Atom.set(queryAtom, 'St')
      yield* Effect.sync(() => vi.advanceTimersByTime(windowMillis - 1))
      assert.strictEqual(yield* Atom.get(debouncedQueryAtom), '')

      yield* Effect.sync(() => vi.advanceTimersByTime(1))
      assert.strictEqual(yield* Atom.get(debouncedQueryAtom), 'St')
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )

  it.effect('runs one search for a burst of keystrokes', () =>
    Effect.gen(function* () {
      const { queryAtom, resultsAtom } = makeSearchAtoms()

      yield* Atom.mount(resultsAtom)

      // The initial empty query is a search of its own, and it is the one the
      // burst below has to avoid multiplying.
      const initial = yield* settle(Atom.getResult(resultsAtom), '500 millis')
      assert.strictEqual(initial.run, 1)

      yield* Atom.set(queryAtom, 'A')
      yield* Atom.set(queryAtom, 'At')
      yield* Atom.set(queryAtom, 'Ato')

      // Real timers here: the search's own latency is still virtual, but the
      // debounce is not, so the two clocks have to be advanced separately.
      yield* flushDebounce

      const outcome = yield* settle(
        Atom.getResult(resultsAtom, { suspendOnWaiting: true }),
        '500 millis',
      )

      assert.strictEqual(outcome.query, 'Ato')
      assert.strictEqual(outcome.run, 2)
      assert.deepStrictEqual(outcome.matches, ['Atom', 'AtomRef', 'AtomRegistry'])
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )
})
