<script setup lang="ts">
import BasePanel from '@/components/BasePanel.vue'
import BasePanelGrid from '@/components/BasePanelGrid.vue'

import BasicAtomCounter from './BasicAtomCounter.vue'
</script>

<template>
  <BasePanelGrid>
    <BasePanel label="Counter" writable>
      <BasicAtomCounter />
    </BasePanel>
  </BasePanelGrid>
</template>
