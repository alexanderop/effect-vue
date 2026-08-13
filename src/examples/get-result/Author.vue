<script setup lang="ts">
import { useAtom } from '@effect/atom-vue'
import { authors, authorAtom } from './atoms'

const [author, setAuthor] = useAtom(() => authorAtom)
</script>

<template>
  <div>
    <div class="value small">{{ author.name }}</div>

    <div class="actions">
      <button
        v-for="option in authors"
        :key="option.name"
        :disabled="option.name === author.name"
        @click="setAuthor(option)"
      >
        {{ option.name }}
      </button>
    </div>
  </div>
</template>
