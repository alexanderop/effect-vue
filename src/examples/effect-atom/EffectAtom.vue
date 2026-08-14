<script setup lang="ts">
import BasePanel from '@/components/BasePanel.vue'
import BasePanelGrid from '@/components/BasePanelGrid.vue'

import EffectAtomUser from './EffectAtomUser.vue'
</script>

<template>
  <BasePanelGrid>
    <BasePanel label="User">
      <EffectAtomUser />
    </BasePanel>
  </BasePanelGrid>
</template>
