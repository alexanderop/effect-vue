import { expect, test } from 'vitest'

import { eventually, panel } from '../../support/browser'
import { mountExample } from '../../support/mountExample'

test('Todo List I creates, toggles, counts, and deletes a todo', async () => {
  const mounted = mountExample('todos')
  const create = panel('CREATE TODO')
  const list = panel('TODO LIST')
  const stats = panel('STATS')

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
