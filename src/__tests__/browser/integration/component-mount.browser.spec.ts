import { expect, test } from 'vitest'
import { page } from 'vitest/browser'

import BasicAtomCounter from '@/examples/basic-atom/BasicAtomCounter.vue'
import { mountWithRegistry } from '@/testing/mountWithRegistry'

test('updates an Effect Atom through a registry-mounted Vue component', async () => {
  const mounted = mountWithRegistry(BasicAtomCounter, { label: 'Counter example' })
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
