import { assert, describe, it } from '@effect/vitest'
import { Atom, AtomRegistry } from '@effect/atom-vue'
import { Effect } from 'effect'

import {
  createTodoAtom,
  filterAtom,
  filteredTodosAtom,
  toggleTodoAtom,
} from '../../../examples/todos-ii/atoms'

describe('Todo List II page model', () => {
  it.effect('filters service-backed todos without duplicating the service query', () =>
    Effect.gen(function* () {
      yield* Atom.mount(filteredTodosAtom)
      yield* Atom.mount(createTodoAtom)
      yield* Atom.mount(toggleTodoAtom)

      yield* Atom.set(createTodoAtom, { id: 'first', text: 'First' })
      yield* Atom.getResult(createTodoAtom)
      yield* Atom.set(createTodoAtom, { id: 'second', text: 'Second' })
      yield* Atom.getResult(createTodoAtom)
      yield* Atom.set(toggleTodoAtom, 'first')
      yield* Atom.getResult(toggleTodoAtom)

      yield* Atom.set(filterAtom, 'done')
      assert.deepStrictEqual(
        (yield* Atom.getResult(filteredTodosAtom)).map((todo) => todo.id),
        ['first'],
      )

      yield* Atom.set(filterAtom, 'open')
      assert.deepStrictEqual(
        (yield* Atom.getResult(filteredTodosAtom)).map((todo) => todo.id),
        ['second'],
      )
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )
})
