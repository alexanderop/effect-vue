<script setup lang="ts">
import BasePanel from '@/components/BasePanel.vue'
import BasePanelGrid from '@/components/BasePanelGrid.vue'

import AtomFnDice from './AtomFnDice.vue'
import AtomFnRoll from './AtomFnRoll.vue'
import AtomFnTotal from './AtomFnTotal.vue'
</script>

<template>
  <BasePanelGrid>
    <BasePanel label="Roll" writable>
      <AtomFnRoll />
    </BasePanel>

    <BasePanel label="Dice">
      <AtomFnDice />
    </BasePanel>

    <BasePanel label="Total">
      <AtomFnTotal />
    </BasePanel>
  </BasePanelGrid>
</template>
