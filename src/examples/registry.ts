/**
 * The ordered tour. Each entry maps to a directory under `src/examples/`.
 *
 * Convention inside a directory:
 *  - `atoms.ts` (optional) holds the atom definitions and is shown first
 *  - every `.vue` file becomes its own labelled panel, alphabetically
 *
 * The files are only ever read as text: they are handed to the REPL, compiled
 * in the browser and run inside its sandbox iframe. Nothing here is imported
 * into the host app, so the source on screen is the source that is running.
 */
export interface ExampleMeta {
  readonly slug: string
  readonly title: string
  readonly blurb: string
}

export const examples: ReadonlyArray<ExampleMeta> = [
  {
    slug: 'basic-atom',
    title: 'Basic Atom',
    blurb: 'A writable atom holding a plain value, read and written with useAtom.',
  },
  {
    slug: 'derived-atom',
    title: 'Derived Atom',
    blurb: 'An atom computed from another atom. Recomputes only when a dependency changes.',
  },
  {
    slug: 'derived-atom-ii',
    title: 'Derived Atom II',
    blurb: 'One derived atom over several sources, recomputed when any of them changes.',
  },
  {
    slug: 'writable-derived',
    title: 'Writable Derived',
    blurb: 'A derived atom with a write function, so reads and writes can differ.',
  },
  {
    slug: 'atom-family',
    title: 'Atom Family',
    blurb: 'One atom per key, created lazily and garbage collected when unused.',
  },
  {
    slug: 'effect-atom',
    title: 'Effect Atom',
    blurb: 'An atom whose value is produced by an Effect, exposed as an AsyncResult.',
  },
  {
    slug: 'effect-atom-ii',
    title: 'Effect Atom II',
    blurb: 'An Effect atom that depends on another atom, and a plain atom derived from its result.',
  },
  {
    slug: 'effect-atom-iii',
    title: 'Effect Atom III',
    blurb: 'A real request inside an atom: fetch, decode with a Schema, cancel on change.',
  },
  {
    slug: 'async-result',
    title: 'AsyncResult',
    blurb: 'Matching on Initial / Success / Failure, including the waiting flag.',
  },
  {
    slug: 'get-result',
    title: 'get.result',
    blurb: 'Unwrap other Effect atoms inside an Effect atom, suspending until they settle.',
  },
  {
    slug: 'atom-fn',
    title: 'Atom Fn',
    blurb: 'Run an Effect on demand with an argument, and interrupt the previous run.',
  },
  {
    slug: 'atom-runtime',
    title: 'Atom Runtime',
    blurb: 'Build atoms on top of a Layer so they can use Effect services.',
  },
  {
    slug: 'stream-atom',
    title: 'Stream Atom',
    blurb: 'An atom fed by a Stream. The subscription lives as long as the atom is mounted.',
  },
  {
    slug: 'atom-pull',
    title: 'Atom Pull',
    blurb: 'Pull a Stream one chunk at a time — pagination without a state machine.',
  },
  {
    slug: 'swr-refresh',
    title: 'SWR & Refresh',
    blurb: 'Serve stale data while revalidating, and refresh on demand.',
  },
  {
    slug: 'persisted-atom',
    title: 'Persisted Atom',
    blurb: 'An atom backed by a KeyValueStore, here localStorage. Reload the page.',
  },
]

const rawSources = import.meta.glob('./*/*.{ts,vue}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export interface SourceFile {
  readonly name: string
  readonly lang: 'ts' | 'vue'
  readonly code: string
}

export interface Example extends ExampleMeta {
  readonly files: ReadonlyArray<SourceFile>
}

const fileName = (path: string) => path.slice(path.lastIndexOf('/') + 1)

const sortFiles = (a: string, b: string) => {
  // `atoms.ts` always leads: it is where the example is defined.
  const rank = (p: string) => (fileName(p) === 'atoms.ts' ? 0 : 1)
  return rank(a) - rank(b) || a.localeCompare(b)
}

const build = (meta: ExampleMeta): Example => {
  const prefix = `./${meta.slug}/`

  const files = Object.keys(rawSources)
    .filter((path) => path.startsWith(prefix))
    .sort(sortFiles)
    .map((path) => ({
      name: fileName(path),
      lang: path.endsWith('.vue') ? ('vue' as const) : ('ts' as const),
      code: rawSources[path]!.trimEnd(),
    }))

  return { ...meta, files }
}

const bySlug = new Map(examples.map((meta) => [meta.slug, build(meta)]))

export const getExample = (slug: string): Example | undefined => bySlug.get(slug)

export const exampleIndex = (slug: string): number => examples.findIndex((e) => e.slug === slug)
