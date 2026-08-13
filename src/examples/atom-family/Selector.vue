<script setup lang="ts">
import { useAtom } from '@effect/atom-vue'
import { frameworks, selectedAtom } from './atoms'

const [selected, setSelected] = useAtom(() => selectedAtom)
</script>

<template>
  <div>
    <div class="value small">{{ selected }}</div>

    <div class="actions">
      <button v-for="framework in frameworks" :key="framework" @click="setSelected(framework)">
        {{ framework }}
      </button>
    </div>
  </div>
</template>
