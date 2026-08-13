import { assert, describe, it } from '@effect/vitest'
import { Atom, AtomRegistry } from '@effect/atom-vue'
import { Effect } from 'effect'

import {
  createTodoAtom,
  deleteTodoAtom,
  todoAtom,
  todosAtom,
  toggleTodoAtom,
} from '../../../examples/todos/atoms'

describe('Todo List I page model', () => {
  it.effect('runs CRUD mutations and reactive queries through Atom.runtime', () =>
    Effect.gen(function* () {
      yield* Atom.mount(todosAtom)
      yield* Atom.mount(createTodoAtom)
      yield* Atom.mount(toggleTodoAtom)

      yield* Atom.set(createTodoAtom, { id: 'testing', text: 'Write focused tests' })
      const created = yield* Atom.getResult(createTodoAtom)

      assert.deepStrictEqual(created, {
        id: 'testing',
        text: 'Write focused tests',
        completed: false,
      })
      assert.deepStrictEqual(yield* Atom.getResult(todosAtom), [created])

      yield* Atom.set(toggleTodoAtom, created.id)
      yield* Atom.getResult(toggleTodoAtom)

      assert.deepStrictEqual(yield* Atom.getResult(todoAtom(created.id)), {
        ...created,
        completed: true,
      })

      yield* Atom.set(deleteTodoAtom, created.id)
      yield* Atom.getResult(deleteTodoAtom)

      assert.deepStrictEqual(yield* Atom.getResult(todosAtom), [])
      assert.isUndefined(yield* Atom.getResult(todoAtom(created.id)))
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )
})
