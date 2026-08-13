import { Atom } from '@effect/atom-vue'
import { Effect } from 'effect'

const fetchPrice = Effect.gen(function* () {
  yield* Effect.sleep('600 millis')
  return (100 + Math.random() * 20).toFixed(2)
})

// Refreshed by hand, through the registry.
export const priceAtom = Atom.make(fetchPrice)

// `withRefresh` re-runs the atom on a timer for as long as it is mounted. The
// previous value stays put while the next run is in flight.
export const autoPriceAtom = Atom.make(fetchPrice).pipe(Atom.withRefresh('3 seconds'))
