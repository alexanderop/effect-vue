<script setup lang="ts">
import BasePanel from '@/components/BasePanel.vue'
import BasePanelGrid from '@/components/BasePanelGrid.vue'

import WritableDerivedAtomCelsius from './WritableDerivedAtomCelsius.vue'
import WritableDerivedAtomFahrenheit from './WritableDerivedAtomFahrenheit.vue'
</script>

<template>
  <BasePanelGrid>
    <BasePanel label="Celsius" writable>
      <WritableDerivedAtomCelsius />
    </BasePanel>

    <BasePanel label="Fahrenheit" writable>
      <WritableDerivedAtomFahrenheit />
    </BasePanel>
  </BasePanelGrid>
</template>
