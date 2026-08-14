import { expect, test } from 'vitest'

import { eventually, panel } from '@/testing/browser'
import { mountWithRegistry } from '@/testing/mountWithRegistry'

import SearchParam from './SearchParam.vue'

test('writes both parameters to the URL and reads a navigation back', async () => {
  // This example really does call pushState, so the runner's URL is restored
  // afterwards rather than left with the example's parameters on it.
  const originalUrl = `${window.location.pathname}${window.location.search}`

  const mounted = mountWithRegistry(SearchParam, { label: 'URL Search Params' })
  const query = panel('Query')
  const page = panel('Page')
  const location = panel('Location')

  try {
    await query.getByRole('textbox', { name: 'Query' }).fill('effect')
    await eventually(() => expect(window.location.search).toContain('q=effect'))

    await page.getByRole('button', { name: 'Next' }).click()
    await eventually(() => expect(window.location.search).toContain('page=2'))

    // The Location panel reads window.location back, so it proves the round trip.
    await eventually(() => expect(location.element().textContent).toContain('q=effect'))

    // Writing None removes the parameter instead of setting it to an empty value.
    await page.getByRole('button', { name: 'Clear' }).click()
    await eventually(() => expect(window.location.search).not.toContain('page='))

    // A back or forward navigation pushes into the atoms, which is what the
    // popstate listener inside `searchParam` is for.
    window.history.replaceState({}, '', `${window.location.pathname}?q=stream&page=7`)
    window.dispatchEvent(new PopStateEvent('popstate'))

    await expect.element(query.getByRole('textbox', { name: 'Query' })).toHaveValue('stream')
    await expect.element(page.getByText('7', { exact: true })).toBeVisible()
  } finally {
    mounted.cleanup()
    window.history.replaceState({}, '', originalUrl)
  }
})
