<script setup lang="ts">
import { useAtomRef, type AtomRef } from '@effect/atom-vue'
import { tagsRef } from './atoms'

// One component per item ref. This is the reason a collection hands back refs
// rather than values: each row subscribes to its own cell, so editing one tag
// does not re-render the others.
const props = defineProps<{ item: AtomRef.AtomRef<string> }>()

const tag = useAtomRef(() => props.item)
</script>

<template>
  <div class="todo-row">
    <input
      :aria-label="`Tag ${tag}`"
      :value="tag"
      @input="props.item.set(($event.target as HTMLInputElement).value)"
    />

    <button class="todo-delete" :aria-label="`Remove ${tag}`" @click="tagsRef.remove(props.item)">
      ×
    </button>
  </div>
</template>
