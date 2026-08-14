import { expect, test } from 'vitest'

import { panel } from '@/testing/browser'
import { mountWithRegistry } from '@/testing/mountWithRegistry'

import WritableDerivedAtom from './WritableDerivedAtom.vue'

test('writes through the derived atom back to its source', async () => {
  const mounted = mountWithRegistry(WritableDerivedAtom, { label: 'Writable Derived Atom' })
  const celsius = panel('Celsius')
  const fahrenheit = panel('Fahrenheit')

  try {
    await expect.element(celsius.getByText('20.0°C', { exact: true })).toBeVisible()
    await expect.element(fahrenheit.getByText('68°F', { exact: true })).toBeVisible()

    await celsius.getByRole('button', { name: '+5°' }).click()
    await expect.element(celsius.getByText('25.0°C', { exact: true })).toBeVisible()
    await expect.element(fahrenheit.getByText('77°F', { exact: true })).toBeVisible()

    // Writing the derived atom updates the source, and both panels follow.
    await fahrenheit.getByRole('button', { name: '-10°' }).click()
    await expect.element(fahrenheit.getByText('67°F', { exact: true })).toBeVisible()
    await expect.element(celsius.getByText('19.4°C', { exact: true })).toBeVisible()
  } finally {
    mounted.cleanup()
  }
})
