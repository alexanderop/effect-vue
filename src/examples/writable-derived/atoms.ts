import { Atom } from '@effect/atom-vue'

export const celsiusAtom = Atom.make(20)

// `Atom.writable` takes a read function and a write function, so a derived atom
// can also be set. Writing here converts back and updates the source atom.
export const fahrenheitAtom = Atom.writable(
  (get) => Math.round(get(celsiusAtom) * (9 / 5) + 32),
  (ctx, value: number) => ctx.set(celsiusAtom, (value - 32) * (5 / 9)),
)
