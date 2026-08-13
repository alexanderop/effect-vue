import { expect, test } from 'vitest'

import { panel } from '../../support/browser'
import { mountExample } from '../../support/mountExample'

test('Basic Atom supports decrease, reset, and increase', async () => {
  const mounted = mountExample('basic-atom')
  const counter = panel('COUNTER')

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
