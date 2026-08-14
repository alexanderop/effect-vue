<script setup lang="ts">
import BasePanel from '@/components/BasePanel.vue'
import BasePanelGrid from '@/components/BasePanelGrid.vue'

import DerivedAtomMultiSourceCounter from './DerivedAtomMultiSourceCounter.vue'
import DerivedAtomMultiSourceRepeated from './DerivedAtomMultiSourceRepeated.vue'
import DerivedAtomMultiSourceText from './DerivedAtomMultiSourceText.vue'
</script>

<template>
  <BasePanelGrid>
    <BasePanel label="Text" writable>
      <DerivedAtomMultiSourceText />
    </BasePanel>

    <BasePanel label="Counter" writable>
      <DerivedAtomMultiSourceCounter />
    </BasePanel>

    <BasePanel label="Repeated">
      <DerivedAtomMultiSourceRepeated />
    </BasePanel>
  </BasePanelGrid>
</template>
