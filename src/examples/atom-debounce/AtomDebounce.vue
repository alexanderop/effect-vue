<script setup lang="ts">
import BasePanel from '@/components/BasePanel.vue'
import BasePanelGrid from '@/components/BasePanelGrid.vue'

import AtomDebounceInput from './AtomDebounceInput.vue'
import AtomDebounceResults from './AtomDebounceResults.vue'
</script>

<template>
  <BasePanelGrid>
    <BasePanel label="Query" writable>
      <AtomDebounceInput />
    </BasePanel>

    <BasePanel label="Results">
      <AtomDebounceResults />
    </BasePanel>
  </BasePanelGrid>
</template>
