<script setup lang="ts">
import { useAtom } from '@effect/atom-vue'
import { Option } from 'effect'
import { computed } from 'vue'

import { pageAtom } from './atoms'

// With a schema the atom holds an Option, so "absent" and "present" are two
// cases in the type rather than a sentinel value to remember.
const [page, setPage] = useAtom(() => pageAtom)

const current = computed(() => Option.getOrElse(page.value, () => 1))
</script>

<template>
  <div>
    <div class="value">
      {{ Option.isNone(page) ? 'not set' : current }}
    </div>

    <div class="actions">
      <button :disabled="current <= 1" @click="setPage(Option.some(current - 1))">Previous</button>
      <!-- Writing None removes the parameter from the URL entirely. -->
      <button :disabled="Option.isNone(page)" @click="setPage(Option.none())">Clear</button>
      <button @click="setPage(Option.some(current + 1))">Next</button>
    </div>

    <p class="hint">
      <strong>?page=</strong> decoded through <strong>Schema.NumberFromString</strong>, with a check
      that the page is at least 1. Junk, an absent parameter, and 0 all read as None — no NaN, and
      no sentinel to remember.
    </p>
  </div>
</template>
