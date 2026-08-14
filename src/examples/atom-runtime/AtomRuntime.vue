<script setup lang="ts">
import BasePanel from '@/components/BasePanel.vue'
import BasePanelGrid from '@/components/BasePanelGrid.vue'

import AtomRuntimeGreeting from './AtomRuntimeGreeting.vue'
</script>

<template>
  <BasePanelGrid>
    <BasePanel label="Greeting" writable>
      <AtomRuntimeGreeting />
    </BasePanel>
  </BasePanelGrid>
</template>
