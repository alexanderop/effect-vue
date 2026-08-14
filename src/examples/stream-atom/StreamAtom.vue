<script setup lang="ts">
import BasePanel from '@/components/BasePanel.vue'
import BasePanelGrid from '@/components/BasePanelGrid.vue'

import StreamAtomElapsed from './StreamAtomElapsed.vue'
import StreamAtomTicks from './StreamAtomTicks.vue'
</script>

<template>
  <BasePanelGrid>
    <BasePanel label="Ticks">
      <StreamAtomTicks />
    </BasePanel>

    <BasePanel label="Elapsed">
      <StreamAtomElapsed />
    </BasePanel>
  </BasePanelGrid>
</template>
