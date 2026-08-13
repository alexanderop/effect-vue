import { Atom, AsyncResult } from '@effect/atom-vue'
import { Effect, Random } from 'effect'

export const rollDiceAtom = Atom.fn(
  Effect.fn('rollDice')(function* () {
    yield* Effect.sleep('800 millis')

    const rolls: Array<number> = []
    for (let index = 0; index < 3; index++) {
      rolls.push(yield* Random.nextIntBetween(1, 6))
    }
    return rolls
  }),
)

export const totalAtom = Atom.make((get) =>
  AsyncResult.map(get(rollDiceAtom), (rolls) => rolls.reduce((sum, roll) => sum + roll, 0)),
)
