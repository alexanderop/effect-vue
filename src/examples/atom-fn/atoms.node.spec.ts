import { assert, describe, it } from '@effect/vitest'
import { Atom, AtomRegistry } from '@effect/atom-vue'
import { Effect, Fiber, Random } from 'effect'
import { TestClock } from 'effect/testing'

import { rollDiceAtom, totalAtom } from './atoms'

describe('Atom.fn', () => {
  it.effect('runs on write and derives a total from the result', () =>
    Effect.gen(function* () {
      yield* Atom.mount(rollDiceAtom)
      yield* Atom.mount(totalAtom)

      yield* Atom.set(rollDiceAtom, undefined)
      const fiber = yield* Atom.getResult(rollDiceAtom).pipe(Effect.forkChild)
      yield* TestClock.adjust('800 millis')
      const rolls = yield* Fiber.join(fiber)

      assert.lengthOf(rolls, 3)
      assert.isTrue(rolls.every((roll) => roll >= 1 && roll <= 6))

      const total = yield* Atom.getResult(totalAtom)
      assert.strictEqual(
        total,
        rolls.reduce((sum, roll) => sum + roll, 0),
      )
    }).pipe(Random.withSeed('effect-vue-atom-fn'), Effect.provide(AtomRegistry.layer)),
  )
})
