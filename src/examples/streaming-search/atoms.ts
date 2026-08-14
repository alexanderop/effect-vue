import { Atom } from '@effect/atom-vue'
import { Effect, Stream } from 'effect'

export interface SearchResult {
  readonly id: number
  readonly title: string
  readonly description: string
}

const exampleResults: ReadonlyArray<SearchResult> = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  title: `Item ${index + 1}`,
  description: `Description for item ${index + 1}`,
}))

const searchStream = (query: string) =>
  Stream.fromIterable(exampleResults).pipe(
    Stream.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())),
    Stream.tap(() => Effect.sleep('200 millis')),
    Stream.take(20),
  )

export const scanSearchAtom = Atom.fn((query: string) =>
  searchStream(query).pipe(
    Stream.scan([] as ReadonlyArray<SearchResult>, (results, result) => [...results, result]),
  ),
)

export const pullSearchAtom = Atom.pull(searchStream('Item').pipe(Stream.rechunk(5)))

export const resultsAtom = Atom.make<ReadonlyArray<SearchResult>>([])

export const manualSearchAtom = Atom.fn((query: string, get) =>
  Effect.gen(function* () {
    get.set(resultsAtom, [])
    yield* searchStream(query).pipe(
      Stream.runForEach((result) =>
        Effect.sync(() => {
          get.set(resultsAtom, [...get(resultsAtom), result])
        }),
      ),
    )
  }),
)
