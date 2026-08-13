import { Atom } from '@effect/atom-vue'

export const countAtom = Atom.make(0)

// A read-only atom derived from another atom. `get` tracks the dependency, so
// this only recomputes when `countAtom` actually changes.
export const doubledAtom = Atom.make((get) => get(countAtom) * 2)
