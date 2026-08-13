import { Atom } from '@effect/atom-vue'
import { Effect } from 'effect'

export interface Author {
  readonly name: string
  readonly books: number
  readonly birth: number
  readonly death: number
}

export const authors: ReadonlyArray<Author> = [
  { name: 'William Shakespeare', books: 37, birth: 1564, death: 1616 },
  { name: 'Jane Austen', books: 6, birth: 1775, death: 1817 },
  { name: 'John Kennedy Toole', books: 2, birth: 1937, death: 1969 },
  { name: 'Charles Dickens', books: 15, birth: 1812, death: 1870 },
  { name: 'Mark Twain', books: 28, birth: 1835, death: 1910 },
  { name: 'Isaac Asimov', books: 500, birth: 1920, death: 1992 },
]

export const authorAtom = Atom.make<Author>(authors[0]!)

// Two independent lookups, deliberately of different lengths.
export const booksCountAtom = Atom.make((get) =>
  Effect.gen(function* () {
    const author = get(authorAtom)
    yield* Effect.sleep('600 millis')
    return author.books
  }),
)

export const ageAtDeathAtom = Atom.make((get) =>
  Effect.gen(function* () {
    const author = get(authorAtom)
    yield* Effect.sleep('500 millis')
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
export const booksPerYearAtom = Atom.make((get) =>
  Effect.gen(function* () {
    const suspendOnWaiting = get(suspendOnWaitingAtom)

    const books = yield* get.result(booksCountAtom, { suspendOnWaiting })
    const lifespan = yield* get.result(ageAtDeathAtom, { suspendOnWaiting })

    return (books / lifespan).toFixed(2)
  }),
)
