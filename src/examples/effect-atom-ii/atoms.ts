import { Atom, AsyncResult } from '@effect/atom-vue'
import { Effect, Random } from 'effect'

export const countAtom = Atom.make(3)

// An Effect atom gets the same `get` a plain derived atom does, so it can
// depend on other atoms. Changing `countAtom` interrupts the run in flight and
// starts a new one — the previous rolls stay on screen with `waiting` set
// until the new ones land.
export const diceAtom = Atom.make((get) =>
  Effect.gen(function* () {
    const count = get(countAtom)

    yield* Effect.sleep('800 millis')

    const rolls: Array<number> = []
    for (let i = 0; i < count; i++) {
      rolls.push(yield* Random.nextIntBetween(1, 6))
    }
    return rolls
  }),
)

// Deriving from an Effect atom is deriving from an AsyncResult. `AsyncResult.map`
// leaves Initial and Failure alone and rewrites only the success value, so the
// total inherits the roll's loading and error states for free.
export const totalAtom = Atom.make((get) =>
  AsyncResult.map(get(diceAtom), (rolls) => rolls.reduce((sum, roll) => sum + roll, 0)),
)
