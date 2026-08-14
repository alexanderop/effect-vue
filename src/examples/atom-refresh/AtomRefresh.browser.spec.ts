import { expect, test } from 'vitest'

import { eventually, panel } from '@/testing/browser'
import { mountWithRegistry } from '@/testing/mountWithRegistry'

import AtomRefresh from './AtomRefresh.vue'

// The auto-refresh interval is three seconds of real time, which belongs in the
// Node spec on a TestClock. This covers the user-visible refresh instead.
test('refreshes on demand and keeps the previous value while it runs', async () => {
  const mounted = mountWithRegistry(AtomRefresh, { label: 'Refresh And Revalidate' })
  const manual = panel('Manual refresh')

  try {
    await eventually(() => expect(manual.element().textContent).toMatch(/\$\d+\.\d{2}/))
    const before = manual.element().textContent

    await manual.getByRole('button', { name: 'Refresh' }).click()
    await expect.element(manual.getByRole('button', { name: 'Refreshing…' })).toBeVisible()

    // The old price stays on screen while the next run is in flight.
    expect(manual.element().textContent).toContain(before?.match(/\$\d+\.\d{2}/)?.[0])

    await expect.element(manual.getByRole('button', { name: 'Refresh' })).toBeEnabled()
    expect(manual.element().textContent).toMatch(/\$\d+\.\d{2}/)
  } finally {
    mounted.cleanup()
  }
})
