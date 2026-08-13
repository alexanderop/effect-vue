import { Atom } from '@effect/atom-vue'
import { Effect } from 'effect'

export interface Author {
  readonly name: string
  readonly books: number
  readonly birth: number
  readonly death: number
}

export const authors: ReadonlyArray<Author> = [
  { name: 'Shakespeare', books: 37, birth: 1564, death: 1616 },
  { name: 'Austen', books: 6, birth: 1775, death: 1817 },
  { name: 'Hemingway', books: 10, birth: 1899, death: 1961 },
]

export const authorAtom = Atom.make<Author>(authors[0]!)

// Two independent lookups, deliberately of different lengths.
export const booksAtom = Atom.make((get) =>
  Effect.gen(function* () {
    const author = get(authorAtom)
    yield* Effect.sleep('900 millis')
    return author.books
  }),
)

export const lifespanAtom = Atom.make((get) =>
  Effect.gen(function* () {
    const author = get(authorAtom)
    yield* Effect.sleep('400 millis')
    return author.death - author.birth
  }),
)

export const suspendOnWaitingAtom = Atom.make(true)

// `get(booksAtom)` would hand back an AsyncResult to unwrap by hand.
// `get.result` unwraps it inside the Effect instead: the run suspends until the
// dependency succeeds, and inherits its failure if it does not.
//
// `suspendOnWaiting` decides what a *stale* dependency means. On, this waits for
// the fresh value before recomputing. Off, it takes the stale one straight away
// — so the rate briefly mixes the new lifespan with the old book count.
export const rateAtom = Atom.make((get) =>
  Effect.gen(function* () {
    const suspendOnWaiting = get(suspendOnWaitingAtom)

    const books = yield* get.result(booksAtom, { suspendOnWaiting })
    const lifespan = yield* get.result(lifespanAtom, { suspendOnWaiting })

    return (books / lifespan).toFixed(2)
  }),
)
