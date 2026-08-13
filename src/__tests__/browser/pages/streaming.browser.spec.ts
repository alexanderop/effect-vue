import { expect, test } from 'vitest'

import { panel } from '../../support/browser'
import { mountExample } from '../../support/mountExample'

test('Streaming Search exercises scan, pull, and manual patterns', async () => {
  const mounted = mountExample('streaming')
  const streaming = panel('STREAMING SEARCH')

  try {
    await streaming.getByPlaceholder('Search items...').fill('Item 50')
    await streaming.getByRole('button', { name: 'Search' }).click()
    await expect.element(streaming.getByText('1 results', { exact: true })).toBeVisible()
    await expect.element(streaming.getByText('Item 50', { exact: true })).toBeVisible()

    await streaming.getByRole('button', { name: 'Pattern 2: Pull' }).click()
    await expect.element(streaming.getByText('5 results loaded', { exact: true })).toBeVisible()
    await streaming.getByRole('button', { name: 'Load More (5)' }).click()
    await expect.element(streaming.getByText('10 results loaded', { exact: true })).toBeVisible()

    await streaming.getByRole('button', { name: 'Pattern 3: Manual' }).click()
    await streaming.getByRole('button', { name: 'Search' }).click()
    await expect.element(streaming.getByText('1 results', { exact: true })).toBeVisible()
    await expect.element(streaming.getByText('Item 50', { exact: true })).toBeVisible()
  } finally {
    mounted.cleanup()
  }
})
