import { expect, test } from 'vitest'

import { panel } from '@/testing/browser'
import { mountWithRegistry } from '@/testing/mountWithRegistry'

import DerivedAtom from './DerivedAtom.vue'

test('keeps the doubled panel synchronized with its source', async () => {
  const mounted = mountWithRegistry(DerivedAtom, { label: 'Derived Atom' })
  const counter = panel('Counter')
  const doubled = panel('Doubled')

  try {
    await expect.element(doubled.getByText('0', { exact: true })).toBeVisible()

    await counter.getByRole('button', { name: 'Increase' }).click()

    await expect.element(counter.getByText('1', { exact: true })).toBeVisible()
    await expect.element(doubled.getByText('2', { exact: true })).toBeVisible()
  } finally {
    mounted.cleanup()
  }
})
