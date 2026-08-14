import { assert, describe, it } from '@effect/vitest'
import { Atom, AtomRegistry } from '@effect/atom-vue'
import { Effect } from 'effect'
import * as KeyValueStore from 'effect/unstable/persistence/KeyValueStore'

import { makeSettingsAtoms } from './atoms'

// The point of the example: the same atoms, a different storage Layer. The app
// wires localStorage; this wires memory, and nothing else changes.
const { nameAtom, themeAtom } = makeSettingsAtoms(Atom.runtime(KeyValueStore.layerMemory))

describe('Persisted Atom', () => {
  it.effect('falls back to the default value when the store is empty', () =>
    Effect.gen(function* () {
      yield* Atom.mount(nameAtom)
      yield* Atom.mount(themeAtom)

      assert.strictEqual(yield* Atom.get(nameAtom), 'Ada')
      assert.strictEqual(yield* Atom.get(themeAtom), 'dark')
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )

  it.effect('round-trips a written value through the store', () =>
    Effect.gen(function* () {
      yield* Atom.mount(nameAtom)
      yield* Atom.mount(themeAtom)

      yield* Atom.set(nameAtom, 'Grace')
      yield* Atom.set(themeAtom, 'light')

      assert.strictEqual(yield* Atom.get(nameAtom), 'Grace')
      assert.strictEqual(yield* Atom.get(themeAtom), 'light')
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )
})
