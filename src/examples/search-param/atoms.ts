import { Atom } from '@effect/atom-vue'
import { Schema } from 'effect'

// `Writable<string>`: the raw parameter, and '' when it is absent.
export const queryAtom = Atom.searchParam('q')

// With a schema the atom becomes `Writable<Option<number>>`: whatever the schema
// rejects reads as None, and writing None removes the parameter from the URL.
//
// The check is not decoration. An absent parameter reaches the schema as '', and
// `NumberFromString` decodes that to 0 rather than failing — `Number('')` is 0.
// Requiring a page of at least 1 is what makes "absent" and "junk" both None.
//
// The schema also has to be synchronous and context-free: this runs during a
// plain atom read, not inside an Effect.
export const pageAtom = Atom.searchParam('page', {
  schema: Schema.NumberFromString.check(Schema.isGreaterThanOrEqualTo(1)),
})

/**
 * Reads the URL back, so the round trip is visible rather than assumed.
 *
 * This is also the escape hatch worth knowing on its own: `get.setSelf` lets an
 * atom push a new value into itself from a callback, and `get.addFinalizer`
 * tears the listener down when the atom is rebuilt or disposed. That pair is
 * how you wrap any event source — resize, scroll, a socket — as an atom.
 */
export const searchStringAtom = Atom.readable<string>((get) => {
  if (typeof window === 'undefined') return ''

  // Depend on both parameters so a write schedules a re-read.
  get(queryAtom)
  get(pageAtom)

  const read = () => get.setSelf(window.location.search)

  // Writes are batched: `searchParam` collects them and calls `pushState` 500ms
  // after the last one, so the URL only agrees with the atoms after that.
  const timeout = setTimeout(read, 600)
  window.addEventListener('popstate', read)

  get.addFinalizer(() => {
    clearTimeout(timeout)
    window.removeEventListener('popstate', read)
  })

  return window.location.search
})
