import { assert, describe, it } from '@effect/vitest'
import { Atom, AtomRegistry } from '@effect/atom-vue'
import { Effect, Fiber, Random } from 'effect'
import { TestClock } from 'effect/testing'

import { countAtom, doubledAtom } from '../examples/derived-atom-i/atoms'
import { rollDice } from '../examples/effectful-atom/rollDice'

describe('example atoms in Node', () => {
  it.effect('recomputes a derived atom after its source changes', () =>
    Effect.gen(function* () {
      assert.strictEqual(yield* Atom.get(countAtom), 0)
      assert.strictEqual(yield* Atom.get(doubledAtom), 0)

      yield* Atom.set(countAtom, 4)

      assert.strictEqual(yield* Atom.get(doubledAtom), 8)
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )

  it.effect('controls dice latency and randomness without waiting in real time', () =>
    Effect.gen(function* () {
      const fiber = yield* rollDice(3).pipe(
        Random.withSeed('effect-vue-dice'),
        Effect.forkChild,
      )

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
