import { Atom } from '@effect/atom-vue'
import { Effect } from 'effect'

// When an atom is built from an Effect, its value is an `AsyncResult`: the
// Effect runs when the atom is first mounted, and is interrupted when the last
// subscriber goes away.
export const userAtom = Atom.make(
  Effect.gen(function* () {
    yield* Effect.sleep('900 millis')
    return { name: 'Ada Lovelace', commits: 372 }
  }),
)
