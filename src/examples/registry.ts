import type { Component } from 'vue'

/**
 * The ordered example tour. Each entry maps to a directory under
 * `src/examples/`; `panels` chooses which components are mounted on its page.
 */
export interface ExampleMeta {
  readonly slug: string
  readonly title: string
  readonly blurb: string
  readonly panels: ReadonlyArray<string>
  readonly writablePanels?: ReadonlyArray<string>
}

export const examples: ReadonlyArray<ExampleMeta> = [
  {
    slug: 'basic-atom',
    title: 'Basic Atom',
    blurb: 'Create reactive state with Atom.make() and consume it with useAtom.',
    panels: ['Counter'],
    writablePanels: ['Counter'],
  },
  {
    slug: 'derived-atom-i',
    title: 'Derived Atom I',
    blurb: 'Use the getter to derive read-only values that stay in sync with source atoms.',
    panels: ['Counter', 'Doubled'],
    writablePanels: ['Counter'],
  },
  {
    slug: 'derived-atom-ii',
    title: 'Derived Atom II',
    blurb: 'Derived atoms can watch multiple source atoms and recompute when any change.',
    panels: ['Text', 'Counter', 'Repeated'],
    writablePanels: ['Text', 'Counter'],
  },
  {
    slug: 'effectful-atom',
    title: 'Effectful Atom',
    blurb: 'An Effect atom reruns async logic automatically when a source atom changes.',
    panels: ['Counter', 'Dice', 'Total'],
    writablePanels: ['Counter'],
  },
  {
    slug: 'effectful-atom-ii',
    title: 'Effectful Atom II',
    blurb: 'Fetch real-world data from Open-Meteo whenever the selected city changes.',
    panels: ['City', 'Weather'],
    writablePanels: ['City'],
  },
  {
    slug: 'atom-fn',
    title: 'Atom.Fn',
    blurb: 'Trigger an Effect with an argument and expose its result as an atom.',
    panels: ['Roll', 'Dice', 'Total'],
    writablePanels: ['Roll'],
  },
  {
    slug: 'get-result',
    title: 'get.result',
    blurb: 'Combine independent async results and control whether stale values may be reused.',
    panels: ['Author', 'BooksPublished', 'AgeAtDeath', 'BooksPerYear'],
    writablePanels: ['Author'],
  },
  {
    slug: 'optimistic',
    title: 'Atom.optimistic',
    blurb: 'Update instantly, track the mutation, and roll back when the Effect fails.',
    panels: ['Like'],
  },
  {
    slug: 'todos',
    title: 'Todo List I',
    blurb: 'Effect service state, Atom.runtime, Atom.family, and reactive CRUD mutations.',
    panels: ['CreateTodo', 'TodoList', 'Stats'],
    writablePanels: ['CreateTodo'],
  },
  {
    slug: 'todos-ii',
    title: 'Todo List II',
    blurb: 'Derive a filtered todo list from service data and local filter state.',
    panels: ['CreateTodo', 'Filter', 'FilteredTodos', 'Stats'],
    writablePanels: ['CreateTodo', 'Filter'],
  },
  {
    slug: 'comments',
    title: 'Micro Comments',
    blurb: 'Authenticated micro comments with Effect RPC and optimistic atoms.',
    panels: ['MicroComments'],
  },
  {
    slug: 'streaming',
    title: 'Streaming Search',
    blurb: 'Compare Stream.scan, Atom.pull, and manual state for streaming results.',
    panels: ['StreamingSearch'],
  },
]

const componentModules = import.meta.glob('./*/*.vue', {
  import: 'default',
  eager: true,
}) as Record<string, Component>

export interface ExamplePanel {
  readonly name: string
  readonly label: string
  readonly writable: boolean
  readonly component: Component
}

export interface Example extends ExampleMeta {
  readonly components: ReadonlyArray<ExamplePanel>
}

const panelLabel = (name: string) => name.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase()

const build = (meta: ExampleMeta): Example => {
  const components = meta.panels.map((name) => {
    const component = componentModules[`./${meta.slug}/${name}.vue`]

    if (!component) {
      throw new Error(`Missing component "${name}" for example "${meta.slug}"`)
    }

    return {
      name,
      label: panelLabel(name),
      writable: meta.writablePanels?.includes(name) ?? false,
      component,
    }
  })

  return { ...meta, components }
}

const bySlug = new Map(examples.map((meta) => [meta.slug, build(meta)]))

export const getExample = (slug: string): Example | undefined => bySlug.get(slug)

export const exampleIndex = (slug: string): number => examples.findIndex((e) => e.slug === slug)
