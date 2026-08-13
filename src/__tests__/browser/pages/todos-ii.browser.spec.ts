import { expect, test } from 'vitest'

import { panel } from '../../support/browser'
import { mountExample } from '../../support/mountExample'

test('Todo List II filters open and completed todos', async () => {
  const mounted = mountExample('todos-ii')
  const create = panel('CREATE TODO')
  const filter = panel('FILTER')
  const list = panel('FILTERED TODOS')

  try {
    const input = create.getByPlaceholder('What needs to be done?')
    await input.fill('First todo')
    await create.getByRole('button', { name: 'Add' }).click()
    await input.fill('Second todo')
    await create.getByRole('button', { name: 'Add' }).click()

    await expect.element(list.getByText('First todo', { exact: true })).toBeVisible()
    await expect.element(list.getByText('Second todo', { exact: true })).toBeVisible()
    await list.getByRole('button', { name: 'Toggle First todo' }).click()

    await filter.getByRole('button', { name: 'DONE' }).click()
    await expect.element(list.getByText('First todo', { exact: true })).toBeVisible()
    await expect.element(list.getByText('Second todo', { exact: true })).not.toBeInTheDocument()

    await filter.getByRole('button', { name: 'OPEN' }).click()
    await expect.element(list.getByText('First todo', { exact: true })).not.toBeInTheDocument()
    await expect.element(list.getByText('Second todo', { exact: true })).toBeVisible()
  } finally {
    mounted.cleanup()
  }
})
