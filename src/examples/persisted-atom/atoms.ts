import { Atom } from '@effect/atom-vue'
import { Schema } from 'effect'
import * as KeyValueStore from 'effect/unstable/persistence/KeyValueStore'

/**
 * Reads and writes go through the KeyValueStore, encoded with the schema.
 *
 * The store is a Layer, so the same atoms can be built against a different
 * backend without touching a component — which is exactly what the Node spec
 * does with `layerMemory`.
 */
export const makeSettingsAtoms = (
  runtime: Atom.AtomRuntime<KeyValueStore.KeyValueStore, never>,
) => ({
  nameAtom: Atom.kvs({
    runtime,
    key: 'effect-vue/name',
    schema: Schema.String,
    defaultValue: () => 'Ada',
  }),
  themeAtom: Atom.kvs({
    runtime,
    key: 'effect-vue/theme',
    schema: Schema.Literals(['dark', 'light']),
    defaultValue: () => 'dark' as const,
  }),
})

// The app runs against localStorage. `layerStorage` is lazy, so importing this
// module outside a browser is safe as long as nothing subscribes.
export const { nameAtom, themeAtom } = makeSettingsAtoms(
  Atom.runtime(KeyValueStore.layerStorage(() => localStorage)),
)
