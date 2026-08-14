import { assert, describe, it } from '@effect/vitest'
import { Atom, AtomRegistry } from '@effect/atom-vue'
import { Effect, Stream } from 'effect'

import { settle } from '@/testing/settle'

import { autoPriceAtom, priceAtom } from './atoms'

const isPrice = (value: string) => {
  assert.match(value, /^\d+\.\d{2}$/)
  assert.isAtLeast(Number(value), 100)
  assert.isBelow(Number(value), 120)
}

describe('Refresh And Revalidate', () => {
  it.effect('recomputes when refreshed through the registry', () =>
    Effect.gen(function* () {
      yield* Atom.mount(priceAtom)

      const first = yield* settle(Atom.getResult(priceAtom), '600 millis')
      isPrice(first)

      yield* Atom.refresh(priceAtom)
      const second = yield* settle(
        Atom.getResult(priceAtom, { suspendOnWaiting: true }),
        '600 millis',
      )
      isPrice(second)
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )

  it.effect('reruns on its own schedule while mounted', () =>
    Effect.gen(function* () {
      // The clock is stepped rather than jumped: withRefresh has to be woken
      // once per interval, so one large adjust would only produce one run.
      const prices = yield* settle(
        Atom.toStreamResult(autoPriceAtom).pipe(Stream.take(2), Stream.runCollect),
        '600 millis',
        '3 seconds',
        '600 millis',
      )

      assert.lengthOf(Array.from(prices), 2)
      for (const price of prices) isPrice(price)
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )
})
