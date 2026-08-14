<script setup lang="ts">
import BasePanel from '@/components/BasePanel.vue'
import BasePanelGrid from '@/components/BasePanelGrid.vue'

import AsyncResultStatesQuote from './AsyncResultStatesQuote.vue'
</script>

<template>
  <BasePanelGrid>
    <BasePanel label="Quote">
      <AsyncResultStatesQuote />
    </BasePanel>
  </BasePanelGrid>
</template>
