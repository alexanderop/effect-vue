import { assert, describe, it } from '@effect/vitest'
import { Atom, AtomRegistry } from '@effect/atom-vue'
import { Effect } from 'effect'

import { celsiusAtom, fahrenheitAtom } from './atoms'

describe('Writable Derived Atom', () => {
  it.effect('derives Fahrenheit from Celsius', () =>
    Effect.gen(function* () {
      assert.strictEqual(yield* Atom.get(fahrenheitAtom), 68)

      yield* Atom.set(celsiusAtom, 100)
      assert.strictEqual(yield* Atom.get(fahrenheitAtom), 212)
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )

  it.effect('writes back through to the source atom', () =>
    Effect.gen(function* () {
      yield* Atom.set(fahrenheitAtom, 212)

      assert.strictEqual(yield* Atom.get(celsiusAtom), 100)
      assert.strictEqual(yield* Atom.get(fahrenheitAtom), 212)
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )
})
