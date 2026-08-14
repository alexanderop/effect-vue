<script setup lang="ts">
import BasePanel from '@/components/BasePanel.vue'
import BasePanelGrid from '@/components/BasePanelGrid.vue'

import DerivedAtomCounter from './DerivedAtomCounter.vue'
import DerivedAtomDoubled from './DerivedAtomDoubled.vue'
</script>

<template>
  <BasePanelGrid>
    <BasePanel label="Counter" writable>
      <DerivedAtomCounter />
    </BasePanel>

    <BasePanel label="Doubled">
      <DerivedAtomDoubled />
    </BasePanel>
  </BasePanelGrid>
</template>
