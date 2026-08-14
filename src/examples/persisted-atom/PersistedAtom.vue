<script setup lang="ts">
import BasePanel from '@/components/BasePanel.vue'
import BasePanelGrid from '@/components/BasePanelGrid.vue'

import PersistedAtomSettings from './PersistedAtomSettings.vue'
</script>

<template>
  <BasePanelGrid>
    <BasePanel label="Settings" writable>
      <PersistedAtomSettings />
    </BasePanel>
  </BasePanelGrid>
</template>
