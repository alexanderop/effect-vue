import { assert, describe, it } from '@effect/vitest'
import { AsyncResult, Atom, AtomRegistry } from '@effect/atom-vue'
import { Effect, Fiber } from 'effect'
import { TestClock } from 'effect/testing'

import { userAtom } from './atoms'

describe('Atom From An Effect', () => {
  it.effect('stays Initial until the Effect completes', () =>
    Effect.gen(function* () {
      yield* Atom.mount(userAtom)

      const initial = yield* Atom.get(userAtom)
      assert.isTrue(AsyncResult.isInitial(initial))
      assert.isTrue(initial.waiting)

      const result = yield* Atom.getResult(userAtom).pipe(Effect.forkChild)
      yield* TestClock.adjust('900 millis')

      assert.deepStrictEqual(yield* Fiber.join(result), {
        name: 'Ada Lovelace',
        commits: 372,
      })
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )
})
