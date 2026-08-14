import { expect, test } from 'vitest'
import { page } from 'vitest/browser'

import { mountExampleView } from '@/testing/mountExampleView'

test('renders an example page with its root component and teaching notes', async () => {
  const mounted = mountExampleView('basic-atom')

  try {
    await expect.element(page.getByText('Interactive example', { exact: true })).toBeVisible()

    // The page renders the example's own root component, not a playground.
    await expect.element(page.getByRole('region', { name: 'Counter' })).toBeVisible()
    await expect.element(page.getByRole('button', { name: 'Increase' })).toBeVisible()

    await expect.element(page.getByRole('heading', { name: 'In Effect' })).toBeVisible()
    await expect.element(page.getByRole('heading', { name: 'In Vue' })).toBeVisible()
    await expect.element(page.getByText('Atom.make', { exact: true })).toBeVisible()

    expect(mounted.host.querySelector('iframe')).toBeNull()
  } finally {
    mounted.cleanup()
  }
})

test('provides each page its own registry so state does not leak between examples', async () => {
  const first = mountExampleView('basic-atom')

  try {
    await page.getByRole('button', { name: 'Increase' }).click()
    await expect
      .element(page.getByRole('region', { name: 'Counter' }).getByText('1', { exact: true }))
      .toBeVisible()
  } finally {
    first.cleanup()
  }

  const second = mountExampleView('basic-atom')

  try {
    await expect
      .element(page.getByRole('region', { name: 'Counter' }).getByText('0', { exact: true }))
      .toBeVisible()
  } finally {
    second.cleanup()
  }
})
