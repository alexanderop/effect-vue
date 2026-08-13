import { assert, describe, it } from '@effect/vitest'
import { Atom, AtomRegistry } from '@effect/atom-vue'
import { Effect, Fiber } from 'effect'
import { TestClock } from 'effect/testing'

import {
  ageAtDeathAtom,
  authorAtom,
  authors,
  booksCountAtom,
  booksPerYearAtom,
} from '../../../examples/get-result/atoms'

describe('get.result page model', () => {
  it.effect('combines async author facts with deterministic time', () =>
    Effect.gen(function* () {
      yield* Atom.set(authorAtom, authors[1]!)
      yield* Atom.mount(booksPerYearAtom)
      const result = yield* Atom.getResult(booksPerYearAtom).pipe(Effect.forkChild)

      yield* TestClock.adjust('600 millis')

      assert.strictEqual(yield* Fiber.join(result), '0.14')
      assert.strictEqual(yield* Atom.getResult(booksCountAtom), 6)
      assert.strictEqual(yield* Atom.getResult(ageAtDeathAtom), 42)
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )
})
