import { Effect, Random } from 'effect'

export const rollDice = Effect.fn('Dice.roll')(function* (count: number) {
  yield* Effect.sleep('800 millis')

  const rolls: Array<number> = []
  for (let index = 0; index < count; index++) {
    rolls.push(yield* Random.nextIntBetween(1, 6))
  }
  return rolls
})
