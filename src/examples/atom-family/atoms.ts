import { Atom } from '@effect/atom-vue'

export const frameworks = ['Vue', 'Svelte', 'Solid'] as const

export type Framework = (typeof frameworks)[number]

export const selectedAtom = Atom.make<Framework>('Vue')

// One atom per key. Atoms are created on first use, cached weakly, and each
// key keeps its own independent state.
//
// `keepAlive` is what makes the tally survive switching frameworks. Without it
// an atom is disposed when its last subscriber goes away and comes back at its
// initial value — correct for a query, wrong for a running count.
export const votesAtom = Atom.family((framework: Framework) =>
  Atom.make(0).pipe(Atom.withLabel(`votes/${framework}`), Atom.keepAlive),
)
