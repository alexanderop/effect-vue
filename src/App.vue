<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { examples } from '@/examples/registry'

const route = useRoute()
const router = useRouter()

const index = computed(() => examples.findIndex((e) => e.slug === route.params.slug))
const current = computed(() => examples[index.value])

const go = (delta: number) => {
  const next = examples[index.value + delta]
  if (next) router.push(`/${next.slug}`)
}

const onKey = (event: KeyboardEvent) => {
  if (event.metaKey || event.ctrlKey || event.altKey) return

  const target = event.target
  if (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  ) {
    return
  }

  if (event.key === 'ArrowLeft') go(-1)
  if (event.key === 'ArrowRight') go(1)
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="shell">
    <header class="top">
      <div class="heading">
        <h1>{{ current?.title ?? 'Effect Atom' }}</h1>
      </div>

      <nav class="nav">
        <span class="count">{{ index + 1 }} / {{ examples.length }}</span>
        <button aria-label="Previous example" :disabled="index <= 0" @click="go(-1)">
          <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
            <path
              d="M10 2 4 8l6 6"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="square"
            />
          </svg>
        </button>
        <button aria-label="Next example" :disabled="index >= examples.length - 1" @click="go(1)">
          <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
            <path
              d="M6 2l6 6-6 6"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="square"
            />
          </svg>
        </button>
      </nav>
    </header>

    <main class="body">
      <RouterView v-slot="{ Component, route: activeRoute }">
        <component :is="Component" :key="String(activeRoute.params.slug)" />
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.shell {
  min-height: 100%;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
}

.top {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 65px;
  padding: 14px 24px;
  border-bottom: 1px solid var(--line);
  background: color-mix(in srgb, var(--bg) 92%, transparent);
  backdrop-filter: blur(12px);
}

h1 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.nav {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
}

.count {
  margin-right: 8px;
  font-size: 12px;
  color: var(--dim);
  font-variant-numeric: tabular-nums;
}

.nav button {
  display: grid;
  place-items: center;
  width: 42px;
  height: 36px;
  background: #171717;
  transition: background-color 100ms ease;
}

.nav button:hover:not(:disabled) {
  background: rgba(127, 219, 202, 0.1);
}

@media (max-width: 560px) {
  .top {
    gap: 12px;
    padding-inline: 16px;
  }

  h1 {
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .count {
    display: none;
  }
}
</style>
