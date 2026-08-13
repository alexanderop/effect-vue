import { Atom } from '@effect/atom-vue'
import { Schema } from 'effect'
import * as KeyValueStore from 'effect/unstable/persistence/KeyValueStore'

const runtime = Atom.runtime(KeyValueStore.layerStorage(() => localStorage))

// Reads and writes go through the KeyValueStore, encoded with the schema. Swap
// the Layer for `layerMemory` in tests and nothing else changes.
export const nameAtom = Atom.kvs({
  runtime,
  key: 'effect-vue/name',
  schema: Schema.String,
  defaultValue: () => 'Ada',
})

export const themeAtom = Atom.kvs({
  runtime,
  key: 'effect-vue/theme',
  schema: Schema.Literals(['dark', 'light']),
  defaultValue: () => 'dark' as const,
})
