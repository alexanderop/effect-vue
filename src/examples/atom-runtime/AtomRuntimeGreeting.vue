<script setup lang="ts">
import { ref } from 'vue'
import { useAtom } from '@effect/atom-vue'
import { greetingAtom } from './atoms'

const name = ref('Vue')

const [greeting, greet] = useAtom(() => greetingAtom)
</script>

<template>
  <div>
    <input v-model="name" placeholder="Your name" @keyup.enter="greet(name)" />

    <div class="value small" :class="{ muted: greeting._tag !== 'Success' }">
      {{ greeting._tag === 'Success' ? greeting.value : 'Nothing yet' }}
    </div>

    <div class="actions">
      <button :disabled="greeting.waiting" @click="greet(name)">
        {{ greeting.waiting ? 'Greeting…' : 'Greet' }}
      </button>
    </div>
  </div>
</template>
