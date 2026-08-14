<script setup lang="ts">
import BasePanel from '@/components/BasePanel.vue'
import BasePanelGrid from '@/components/BasePanelGrid.vue'

import TodoListForm from './TodoListForm.vue'
import TodoListItems from './TodoListItems.vue'
import TodoListStats from './TodoListStats.vue'
</script>

<template>
  <BasePanelGrid>
    <BasePanel label="Create todo" writable>
      <TodoListForm />
    </BasePanel>

    <BasePanel label="Todo list">
      <TodoListItems />
    </BasePanel>

    <BasePanel label="Stats">
      <TodoListStats />
    </BasePanel>
  </BasePanelGrid>
</template>
