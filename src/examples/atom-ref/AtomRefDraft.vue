<script setup lang="ts">
import { useAtomRef } from '@effect/atom-vue'
import { bodyRef, titleRef } from './atoms'

// `useAtomRef` subscribes to the ref and hands back a readonly Vue ref. There is
// no registry to inject — the AtomRef *is* the source.
const title = useAtomRef(() => titleRef)
const body = useAtomRef(() => bodyRef)
</script>

<template>
  <div>
    <div class="inline-form">
      <input
        aria-label="Title"
        placeholder="Title"
        :value="title"
        @input="titleRef.set(($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="inline-form">
      <input
        aria-label="Body"
        placeholder="Body"
        :value="body"
        @input="bodyRef.set(($event.target as HTMLInputElement).value)"
      />
    </div>

    <p class="hint">
      Both inputs write through a <strong>prop</strong> ref. Each one owns a single field, and the
      parent draft still sees every write.
    </p>
  </div>
</template>
