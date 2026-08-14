<script setup lang="ts">
import BasePanel from '@/components/BasePanel.vue'
import BasePanelGrid from '@/components/BasePanelGrid.vue'

import GetResultAgeAtDeath from './GetResultAgeAtDeath.vue'
import GetResultAuthor from './GetResultAuthor.vue'
import GetResultBooksPerYear from './GetResultBooksPerYear.vue'
import GetResultBooksPublished from './GetResultBooksPublished.vue'
</script>

<template>
  <BasePanelGrid>
    <BasePanel label="Author" writable>
      <GetResultAuthor />
    </BasePanel>

    <BasePanel label="Books published">
      <GetResultBooksPublished />
    </BasePanel>

    <BasePanel label="Age at death">
      <GetResultAgeAtDeath />
    </BasePanel>

    <BasePanel label="Books per year">
      <GetResultBooksPerYear />
    </BasePanel>
  </BasePanelGrid>
</template>
