<script setup lang="ts">
import BasePanel from '@/components/BasePanel.vue'
import BasePanelGrid from '@/components/BasePanelGrid.vue'

import AtomRefDraft from './AtomRefDraft.vue'
import AtomRefSummary from './AtomRefSummary.vue'
import AtomRefTags from './AtomRefTags.vue'
</script>

<template>
  <BasePanelGrid>
    <BasePanel label="Draft" writable>
      <AtomRefDraft />
    </BasePanel>

    <BasePanel label="Summary">
      <AtomRefSummary />
    </BasePanel>

    <BasePanel label="Tags" writable>
      <AtomRefTags />
    </BasePanel>
  </BasePanelGrid>
</template>
