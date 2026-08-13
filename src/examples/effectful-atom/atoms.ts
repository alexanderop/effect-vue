import { Atom, AsyncResult } from '@effect/atom-vue'
import { Effect, Random } from 'effect'

export const countAtom = Atom.make(3)

export const diceAtom = Atom.make((get) =>
  Effect.gen(function* () {
    const count = get(countAtom)
    yield* Effect.sleep('800 millis')

    const rolls: Array<number> = []
    for (let index = 0; index < count; index++) {
      rolls.push(yield* Random.nextIntBetween(1, 7))
    }
    return rolls
  }),
)

export const totalAtom = Atom.make((get) =>
  AsyncResult.map(get(diceAtom), (rolls) => rolls.reduce((sum, roll) => sum + roll, 0)),
)
