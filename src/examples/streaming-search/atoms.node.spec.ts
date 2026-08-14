import { assert, describe, it } from '@effect/vitest'
import { Atom, AtomRegistry } from '@effect/atom-vue'
import { Effect } from 'effect'
import { TestClock } from 'effect/testing'

import { manualSearchAtom, resultsAtom, scanSearchAtom } from './atoms'

describe('Streaming Search', () => {
  it.effect('accumulates streamed results inside the stream with Stream.scan', () =>
    Effect.gen(function* () {
      yield* Atom.mount(scanSearchAtom)

      yield* Atom.set(scanSearchAtom, 'Item 50')
      yield* TestClock.adjust('200 millis')

      const results = yield* Atom.getResult(scanSearchAtom)
      assert.deepStrictEqual(
        results.map((result) => result.title),
        ['Item 50'],
      )
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )

  it.effect('writes each streamed element into a separate atom in the manual pattern', () =>
    Effect.gen(function* () {
      yield* Atom.mount(manualSearchAtom)
      yield* Atom.mount(resultsAtom)

      yield* Atom.set(manualSearchAtom, 'Item 5')
      yield* TestClock.adjust('400 millis')
      yield* Atom.getResult(manualSearchAtom)

      // "Item 5" also matches "Item 50", so two results arrive.
      assert.deepStrictEqual(
        (yield* Atom.get(resultsAtom)).map((result) => result.title),
        ['Item 5', 'Item 50'],
      )
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )
})
