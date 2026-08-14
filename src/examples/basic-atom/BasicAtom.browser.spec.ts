import { expect, test } from 'vitest'

import { panel } from '@/testing/browser'
import { mountWithRegistry } from '@/testing/mountWithRegistry'

import BasicAtom from './BasicAtom.vue'

test('decreases, resets, and increases the count', async () => {
  const mounted = mountWithRegistry(BasicAtom, { label: 'Basic Atom' })
  const counter = panel('Counter')

  try {
    await expect.element(counter.getByText('0', { exact: true })).toBeVisible()

    await counter.getByRole('button', { name: 'Decrease' }).click()
    await expect.element(counter.getByText('-1', { exact: true })).toBeVisible()

    await counter.getByRole('button', { name: 'Reset' }).click()
    await counter.getByRole('button', { name: 'Increase' }).click()
    await expect.element(counter.getByText('1', { exact: true })).toBeVisible()
  } finally {
    mounted.cleanup()
  }
})
