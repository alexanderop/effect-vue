import { Atom } from '@effect/atom-vue'

export const frameworks = ['Vue', 'Svelte', 'Solid'] as const

export type Framework = (typeof frameworks)[number]

export const selectedAtom = Atom.make<Framework>('Vue')

// One atom per key. Atoms are created on first use, cached weakly, and each
// key keeps its own independent state.
export const votesAtom = Atom.family((framework: Framework) =>
  Atom.make(0).pipe(Atom.withLabel(`votes/${framework}`)),
)
