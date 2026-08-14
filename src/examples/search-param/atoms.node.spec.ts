import { assert, describe, it } from '@effect/vitest'
import { Atom, AtomRegistry } from '@effect/atom-vue'
import { Effect, Option } from 'effect'

import { pageAtom, queryAtom } from './atoms'

/**
 * The Node project runs without a DOM, which is the interesting half of the
 * contract: `searchParam` has to stay usable where there is no URL to read.
 *
 * The atoms are module-scoped, so this is one ordered flow rather than several
 * tests inheriting each other's writes.
 */
describe('URL Search Params', () => {
  it.effect('falls back to a server-safe value with no window', () =>
    Effect.gen(function* () {
      assert.strictEqual(yield* Atom.get(queryAtom), '')
      assert.isTrue(Option.isNone(yield* Atom.get(pageAtom)))

      // Writes still work; they just have nowhere to go but the atom itself.
      yield* Atom.set(queryAtom, 'effect')
      assert.strictEqual(yield* Atom.get(queryAtom), 'effect')

      yield* Atom.set(pageAtom, Option.some(3))
      assert.deepStrictEqual(yield* Atom.get(pageAtom), Option.some(3))

      // Writing None is how a parameter is removed rather than blanked.
      yield* Atom.set(pageAtom, Option.none())
      assert.isTrue(Option.isNone(yield* Atom.get(pageAtom)))
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )
})
