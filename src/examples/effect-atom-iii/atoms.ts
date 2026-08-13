import { Atom } from '@effect/atom-vue'
import { Effect, Schema } from 'effect'

export interface City {
  readonly name: string
  readonly lat: number
  readonly lon: number
}

export const cities: ReadonlyArray<City> = [
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'New York', lat: 40.7128, lon: -74.006 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
]

export const cityAtom = Atom.make<City>(cities[0]!)

const Weather = Schema.Struct({
  current: Schema.Struct({
    temperature_2m: Schema.Number,
    relative_humidity_2m: Schema.Number,
  }),
})

// The whole request lives inside the atom: pick the city, fetch, decode. Every
// step is part of one Effect, so switching city interrupts all of it at once —
// `Effect.tryPromise` hands us the AbortSignal, which aborts the real request
// rather than just ignoring its answer.
export const weatherAtom = Atom.make((get) =>
  Effect.gen(function* () {
    const city = get(cityAtom)

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}` +
      `&current=temperature_2m,relative_humidity_2m`

    const response = yield* Effect.tryPromise((signal) => fetch(url, { signal }))
    const json = yield* Effect.tryPromise(() => response.json())

    // A decode failure is an ordinary failure of this Effect, so the atom ends
    // up in Failure instead of handing the component an unchecked shape.
    return yield* Schema.decodeUnknownEffect(Weather)(json)
  }),
)
