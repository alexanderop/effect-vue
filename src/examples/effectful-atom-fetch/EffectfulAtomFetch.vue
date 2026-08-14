<script setup lang="ts">
import BasePanel from '@/components/BasePanel.vue'
import BasePanelGrid from '@/components/BasePanelGrid.vue'

import EffectfulAtomFetchCity from './EffectfulAtomFetchCity.vue'
import EffectfulAtomFetchWeather from './EffectfulAtomFetchWeather.vue'
</script>

<template>
  <BasePanelGrid>
    <BasePanel label="City" writable>
      <EffectfulAtomFetchCity />
    </BasePanel>

    <BasePanel label="Weather">
      <EffectfulAtomFetchWeather />
    </BasePanel>
  </BasePanelGrid>
</template>
