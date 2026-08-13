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
        <p v-if="current" class="blurb">{{ current.blurb }}</p>
      </div>

      <nav class="nav">
        <a
          class="credit"
          href="https://atom.kitlangton.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          after kitlangton
        </a>
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
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.shell {
  height: 100%;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--line);
}

.heading {
  min-width: 0;
}

h1 {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.blurb {
  margin: 5px 0 0;
  font-size: 12px;
  color: var(--dim);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
}

.credit {
  font-size: 12px;
  color: var(--dim);
  text-decoration: none;
}

.credit:hover {
  color: var(--fg);
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
  width: 34px;
  height: 28px;
  border: 1px solid var(--line);
  transition: background-color 100ms ease;
}

.nav button:hover:not(:disabled) {
  background: rgba(127, 219, 202, 0.1);
}

@media (max-width: 700px) {
  .blurb,
  .credit {
    display: none;
  }
}
</style>
