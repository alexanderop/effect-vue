<script setup lang="ts">
import BasePanel from '@/components/BasePanel.vue'
import BasePanelGrid from '@/components/BasePanelGrid.vue'

import AtomPullFeed from './AtomPullFeed.vue'
</script>

<template>
  <BasePanelGrid>
    <BasePanel label="Feed" writable>
      <AtomPullFeed />
    </BasePanel>
  </BasePanelGrid>
</template>
