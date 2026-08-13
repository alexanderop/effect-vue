import { expect, test } from 'vitest'

import { panel } from '../../support/browser'
import { mountExample } from '../../support/mountExample'

test('Derived Atom I keeps the doubled panel synchronized', async () => {
  const mounted = mountExample('derived-atom-i')
  const counter = panel('COUNTER')
  const doubled = panel('DOUBLED')

  try {
    await expect.element(doubled.getByText('0', { exact: true })).toBeVisible()
    await counter.getByRole('button', { name: 'Increase' }).click()
    await expect.element(counter.getByText('1', { exact: true })).toBeVisible()
    await expect.element(doubled.getByText('2', { exact: true })).toBeVisible()
  } finally {
    mounted.cleanup()
  }
})
