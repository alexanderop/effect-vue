import { assert, describe, it } from '@effect/vitest'
import { Atom, AtomRegistry } from '@effect/atom-vue'
import { Effect } from 'effect'

import { countAtom, repeatedAtom, textAtom } from '../../../examples/derived-atom-ii/atoms'

describe('Derived Atom II page model', () => {
  it.effect('recomputes a multi-source derived atom after either source changes', () =>
    Effect.gen(function* () {
      assert.strictEqual(yield* Atom.get(repeatedAtom), 'EFFECT EFFECT EFFECT')

      yield* Atom.set(textAtom, 'Vue')
      assert.strictEqual(yield* Atom.get(repeatedAtom), 'Vue Vue Vue')

      yield* Atom.set(countAtom, 2)
      assert.strictEqual(yield* Atom.get(repeatedAtom), 'Vue Vue')
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )
})
