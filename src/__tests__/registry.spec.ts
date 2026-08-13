import { describe, it, expect } from 'vitest'

import { examples, getExample } from '../examples/registry'

describe('example registry', () => {
  it('matches the live reference tour exactly', () => {
    expect(examples.map(({ slug, title }) => ({ slug, title }))).toEqual([
      { slug: 'basic-atom', title: 'Basic Atom' },
      { slug: 'derived-atom-i', title: 'Derived Atom I' },
      { slug: 'derived-atom-ii', title: 'Derived Atom II' },
      { slug: 'effectful-atom', title: 'Effectful Atom' },
      { slug: 'effectful-atom-ii', title: 'Effectful Atom II' },
      { slug: 'atom-fn', title: 'Atom.Fn' },
      { slug: 'get-result', title: 'get.result' },
      { slug: 'optimistic', title: 'Atom.optimistic' },
      { slug: 'todos', title: 'Todo List I' },
      { slug: 'todos-ii', title: 'Todo List II' },
      { slug: 'comments', title: 'Micro Comments' },
      { slug: 'streaming', title: 'Streaming Search' },
    ])
  })

  it('resolves every listed example to real Vue components', () => {
    for (const meta of examples) {
      const example = getExample(meta.slug)

      expect(example, `missing directory for "${meta.slug}"`).toBeDefined()
      expect(example!.components.map((panel) => panel.name)).toEqual(meta.panels)
      expect(example!.components.every((panel) => Boolean(panel.component))).toBe(true)
    }
  })

  it('marks only configured panels as writable', () => {
    for (const meta of examples) {
      const example = getExample(meta.slug)!
      expect(
        example.components.filter((panel) => panel.writable).map((panel) => panel.name),
      ).toEqual(meta.writablePanels ?? [])
    }
  })
})
