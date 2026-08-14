import { Atom } from '@effect/atom-vue'
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

interface TodoServiceShape {
  readonly create: (command: CreateTodo) => Effect.Effect<Todo>
  readonly list: () => Effect.Effect<ReadonlyArray<Todo>>
  readonly toggle: (id: string) => Effect.Effect<void>
  readonly deleteById: (id: string) => Effect.Effect<void>
  readonly getById: (id: string) => Effect.Effect<Todo | undefined>
}

class TodoService extends Context.Service<TodoService, TodoServiceShape>()('example/TodoService') {}

const TodoServiceLive = Layer.sync(TodoService, () => {
  const todos = new Map<string, Todo>()

  return TodoService.of({
    create: Effect.fn('TodoService.create')((command: CreateTodo) =>
      Effect.sync(() => {
        const todo: Todo = { ...command, completed: false }
        todos.set(todo.id, todo)
        return todo
      }),
    ),
    list: Effect.fn('TodoService.list')(() => Effect.sync(() => Array.from(todos.values()))),
    toggle: Effect.fn('TodoService.toggle')((id: string) =>
      Effect.sync(() => {
        const todo = todos.get(id)
        if (todo) todos.set(id, { ...todo, completed: !todo.completed })
      }),
    ),
    deleteById: Effect.fn('TodoService.deleteById')((id: string) =>
      Effect.sync(() => {
        todos.delete(id)
      }),
    ),
    getById: Effect.fn('TodoService.getById')((id: string) => Effect.sync(() => todos.get(id))),
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
