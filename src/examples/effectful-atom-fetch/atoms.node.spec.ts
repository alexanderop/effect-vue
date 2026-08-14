import { assert, describe, it } from '@effect/vitest'
import { Atom, AtomRegistry } from '@effect/atom-vue'
import { Effect } from 'effect'
import { afterEach, vi } from 'vitest'

import { cities, cityAtom, weatherAtom } from './atoms'

afterEach(() => {
  vi.unstubAllGlobals()
})

const stubFetch = (temperature: number) =>
  Effect.sync(() => {
    const fetchMock = vi.fn<(input: RequestInfo | URL) => Promise<Response>>(
      async () =>
        new Response(
          JSON.stringify({
            current: { temperature_2m: temperature, relative_humidity_2m: 55 },
          }),
          { headers: { 'Content-Type': 'application/json' } },
        ),
    )
    vi.stubGlobal('fetch', fetchMock)
    return fetchMock
  })

describe('Effectful Atom, Real Request', () => {
  it.effect('decodes the response through the schema', () =>
    Effect.gen(function* () {
      yield* stubFetch(21)
      yield* Atom.mount(weatherAtom)

      const weather = yield* Atom.getResult(weatherAtom)

      assert.strictEqual(weather.current.temperature_2m, 21)
      assert.strictEqual(weather.current.relative_humidity_2m, 55)
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )

  it.effect('refetches when the selected city changes', () =>
    Effect.gen(function* () {
      const fetchMock = yield* stubFetch(12)
      yield* Atom.mount(weatherAtom)
      yield* Atom.getResult(weatherAtom)

      yield* Atom.set(cityAtom, cities[1]!)
      yield* Atom.getResult(weatherAtom)

      assert.strictEqual(fetchMock.mock.calls.length, 2)
      assert.include(String(fetchMock.mock.calls[1]![0]), 'latitude=51.5074')
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )

  it.effect('fails rather than guessing when the payload does not match', () =>
    Effect.gen(function* () {
      vi.stubGlobal(
        'fetch',
        vi.fn(async () => new Response(JSON.stringify({ current: {} }))),
      )
      yield* Atom.mount(weatherAtom)

      const exit = yield* Atom.getResult(weatherAtom).pipe(Effect.exit)

      assert.isTrue(exit._tag === 'Failure')
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )
})
