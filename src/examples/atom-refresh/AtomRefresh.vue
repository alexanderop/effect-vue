<script setup lang="ts">
import BasePanel from '@/components/BasePanel.vue'
import BasePanelGrid from '@/components/BasePanelGrid.vue'

import AtomRefreshAuto from './AtomRefreshAuto.vue'
import AtomRefreshManual from './AtomRefreshManual.vue'
</script>

<template>
  <BasePanelGrid>
    <BasePanel label="Manual refresh" writable>
      <AtomRefreshManual />
    </BasePanel>

    <BasePanel label="Auto refresh">
      <AtomRefreshAuto />
    </BasePanel>
  </BasePanelGrid>
</template>
