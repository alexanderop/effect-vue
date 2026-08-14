import { describe, expect, it } from 'vitest'

import { examples, exampleIndex, getExample } from '@/examples/registry'

describe('example registry', () => {
  it('lists the tour in teaching order', () => {
    expect(examples.map((example) => example.slug)).toEqual([
      'basic-atom',
      'derived-atom',
      'derived-atom-multi-source',
      'writable-derived-atom',
      'atom-family',
      'effect-atom',
      'async-result-states',
      'effectful-atom',
      'effectful-atom-fetch',
      'atom-debounce',
      'atom-fn',
      'atom-runtime',
      'get-result',
      'atom-refresh',
      'atom-swr',
      'stream-atom',
      'atom-pull',
      'atom-optimistic',
      'persisted-atom',
      'search-param',
      'atom-ref',
      'todo-list',
      'filtered-todos',
      'streaming-search',
    ])
  })

  it('gives every example a root component and a teaching note', () => {
    for (const example of examples) {
      expect(example.component, `missing root component for "${example.slug}"`).toBeTruthy()
      expect(example.api.length, `missing api list for "${example.slug}"`).toBeGreaterThan(0)
      expect(example.effectNote.length, `missing effectNote for "${example.slug}"`).toBeGreaterThan(
        0,
      )
      expect(example.vueNote.length, `missing vueNote for "${example.slug}"`).toBeGreaterThan(0)
    }
  })

  it('uses a unique slug and title per example', () => {
    expect(new Set(examples.map((example) => example.slug)).size).toBe(examples.length)
    expect(new Set(examples.map((example) => example.title)).size).toBe(examples.length)
  })

  it('looks an example up by slug and reports its position', () => {
    expect(getExample('atom-family')?.title).toBe('Atom Family')
    expect(getExample('nope')).toBeUndefined()
    expect(exampleIndex('basic-atom')).toBe(0)
    expect(exampleIndex('nope')).toBe(-1)
  })
})
