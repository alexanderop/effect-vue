import { assert, describe, it } from '@effect/vitest'
import { Effect, Fiber, Random } from 'effect'
import { TestClock } from 'effect/testing'

import { rollDice } from '../../../examples/effectful-atom/rollDice'

describe('Effectful Atom page model', () => {
  it.effect('controls dice latency and randomness without waiting in real time', () =>
    Effect.gen(function* () {
      const fiber = yield* rollDice(3).pipe(Random.withSeed('effect-vue-dice'), Effect.forkChild)

      assert.isUndefined(fiber.pollUnsafe())
      yield* TestClock.adjust('799 millis')
      assert.isUndefined(fiber.pollUnsafe())

      yield* TestClock.adjust('1 millis')
      const rolls = yield* Fiber.join(fiber)

      assert.strictEqual(rolls.length, 3)
      assert.isTrue(rolls.every((roll) => roll >= 1 && roll <= 6))
    }),
  )
})
