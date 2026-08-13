import { describe, it, expect } from 'vitest'

import { examples, getExample } from '../examples/registry'
import { buildFiles, MAIN_FILE } from '../playground/buildFiles'

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

  it('resolves every listed example to source files', () => {
    for (const meta of examples) {
      const example = getExample(meta.slug)

      expect(example, `missing directory for "${meta.slug}"`).toBeDefined()
      expect(example!.files.length, `no sources for "${meta.slug}"`).toBeGreaterThan(0)
      expect(
        example!.files.some((file) => file.lang === 'vue'),
        `no components for "${meta.slug}"`,
      ).toBe(true)
    }
  })

  it('shows atoms.ts first when an example has one', () => {
    const leadingNames = examples
      .map((meta) => getExample(meta.slug)!.files.map((file) => file.name))
      .filter((names) => names.includes('atoms.ts'))
      .map((names) => names[0])

    expect(leadingNames.length).toBeGreaterThan(0)
    expect([...new Set(leadingNames)]).toEqual(['atoms.ts'])
  })
})

describe('playground files', () => {
  it('gives every example a generated entry that mounts each panel', () => {
    for (const meta of examples) {
      const example = getExample(meta.slug)!
      const files = buildFiles(example)

      const app = files[MAIN_FILE]!
      expect(app, `no entry generated for "${meta.slug}"`).toBeDefined()
      expect(app).toContain(`provide(registryKey, AtomRegistry.make())`)
      expect(files['import-map.json']).toBe('{}')

      for (const file of example.files) {
        // Sources are handed to the sandbox verbatim.
        expect(files[`src/${file.name}`]).toBe(file.code)

        if (file.lang !== 'vue') continue
        const name = file.name.replace(/\.vue$/, '')
        expect(app.includes(`import ${name} from './${name}.vue'`)).toBe(meta.panels.includes(name))
        expect(app.includes(`<${name} />`)).toBe(meta.panels.includes(name))
      }
    }
  })
})
