import { expect, test } from 'vitest'

import { panel } from '@/testing/browser'
import { mountWithRegistry } from '@/testing/mountWithRegistry'

import DerivedAtomMultiSource from './DerivedAtomMultiSource.vue'

test('recomputes when either source changes', async () => {
  const mounted = mountWithRegistry(DerivedAtomMultiSource, {
    label: 'Derived Atom, Multiple Sources',
  })
  const text = panel('Text')
  const counter = panel('Counter')
  const repeated = panel('Repeated')

  try {
    await expect.element(repeated.getByText('EFFECT EFFECT EFFECT', { exact: true })).toBeVisible()

    await text.getByPlaceholder('Enter text...').fill('Vue')
    await expect.element(repeated.getByText('Vue Vue Vue', { exact: true })).toBeVisible()

    await counter.getByRole('button', { name: 'Increase' }).click()
    await expect.element(repeated.getByText('Vue Vue Vue Vue', { exact: true })).toBeVisible()
  } finally {
    mounted.cleanup()
  }
})
