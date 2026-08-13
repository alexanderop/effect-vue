import { assert, describe, it } from '@effect/vitest'
import { AsyncResult, Atom, AtomRegistry } from '@effect/atom-vue'
import { Deferred, Effect } from 'effect'

describe('async Atom results', () => {
  it.effect('moves from Initial to Success without polling', () =>
    Effect.gen(function* () {
      const completed = yield* Deferred.make<string>()
      const resultAtom = Atom.make(Deferred.await(completed))

      yield* Atom.mount(resultAtom)

      const initial = yield* Atom.get(resultAtom)
      assert.isTrue(AsyncResult.isInitial(initial))
      assert.isTrue(initial.waiting)

      yield* Deferred.succeed(completed, 'ready')
      const result = yield* Atom.getResult(resultAtom)

      assert.strictEqual(result, 'ready')
      assert.deepStrictEqual(yield* Atom.get(resultAtom), AsyncResult.success('ready'))
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )
})
