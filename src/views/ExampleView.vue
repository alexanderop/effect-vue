<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Repl, useStore, useVueImportMap, mergeImportMap } from '@vue/repl'
import Monaco from '@vue/repl/monaco-editor'
import '@vue/repl/style.css'

import { getExample } from '@/examples/registry'
import { buildFiles, MAIN_FILE } from '@/playground/buildFiles'
import { buildImportMap, dependencyVersion } from '@/playground/importMap'
import previewCss from '@/playground/preview.css?raw'

const props = defineProps<{ slug: string }>()

const { importMap: vueImportMap, vueVersion } = useVueImportMap()

const builtinImportMap = computed(() => mergeImportMap(vueImportMap.value, buildImportMap()))

const store = useStore({
  builtinImportMap,
  vueVersion,
  dependencyVersion: ref(dependencyVersion),
})

// One store for the whole tour. Swapping the file set is much cheaper than
// tearing down Monaco and the sandbox on every route change, and it keeps the
// compiler and the fetched type definitions warm between examples.
watch(
  () => props.slug,
  (slug) => {
    const example = getExample(slug)
    if (example) void store.setFiles(buildFiles(example), MAIN_FILE)
  },
  { immediate: true },
)

const previewOptions = {
  headHTML: `<style>${previewCss}</style>`,
}
</script>

<template>
  <Repl
    :store="store"
    :editor="Monaco"
    theme="dark"
    :preview-options="previewOptions"
    :clear-console="false"
    :show-compile-output="true"
    :show-import-map="true"
    :auto-resize="true"
  />
</template>

<style scoped>
.vue-repl {
  height: 100%;
}
</style>
