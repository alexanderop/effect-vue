import { Atom } from '@effect/atom-vue'
import { Effect, Option, Stream } from 'effect'

const pageSize = 4
const lastPage = 3

// `Atom.pull` consumes a Stream one chunk at a time: the first chunk is pulled
// on mount, and each write pulls the next one. Items accumulate, and `done`
// tells you when the Stream is exhausted — pagination with no state machine.
export const feedAtom = Atom.pull(
  Stream.paginate(0, (page: number) =>
    Effect.gen(function* () {
      yield* Effect.sleep('500 millis')

      const items = Array.from({ length: pageSize }, (_, i) => `Item ${page * pageSize + i + 1}`)

      return [items, page < lastPage ? Option.some(page + 1) : Option.none()] as const
    }),
  ),
)
