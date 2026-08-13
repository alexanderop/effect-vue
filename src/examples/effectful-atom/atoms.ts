import { Atom, AsyncResult } from '@effect/atom-vue'
import { rollDice } from './rollDice'

export const countAtom = Atom.make(3)

export const diceAtom = Atom.make((get) => rollDice(get(countAtom)))

export const totalAtom = Atom.make((get) =>
  AsyncResult.map(get(diceAtom), (rolls) => rolls.reduce((sum, roll) => sum + roll, 0)),
)
