import { Duration, Effect, Fiber } from 'effect'
import { TestClock } from 'effect/testing'

/**
 * Run an atom-reading Effect to completion on a controlled clock.
 *
 * The order matters, and it is the one thing that is easy to get wrong when
 * testing atoms with `TestClock`. `TestClock.adjust` only wakes fibers that are
 * *already* sleeping, and an atom's Effect does not start until something
 * subscribes and yields. Advancing the clock first therefore does nothing at
 * all: the atom stays `Initial` forever and the test times out.
 *
 * So: fork the read (which starts the atom and lets it reach its first sleep),
 * then advance, then join.
 *
 * Pass several durations to step the clock in stages. A single large jump is
 * not equivalent — a schedule that re-runs an atom, such as `Atom.withRefresh`,
 * needs the fiber to be woken once per interval.
 *
 * ```ts
 * const rolls = yield* settle(Atom.getResult(diceAtom), '800 millis')
 * ```
 *
 * To await a *subsequent* value rather than the first one, pass
 * `{ suspendOnWaiting: true }` to `Atom.getResult` — otherwise it returns the
 * value the atom already holds and the test asserts against stale state.
 */
export const settle = <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  ...durations: ReadonlyArray<Duration.Input>
) =>
  Effect.gen(function* () {
    const fiber = yield* Effect.forkChild(effect)

    for (const duration of durations) {
      yield* TestClock.adjust(duration)
    }

    return yield* Fiber.join(fiber)
  })
