import { Atom } from '@effect/atom-vue'

export const countAtom = Atom.make(0)
export const doubledAtom = Atom.make((get) => get(countAtom) * 2)
