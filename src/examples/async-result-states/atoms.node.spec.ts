import { assert, describe, it } from '@effect/vitest'
import { AsyncResult, Atom, AtomRegistry } from '@effect/atom-vue'
import { Effect, Option, Random } from 'effect'

import { settle } from '@/testing/settle'

import { quote, quoteAtom, ServerError } from './atoms'

describe('AsyncResult States', () => {
  it.effect('is Initial and waiting before the Effect completes', () =>
    Effect.gen(function* () {
      yield* Atom.mount(quoteAtom)

      const initial = yield* Atom.get(quoteAtom)

      assert.isTrue(AsyncResult.isInitial(initial))
      assert.isTrue(initial.waiting)
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )

  it.effect('settles into exactly one of Success or Failure', () =>
    Effect.gen(function* () {
      yield* Atom.mount(quoteAtom)

      // `getResult` is what waits for the run; `get` then reports the state the
      // template would render. The seed pins which branch this run takes.
      yield* settle(Atom.getResult(quoteAtom).pipe(Effect.exit), '700 millis')
      const result = yield* Atom.get(quoteAtom)

      assert.isFalse(AsyncResult.isInitial(result))
      assert.isFalse(result.waiting)

      if (AsyncResult.isSuccess(result)) {
        assert.strictEqual(result.value, quote)
      } else {
        assert.isTrue(AsyncResult.isFailure(result))
        assert.deepStrictEqual(
          AsyncResult.error(result).pipe(Option.map((error) => error._tag)),
          Option.some('ServerError'),
        )
      }
    }).pipe(Random.withSeed('effect-vue-quote'), Effect.provide(AtomRegistry.layer)),
  )

  it('carries a typed tag on the failure', () => {
    const error = new ServerError({ message: 'The server had other plans.' })

    assert.strictEqual(error._tag, 'ServerError')
    assert.strictEqual(error.message, 'The server had other plans.')
  })
})
