<script setup lang="ts">
import { useAtomRef } from '@effect/atom-vue'
import { ref } from 'vue'

import AtomRefTag from './AtomRefTag.vue'
import { tagsRef } from './atoms'

// The collection's own value is the array of item refs.
const tags = useAtomRef(() => tagsRef)

const draft = ref('')

const add = () => {
  const value = draft.value.trim()
  if (value === '') return
  tagsRef.push(value)
  draft.value = ''
}
</script>

<template>
  <div>
    <AtomRefTag v-for="item in tags" :key="item.key" :item="item" />

    <div class="inline-form">
      <input v-model="draft" aria-label="New tag" placeholder="Add a tag…" @keyup.enter="add" />
      <button @click="add">Add</button>
    </div>

    <p class="hint">
      Every row is keyed by the ref's own <strong>key</strong>, so Vue reuses the component even
      when the tag's text changes.
    </p>
  </div>
</template>
