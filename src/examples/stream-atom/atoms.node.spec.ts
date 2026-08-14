import { assert, describe, it } from '@effect/vitest'
import { Atom, AtomRegistry } from '@effect/atom-vue'
import { Effect, Stream } from 'effect'

import { settle } from '@/testing/settle'

import { elapsedAtom, ticksAtom } from './atoms'

describe('Stream Atom', () => {
  it.effect('emits one value per schedule tick', () =>
    Effect.gen(function* () {
      const ticks = yield* settle(
        Atom.toStreamResult(ticksAtom).pipe(Stream.take(3), Stream.runCollect),
        '900 millis',
      )

      assert.deepStrictEqual(Array.from(ticks), [0, 1, 2])
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )

  it.effect('derives elapsed seconds from the latest emission', () =>
    Effect.gen(function* () {
      yield* Atom.mount(ticksAtom)
      yield* Atom.mount(elapsedAtom)

      // Before the first emission the derived atom reports its own zero rather
      // than leaking the Initial result to the template.
      assert.strictEqual(yield* Atom.get(elapsedAtom), '0.0')

      yield* settle(Atom.getResult(ticksAtom), '300 millis')

      assert.strictEqual(yield* Atom.get(elapsedAtom), '0.3')
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )
})
