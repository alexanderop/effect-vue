import { Atom } from '@effect/atom-vue'
import { Effect } from 'effect'

const fruits = ['Apple', 'Apricot', 'Banana', 'Blackberry', 'Cherry', 'Fig', 'Grape', 'Peach']

// `Atom.fn` turns an Effect into something you trigger with an argument. Each
// call interrupts the previous one, so the result is never out of order.
export const searchAtom = Atom.fn((query: string) =>
  Effect.gen(function* () {
    yield* Effect.sleep('600 millis')
    return fruits.filter((fruit) => fruit.toLowerCase().includes(query.toLowerCase()))
  }),
)
