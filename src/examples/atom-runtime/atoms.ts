import { Atom } from '@effect/atom-vue'
import { Context, Effect, Layer } from 'effect'

export class Greeter extends Context.Service<
  Greeter,
  {
    readonly greet: (name: string) => Effect.Effect<string>
  }
>()('app/Greeter', {
  make: Effect.gen(function* () {
    yield* Effect.log('Greeter built — once per mount, not once per call')

    return {
      greet: Effect.fn('Greeter.greet')(function* (name: string) {
        yield* Effect.sleep('400 millis')
        return `Hello, ${name}!`
      }),
    }
  }),
}) {
  static readonly layer = Layer.effect(this, this.make)
}

// `Atom.runtime` builds the Layer once, lazily, and provides its services to
// every atom created from it. The Layer is released when nothing subscribes.
const runtime = Atom.runtime(Greeter.layer)

export const greetingAtom = runtime.fn((name: string) =>
  Greeter.use((greeter) => greeter.greet(name)),
)
