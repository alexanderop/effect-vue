import { Atom } from '@effect/atom-vue'
import { Effect, Schema } from 'effect'

export class ServerError extends Schema.TaggedError<ServerError>()('ServerError', {
  message: Schema.String,
}) {}

// Fails about half the time, so every branch of the AsyncResult is reachable.
export const quoteAtom = Atom.make(
  Effect.gen(function* () {
    yield* Effect.sleep('700 millis')

    if (Math.random() < 0.5) {
      return yield* new ServerError({ message: 'The server had other plans.' })
    }

    return 'Make it work, make it right, make it fast.'
  }),
)
