<script setup lang="ts">
import BasePanel from '@/components/BasePanel.vue'
import BasePanelGrid from '@/components/BasePanelGrid.vue'

import SearchParamPage from './SearchParamPage.vue'
import SearchParamQuery from './SearchParamQuery.vue'
import SearchParamUrl from './SearchParamUrl.vue'
</script>

<template>
  <BasePanelGrid>
    <BasePanel label="Query" writable>
      <SearchParamQuery />
    </BasePanel>

    <BasePanel label="Page" writable>
      <SearchParamPage />
    </BasePanel>

    <BasePanel label="Location">
      <SearchParamUrl />
    </BasePanel>
  </BasePanelGrid>
</template>
