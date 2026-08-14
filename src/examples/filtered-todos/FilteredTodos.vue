<script setup lang="ts">
import BasePanel from '@/components/BasePanel.vue'
import BasePanelGrid from '@/components/BasePanelGrid.vue'

import FilteredTodosFilter from './FilteredTodosFilter.vue'
import FilteredTodosForm from './FilteredTodosForm.vue'
import FilteredTodosList from './FilteredTodosList.vue'
import FilteredTodosStats from './FilteredTodosStats.vue'
</script>

<template>
  <BasePanelGrid>
    <BasePanel label="Create todo" writable>
      <FilteredTodosForm />
    </BasePanel>

    <BasePanel label="Filter" writable>
      <FilteredTodosFilter />
    </BasePanel>

    <BasePanel label="Filtered todos">
      <FilteredTodosList />
    </BasePanel>

    <BasePanel label="Stats">
      <FilteredTodosStats />
    </BasePanel>
  </BasePanelGrid>
</template>
