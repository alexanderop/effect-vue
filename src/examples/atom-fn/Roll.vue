<script setup lang="ts">
import { useAtom } from '@effect/atom-vue'
import { rollDiceAtom } from './atoms'

const [result, roll] = useAtom(() => rollDiceAtom)
</script>

<template>
  <div class="actions standalone">
    <button :disabled="result.waiting" @click="roll()">
      {{ result.waiting ? 'Rolling...' : result._tag === 'Success' ? 'Reroll Dice' : 'Roll Dice' }}
    </button>
  </div>
</template>
