import { Atom, AsyncResult } from '@effect/atom-vue'
import { Context, Effect, Layer } from 'effect'

export interface Todo {
  readonly id: string
  readonly text: string
  readonly completed: boolean
}

export interface CreateTodo {
  readonly id: string
  readonly text: string
}

export type Filter = 'all' | 'open' | 'done'

interface TodoServiceShape {
  readonly create: (command: CreateTodo) => Effect.Effect<Todo>
  readonly list: () => Effect.Effect<ReadonlyArray<Todo>>
  readonly toggle: (id: string) => Effect.Effect<void>
  readonly deleteById: (id: string) => Effect.Effect<void>
  readonly getById: (id: string) => Effect.Effect<Todo | undefined>
}

class TodoService extends Context.Service<TodoService, TodoServiceShape>()(
  'example/FilteredTodoService',
) {}

const TodoServiceLive = Layer.sync(TodoService, () => {
  const todos = new Map<string, Todo>()

  return TodoService.of({
    create: Effect.fn('FilteredTodoService.create')((command: CreateTodo) =>
      Effect.sync(() => {
        const todo: Todo = { ...command, completed: false }
        todos.set(todo.id, todo)
        return todo
      }),
    ),
    list: Effect.fn('FilteredTodoService.list')(() =>
      Effect.sync(() => Array.from(todos.values())),
    ),
    toggle: Effect.fn('FilteredTodoService.toggle')((id: string) =>
      Effect.sync(() => {
        const todo = todos.get(id)
        if (todo) todos.set(id, { ...todo, completed: !todo.completed })
      }),
    ),
    deleteById: Effect.fn('FilteredTodoService.deleteById')((id: string) =>
      Effect.sync(() => {
        todos.delete(id)
      }),
    ),
    getById: Effect.fn('FilteredTodoService.getById')((id: string) =>
      Effect.sync(() => todos.get(id)),
    ),
  })
})

const todoRuntime = Atom.runtime(TodoServiceLive)

export const todosAtom = todoRuntime
  .atom(TodoService.use((service) => service.list()))
  .pipe(Atom.withReactivity({ todos: ['*'] }))

export const todoAtom = Atom.family((id: string) =>
  todoRuntime
    .atom(TodoService.use((service) => service.getById(id)))
    .pipe(Atom.withReactivity({ todos: [id] })),
)

export const createTodoAtom = todoRuntime.fn(
  (command: CreateTodo) => TodoService.use((service) => service.create(command)),
  { reactivityKeys: { todos: ['*'] } },
)

export const toggleTodoAtom = todoRuntime.fn(
  (id: string) => TodoService.use((service) => service.toggle(id)),
  { reactivityKeys: { todos: ['*'] } },
)

export const deleteTodoAtom = todoRuntime.fn(
  (id: string) => TodoService.use((service) => service.deleteById(id)),
  { reactivityKeys: { todos: ['*'] } },
)

export const filterAtom = Atom.make<Filter>('all')

export const filteredTodosAtom = Atom.make((get) => {
  const filter = get(filterAtom)
  return AsyncResult.map(get(todosAtom), (todos) =>
    filter === 'all'
      ? todos
      : filter === 'done'
        ? todos.filter((todo) => todo.completed)
        : todos.filter((todo) => !todo.completed),
  )
})
