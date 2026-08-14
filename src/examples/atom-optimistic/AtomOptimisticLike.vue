<script setup lang="ts">
import { computed } from 'vue'
import { AsyncResult, useAtom, useAtomSet, useAtomValue } from '@effect/atom-vue'
import { likeStatusAtom, optimisticLikeStatusAtom, setLikeAtom, simulateFailureAtom } from './atoms'

const result = useAtomValue(() => optimisticLikeStatusAtom)
const serverResult = useAtomValue(() => likeStatusAtom)
const setLike = useAtomSet(() => setLikeAtom)
const [simulateFailure, setSimulateFailure] = useAtom(() => simulateFailureAtom)

const status = computed(() =>
  AsyncResult.isSuccess(result.value) ? result.value.value : { isLiked: false, count: 41 },
)
const serverLikes = computed(() =>
  AsyncResult.isSuccess(serverResult.value) ? serverResult.value.value.count : 41,
)
</script>

<template>
  <div>
    <button class="optimistic-like" @click="setLike(!status.isLiked)">
      <span class="heart" aria-hidden="true">{{ status.isLiked ? '♥' : '♡' }}</span>
      <span class="optimistic-count">{{ status.count }}</span>
    </button>
    <div class="server-row" :class="{ waiting: serverResult.waiting }">
      <span class="label">Server Likes</span>
      <span>{{ serverLikes }}</span>
    </div>
    <label class="check-row">
      <input
        type="checkbox"
        :checked="simulateFailure"
        @change="setSimulateFailure(($event.target as HTMLInputElement).checked)"
      />
      Simulate Network Failures
    </label>
    <div class="hint">
      How it works: Click to like/unlike. The UI updates instantly with Atom.optimistic while the
      mutation runs. "Server Likes" dims during the ~1.2s request, then syncs with the confirmed
      state. Enable failure simulation to see automatic rollback.
    </div>
  </div>
</template>
