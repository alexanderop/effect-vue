<script setup lang="ts">
import BasePanel from '@/components/BasePanel.vue'
import BasePanelGrid from '@/components/BasePanelGrid.vue'

import AtomFamilySelector from './AtomFamilySelector.vue'
import AtomFamilyVotes from './AtomFamilyVotes.vue'
</script>

<template>
  <BasePanelGrid>
    <BasePanel label="Selector" writable>
      <AtomFamilySelector />
    </BasePanel>

    <BasePanel label="Votes" writable>
      <AtomFamilyVotes />
    </BasePanel>
  </BasePanelGrid>
</template>
