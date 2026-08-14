import { assert, describe, it } from '@effect/vitest'
import { AsyncResult, Atom, AtomRegistry } from '@effect/atom-vue'
import { Effect } from 'effect'
import { TestClock } from 'effect/testing'

import { optimisticLikeStatusAtom, setLikeAtom, simulateFailureAtom } from './atoms'

const status = Effect.fn(function* () {
  const result = yield* Atom.get(optimisticLikeStatusAtom)
  assert.isTrue(AsyncResult.isSuccess(result))
  return (result as AsyncResult.Success<{ isLiked: boolean; count: number }, never>).value
})

describe('Atom.optimistic', () => {
  // The example keeps its "server" state in a module-level variable, so these
  // run in order against one shared starting point of 41 unliked.
  it.effect('applies the optimistic value before the mutation resolves', () =>
    Effect.gen(function* () {
      yield* Atom.mount(optimisticLikeStatusAtom)
      yield* Atom.mount(setLikeAtom)

      assert.deepStrictEqual(yield* status(), { isLiked: false, count: 41 })

      yield* Atom.set(setLikeAtom, true)
      assert.deepStrictEqual(yield* status(), { isLiked: true, count: 42 })

      yield* TestClock.adjust('1200 millis')
      yield* Atom.getResult(setLikeAtom)

      assert.deepStrictEqual(yield* status(), { isLiked: true, count: 42 })
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )

  it.effect('discards the optimistic value when the mutation fails', () =>
    Effect.gen(function* () {
      yield* Atom.mount(optimisticLikeStatusAtom)
      yield* Atom.mount(setLikeAtom)
      yield* Atom.set(simulateFailureAtom, true)

      const before = yield* status()

      yield* Atom.set(setLikeAtom, !before.isLiked)
      assert.notStrictEqual((yield* status()).isLiked, before.isLiked)

      yield* TestClock.adjust('1200 millis')
      yield* Atom.getResult(setLikeAtom).pipe(Effect.exit)

      assert.deepStrictEqual(yield* status(), before)
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )
})
