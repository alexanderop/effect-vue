<script setup lang="ts">
import BasePanel from '@/components/BasePanel.vue'
import BasePanelGrid from '@/components/BasePanelGrid.vue'

import AtomOptimisticLike from './AtomOptimisticLike.vue'
</script>

<template>
  <BasePanelGrid>
    <BasePanel label="Like" writable>
      <AtomOptimisticLike />
    </BasePanel>
  </BasePanelGrid>
</template>
