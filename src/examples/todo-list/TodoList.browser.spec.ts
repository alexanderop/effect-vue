import { expect, test } from 'vitest'

import { eventually, panel } from '@/testing/browser'
import { mountWithRegistry } from '@/testing/mountWithRegistry'

import TodoList from './TodoList.vue'

test('creates, toggles, counts, and deletes a todo', async () => {
  const mounted = mountWithRegistry(TodoList, { label: 'Todo List' })
  const create = panel('Create todo')
  const list = panel('Todo list')
  const stats = panel('Stats')

  try {
    await expect.element(list.getByText('No todos yet. Create one to get started!')).toBeVisible()

    await create.getByPlaceholder('What needs to be done?').fill('Test the page')
    await create.getByRole('button', { name: 'Add' }).click()
    await expect.element(list.getByText('Test the page', { exact: true })).toBeVisible()
    await eventually(() =>
      expect(stats.element().querySelectorAll('strong')[1]?.textContent).toBe('1'),
    )

    await list.getByRole('button', { name: 'Toggle Test the page' }).click()
    await eventually(() =>
      expect(stats.element().querySelectorAll('strong')[2]?.textContent).toBe('1'),
    )

    await list.getByRole('button', { name: 'Delete' }).click()
    await expect.element(list.getByText('No todos yet. Create one to get started!')).toBeVisible()
  } finally {
    mounted.cleanup()
  }
})
