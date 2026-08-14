import { assert, describe, it } from '@effect/vitest'
import { Atom, AtomRegistry } from '@effect/atom-vue'
import { Effect, Fiber } from 'effect'
import { TestClock } from 'effect/testing'

import { greetingAtom } from './atoms'

describe('Atom.runtime', () => {
  it.effect('provides the Greeter service to an atom built from the runtime', () =>
    Effect.gen(function* () {
      yield* Atom.mount(greetingAtom)

      yield* Atom.set(greetingAtom, 'Vue')
      const fiber = yield* Atom.getResult(greetingAtom).pipe(Effect.forkChild)
      yield* TestClock.adjust('400 millis')

      assert.strictEqual(yield* Fiber.join(fiber), 'Hello, Vue!')
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )
})
