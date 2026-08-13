import { describe, it, expect } from 'vitest'

import { examples, getExample } from '../examples/registry'
import { buildFiles, MAIN_FILE } from '../playground/buildFiles'

describe('example registry', () => {
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

      const app = files[MAIN_FILE]
      expect(app, `no entry generated for "${meta.slug}"`).toBeDefined()
      expect(app).toContain(`provide(registryKey, AtomRegistry.make())`)

      for (const file of example.files) {
        // Sources are handed to the sandbox verbatim.
        expect(files[`src/${file.name}`]).toBe(file.code)

        if (file.lang !== 'vue') continue
        const name = file.name.replace(/\.vue$/, '')
        expect(app, `"${meta.slug}" never mounts ${file.name}`).toContain(
          `import ${name} from './${name}.vue'`,
        )
        expect(app).toContain(`<${name} />`)
      }
    }
  })
})
