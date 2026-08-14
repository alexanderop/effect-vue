<script setup lang="ts">
import BasePanel from '@/components/BasePanel.vue'
import BasePanelGrid from '@/components/BasePanelGrid.vue'

import EffectfulAtomCounter from './EffectfulAtomCounter.vue'
import EffectfulAtomDice from './EffectfulAtomDice.vue'
import EffectfulAtomTotal from './EffectfulAtomTotal.vue'
</script>

<template>
  <BasePanelGrid>
    <BasePanel label="Counter" writable>
      <EffectfulAtomCounter />
    </BasePanel>

    <BasePanel label="Dice">
      <EffectfulAtomDice />
    </BasePanel>

    <BasePanel label="Total">
      <EffectfulAtomTotal />
    </BasePanel>
  </BasePanelGrid>
</template>
