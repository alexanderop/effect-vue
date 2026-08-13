import { assert, describe, it } from '@effect/vitest'
import { Atom, AtomRegistry } from '@effect/atom-vue'
import { Effect } from 'effect'

import { countAtom } from '../../../examples/basic-atom/atoms'

describe('Basic Atom page model', () => {
  it.effect('updates a basic writable atom', () =>
    Effect.gen(function* () {
      assert.strictEqual(yield* Atom.get(countAtom), 0)
      yield* Atom.set(countAtom, 1)
      assert.strictEqual(yield* Atom.get(countAtom), 1)
      yield* Atom.set(countAtom, 0)
      assert.strictEqual(yield* Atom.get(countAtom), 0)
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )
})
