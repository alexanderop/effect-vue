import { expect, test } from 'vitest'
import { page } from 'vitest/browser'

import Counter from '../../../examples/basic-atom/Counter.vue'
import { mountWithRegistry } from '../../support/mountWithRegistry'

test('updates an Effect Atom through a registry-mounted Vue component', async () => {
  const mounted = mountWithRegistry(Counter, { label: 'Counter example' })
  const counter = page.getByRole('region', { name: 'Counter example' })

  try {
    await expect.element(counter.getByText('0', { exact: true })).toBeVisible()

    await counter.getByRole('button', { name: 'Increase' }).click()
    await expect.element(counter.getByText('1', { exact: true })).toBeVisible()

    await counter.getByRole('button', { name: 'Reset' }).click()
    await expect.element(counter.getByText('0', { exact: true })).toBeVisible()
  } finally {
    mounted.cleanup()
  }
})
