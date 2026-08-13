import { Atom } from '@effect/atom-vue'

export const textAtom = Atom.make('EFFECT')
export const countAtom = Atom.make(3)

// A derived atom may read as many atoms as it likes. `get` subscribes to each
// one it touches while the read runs, so this recomputes when either input
// changes — and stays put when anything else in the app does.
export const repeatedAtom = Atom.make((get) => {
  const text = get(textAtom)
  const count = get(countAtom)
  return Array(count).fill(text).join(' ')
})
