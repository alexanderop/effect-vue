import type { Example, SourceFile } from '@/examples/registry'

export const MAIN_FILE = 'src/App.vue'

const componentName = (file: SourceFile) => file.name.replace(/\.vue$/, '')

/** `Counter` -> `COUNTER`, `AsyncResult` -> `ASYNC RESULT`. */
const label = (name: string) => name.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase()

/**
 * The entry point the sandbox mounts.
 *
 * It is generated rather than checked in because it is pure wiring: it imports
 * the `.vue` files listed in the example metadata and gives each one a labelled
 * panel. Keeping it in the file list (instead of hiding it) is
 * deliberate — it shows how the registry gets provided, which is the one piece
 * of setup the individual example components assume but never show.
 */
const generateApp = (
  panels: ReadonlyArray<SourceFile>,
  panelOrder: ReadonlyArray<string>,
  writablePanels: ReadonlyArray<string>,
): string => {
  const names = panels.map(componentName)
  const mountedNames = panelOrder.filter((name) => names.includes(name))

  const imports = mountedNames.map((name) => `import ${name} from './${name}.vue'`).join('\n')

  const sections = mountedNames
    .map(
      (name) => `    <section class="panel">
      <header class="panel-head">
        <span>${label(name)}</span>${writablePanels.includes(name) ? '\n        <span class="panel-status">WRITABLE</span>' : ''}
      </header>
      <div class="panel-body"><${name} /></div>
    </section>`,
    )
    .join('\n')

  return `<script setup lang="ts">
import { provide } from 'vue'
import { AtomRegistry, registryKey } from '@effect/atom-vue'

${imports}

// Every \`useAtom*\` call resolves its registry through \`inject\`. Providing one
// here scopes all atom state to this app instead of the module-level default.
provide(registryKey, AtomRegistry.make())
</script>

<template>
  <div class="panels">
${sections}
  </div>
</template>
`
}

/**
 * The REPL feeds this file's `compilerOptions` to the Volar worker that powers
 * Monaco's type checking. It has to be part of every file set we hand to
 * `setFiles`: that call rebuilds the store's file record from scratch, so a
 * tsconfig the store seeded on init is dropped on the first route change and
 * `getTsConfig()` falls back to `{}`.
 *
 * With `{}` the worker type-checks under TypeScript's defaults — `module`
 * CommonJS and Node10 resolution — which ignores `exports` maps. `effect` only
 * publishes its type entry points through `exports` (`"./*": "./dist/*.js"`),
 * so `effect/unstable/reactivity/Atom` and friends resolve to nothing, every
 * atom type degrades to `any`, and the editor reports cascading nonsense
 * errors that the real `vue-tsc` build does not have.
 */
const TSCONFIG = JSON.stringify(
  {
    compilerOptions: {
      strict: true,
      jsx: 'preserve',
      target: 'ESNext',
      module: 'ESNext',
      moduleResolution: 'Bundler',
      allowImportingTsExtensions: true,
      noUncheckedIndexedAccess: true,
    },
  },
  undefined,
  2,
)

/**
 * Turn a registry example into the flat `filename -> source` record the REPL
 * store takes. Sources are passed through untouched, so what runs in the
 * sandbox is exactly what lives in `src/examples/<slug>/`.
 */
export const buildFiles = (example: Example): Record<string, string> => {
  const files: Record<string, string> = {
    'import-map.json': '{}',
    'tsconfig.json': TSCONFIG,
  }

  for (const file of example.files) {
    files[`src/${file.name}`] = file.code
  }

  const panels = example.files.filter((file) => file.lang === 'vue')
  files[MAIN_FILE] = generateApp(panels, example.panels, example.writablePanels ?? [])

  return files
}
