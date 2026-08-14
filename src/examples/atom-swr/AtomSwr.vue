<script setup lang="ts">
import BasePanel from '@/components/BasePanel.vue'
import BasePanelGrid from '@/components/BasePanelGrid.vue'

import AtomSwrStatus from './AtomSwrStatus.vue'
import { alwaysAtom, freshFirstAtom } from './atoms'
</script>

<template>
  <BasePanelGrid>
    <BasePanel label="Fresh first">
      <AtomSwrStatus name="Fresh first" :atom="freshFirstAtom">
        Switch to another tab and come back. Within five seconds of the last load this panel does
        nothing, because its value is still fresh. A manual refresh ignores that and refetches.
      </AtomSwrStatus>
    </BasePanel>

    <BasePanel label="Always">
      <AtomSwrStatus name="Always" :atom="alwaysAtom">
        Same fetch, same staleTime, but revalidateOnFocus is "always" — every return to the tab
        refetches, however fresh the value is.
      </AtomSwrStatus>
    </BasePanel>
  </BasePanelGrid>
</template>
