import { AtomRegistry } from '@effect/atom-vue'
import { expect, test } from 'vitest'
import { page } from 'vitest/browser'

import BasicAtomCounter from '@/examples/basic-atom/BasicAtomCounter.vue'
import DerivedAtomCounter from '@/examples/derived-atom/DerivedAtomCounter.vue'
import DerivedAtomDoubled from '@/examples/derived-atom/DerivedAtomDoubled.vue'
import { mountWithRegistry } from '@/testing/mountWithRegistry'

test('keeps separate Vue app registries isolated', async () => {
  const firstMount = mountWithRegistry(BasicAtomCounter, { label: 'First counter' })
  const secondMount = mountWithRegistry(BasicAtomCounter, { label: 'Second counter' })
  const first = page.getByRole('region', { name: 'First counter' })
  const second = page.getByRole('region', { name: 'Second counter' })

  try {
    await first.getByRole('button', { name: 'Increase' }).click()

    await expect.element(first.getByText('1', { exact: true })).toBeVisible()
    await expect.element(second.getByText('0', { exact: true })).toBeVisible()
  } finally {
    firstMount.cleanup()
    secondMount.cleanup()
  }
})

test('updates a derived atom across Vue components sharing one registry', async () => {
  const registry = AtomRegistry.make()
  const counterMount = mountWithRegistry(DerivedAtomCounter, {
    label: 'Source counter',
    registry,
  })
  const doubledMount = mountWithRegistry(DerivedAtomDoubled, {
    label: 'Doubled count',
    registry,
  })
  const counter = page.getByRole('region', { name: 'Source counter' })
  const doubled = page.getByRole('region', { name: 'Doubled count' })

  try {
    await expect.element(counter.getByText('0', { exact: true })).toBeVisible()
    await expect.element(doubled.getByText('0', { exact: true })).toBeVisible()

    await counter.getByRole('button', { name: 'Increase' }).click()

    await expect.element(counter.getByText('1', { exact: true })).toBeVisible()
    await expect.element(doubled.getByText('2', { exact: true })).toBeVisible()
  } finally {
    counterMount.cleanup()
    doubledMount.cleanup()
    registry.dispose()
  }
})
