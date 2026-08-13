import { assert, describe, it } from '@effect/vitest'
import { Atom, AtomRegistry } from '@effect/atom-vue'
import { Effect } from 'effect'

import { countAtom, doubledAtom } from '../../../examples/derived-atom-i/atoms'

describe('Derived Atom I page model', () => {
  it.effect('recomputes a derived atom after its source changes', () =>
    Effect.gen(function* () {
      assert.strictEqual(yield* Atom.get(countAtom), 0)
      assert.strictEqual(yield* Atom.get(doubledAtom), 0)

      yield* Atom.set(countAtom, 4)

      assert.strictEqual(yield* Atom.get(doubledAtom), 8)
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )
})
