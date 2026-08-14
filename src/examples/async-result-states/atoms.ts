import { Atom } from '@effect/atom-vue'
import { Effect, Random, Schema } from 'effect'

export class ServerError extends Schema.TaggedError<ServerError>()('ServerError', {
  message: Schema.String,
}) {}

export const quote = 'Make it work, make it right, make it fast.'

// Fails about half the time, so every branch of the AsyncResult is reachable.
// Randomness comes from Effect's Random service rather than Math.random, which
// is what lets the Node spec pin both outcomes with `Random.withSeed`.
export const quoteAtom = Atom.make(
  Effect.gen(function* () {
    yield* Effect.sleep('700 millis')

    if ((yield* Random.next) < 0.5) {
      return yield* new ServerError({ message: 'The server had other plans.' })
    }

    return quote
  }),
)
