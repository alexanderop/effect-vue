import { assert, describe, it } from '@effect/vitest'
import { Atom, AtomRegistry } from '@effect/atom-vue'
import { Effect } from 'effect'

import { votesAtom } from '../../../examples/atom-family/atoms'

describe('Atom.family', () => {
  it.effect('keeps every family key independent', () =>
    Effect.gen(function* () {
      yield* Atom.set(votesAtom('Vue'), 2)
      yield* Atom.set(votesAtom('Solid'), 1)

      assert.strictEqual(yield* Atom.get(votesAtom('Vue')), 2)
      assert.strictEqual(yield* Atom.get(votesAtom('Solid')), 1)
      assert.strictEqual(yield* Atom.get(votesAtom('Svelte')), 0)
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )
})
