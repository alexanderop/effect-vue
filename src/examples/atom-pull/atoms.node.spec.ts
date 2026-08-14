import { assert, describe, it } from '@effect/vitest'
import { Atom, AtomRegistry } from '@effect/atom-vue'
import { Effect } from 'effect'

import { settle } from '@/testing/settle'

import { feedAtom } from './atoms'

describe('Atom.pull', () => {
  it.effect('accumulates chunks and reports the end of the stream', () =>
    Effect.gen(function* () {
      yield* Atom.mount(feedAtom)

      const first = yield* settle(Atom.getResult(feedAtom), '500 millis')
      assert.deepStrictEqual(Array.from(first.items), ['Item 1', 'Item 2', 'Item 3', 'Item 4'])
      assert.isFalse(first.done)

      // Writing to the atom pulls the next chunk. Four pages of four, and then
      // one more pull that finds the stream exhausted.
      const counts: Array<number> = []
      let done = false

      for (let pull = 1; pull <= 4; pull++) {
        yield* Atom.set(feedAtom, undefined)
        const next = yield* settle(
          Atom.getResult(feedAtom, { suspendOnWaiting: true }),
          '500 millis',
        )
        counts.push(next.items.length)
        done = next.done
      }

      assert.deepStrictEqual(counts, [8, 12, 16, 16])
      assert.isTrue(done)
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )
})
