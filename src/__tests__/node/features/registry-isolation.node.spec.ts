import { assert, describe, it } from '@effect/vitest'
import { AtomRegistry } from '@effect/atom-vue'
import { Effect } from 'effect'

import { countAtom, doubledAtom } from '@/examples/derived-atom/atoms'

describe('AtomRegistry isolation', () => {
  it.effect('isolates the same atoms between registries', () =>
    Effect.gen(function* () {
      const [first, second] = yield* Effect.acquireRelease(
        Effect.sync(() => [AtomRegistry.make(), AtomRegistry.make()] as const),
        ([first, second]) =>
          Effect.sync(() => {
            first.dispose()
            second.dispose()
          }),
      )

      first.set(countAtom, 7)

      assert.strictEqual(first.get(countAtom), 7)
      assert.strictEqual(first.get(doubledAtom), 14)
      assert.strictEqual(second.get(countAtom), 0)
      assert.strictEqual(second.get(doubledAtom), 0)
    }),
  )
})
