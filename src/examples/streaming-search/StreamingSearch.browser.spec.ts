import { expect, test } from 'vitest'
import { page } from 'vitest/browser'

import { mountWithRegistry } from '@/testing/mountWithRegistry'

import StreamingSearch from './StreamingSearch.vue'

// This example owns its own shell rather than a panel grid, so the spec scopes
// to the mount host instead of a BasePanel region.
test('exercises the scan, pull, and manual patterns', async () => {
  const mounted = mountWithRegistry(StreamingSearch, { label: 'Streaming Search' })
  const search = page.getByRole('region', { name: 'Streaming Search' })

  try {
    await search.getByPlaceholder('Search items...').fill('Item 50')
    await search.getByRole('button', { name: 'Search' }).click()
    await expect.element(search.getByText('1 results', { exact: true })).toBeVisible()
    await expect.element(search.getByText('Item 50', { exact: true })).toBeVisible()

    await search.getByRole('button', { name: 'Pattern 2: Pull' }).click()
    await expect.element(search.getByText('5 results loaded', { exact: true })).toBeVisible()
    await search.getByRole('button', { name: 'Load More (5)' }).click()
    await expect.element(search.getByText('10 results loaded', { exact: true })).toBeVisible()

    await search.getByRole('button', { name: 'Pattern 3: Manual' }).click()
    await search.getByRole('button', { name: 'Search' }).click()
    await expect.element(search.getByText('1 results', { exact: true })).toBeVisible()
    await expect.element(search.getByText('Item 50', { exact: true })).toBeVisible()
  } finally {
    mounted.cleanup()
  }
})
