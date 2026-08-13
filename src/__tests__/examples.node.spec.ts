import { assert, describe, it } from '@effect/vitest'
import { AsyncResult, Atom, AtomRegistry } from '@effect/atom-vue'
import { Deferred, Effect, Fiber, Random } from 'effect'
import { TestClock } from 'effect/testing'

import { votesAtom } from '../examples/atom-family/atoms'
import { countAtom, doubledAtom } from '../examples/derived-atom-i/atoms'
import { rollDice } from '../examples/effectful-atom/rollDice'
import {
  createTodoAtom,
  todoAtom,
  todosAtom,
  toggleTodoAtom,
} from '../examples/todos/atoms'

describe('example atoms in Node', () => {
  it.effect('recomputes a derived atom after its source changes', () =>
    Effect.gen(function* () {
      assert.strictEqual(yield* Atom.get(countAtom), 0)
      assert.strictEqual(yield* Atom.get(doubledAtom), 0)

      yield* Atom.set(countAtom, 4)

      assert.strictEqual(yield* Atom.get(doubledAtom), 8)
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )

  it.effect('keeps every Atom.family key independent', () =>
    Effect.gen(function* () {
      yield* Atom.set(votesAtom('Vue'), 2)
      yield* Atom.set(votesAtom('Solid'), 1)

      assert.strictEqual(yield* Atom.get(votesAtom('Vue')), 2)
      assert.strictEqual(yield* Atom.get(votesAtom('Solid')), 1)
      assert.strictEqual(yield* Atom.get(votesAtom('Svelte')), 0)
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )

  it.effect('isolates the same atoms between registries', () =>
    Effect.gen(function* () {
      const [first, second] = yield* Effect.acquireRelease(
        Effect.sync(() => [AtomRegistry.make(), AtomRegistry.make()] as const),
        ([first, second]) =>
          Effect.sync(() => {
            first.dispose()
            second.dispose()
          }),
      )

      first.set(countAtom, 7)

      assert.strictEqual(first.get(countAtom), 7)
      assert.strictEqual(first.get(doubledAtom), 14)
      assert.strictEqual(second.get(countAtom), 0)
      assert.strictEqual(second.get(doubledAtom), 0)
    }),
  )

  it.effect('moves an Effect atom from Initial to Success without polling', () =>
    Effect.gen(function* () {
      const completed = yield* Deferred.make<string>()
      const resultAtom = Atom.make(Deferred.await(completed))

      yield* Atom.mount(resultAtom)

      const initial = yield* Atom.get(resultAtom)
      assert.isTrue(AsyncResult.isInitial(initial))
      assert.isTrue(initial.waiting)

      yield* Deferred.succeed(completed, 'ready')
      const result = yield* Atom.getResult(resultAtom)

      assert.strictEqual(result, 'ready')
      assert.deepStrictEqual(yield* Atom.get(resultAtom), AsyncResult.success('ready'))
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )

  it.effect('runs service-backed mutations and reactive queries through Atom.runtime', () =>
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
    }).pipe(Effect.provide(AtomRegistry.layer)),
  )

  it.effect('controls dice latency and randomness without waiting in real time', () =>
    Effect.gen(function* () {
      const fiber = yield* rollDice(3).pipe(
        Random.withSeed('effect-vue-dice'),
        Effect.forkChild,
      )

      assert.isUndefined(fiber.pollUnsafe())
      yield* TestClock.adjust('799 millis')
      assert.isUndefined(fiber.pollUnsafe())

      yield* TestClock.adjust('1 millis')
      const rolls = yield* Fiber.join(fiber)

      assert.strictEqual(rolls.length, 3)
      assert.isTrue(rolls.every((roll) => roll >= 1 && roll <= 6))
    }),
  )
})
