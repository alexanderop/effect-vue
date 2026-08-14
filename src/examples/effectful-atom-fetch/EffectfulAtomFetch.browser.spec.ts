import { afterEach, expect, test, vi } from 'vitest'

import { panel } from '@/testing/browser'
import { mountWithRegistry } from '@/testing/mountWithRegistry'

import EffectfulAtomFetch from './EffectfulAtomFetch.vue'

afterEach(() => {
  vi.unstubAllGlobals()
})

// The example talks to Open-Meteo. Stub the transport at its boundary so the
// suite never depends on a public API being reachable.
test('refetches weather when the city changes', async () => {
  const fetchMock = vi.fn<(input: RequestInfo | URL) => Promise<Response>>(async (input) => {
    const isLondon = String(input).includes('latitude=51.5074')
    return new Response(
      JSON.stringify({
        current: {
          temperature_2m: isLondon ? 12 : 21,
          relative_humidity_2m: isLondon ? 74 : 55,
        },
      }),
      { headers: { 'Content-Type': 'application/json' } },
    )
  })
  vi.stubGlobal('fetch', fetchMock)

  const mounted = mountWithRegistry(EffectfulAtomFetch, {
    label: 'Effectful Atom, Real Request',
  })
  const city = panel('City')
  const weather = panel('Weather')

  try {
    await expect.element(weather.getByText('21°C', { exact: true })).toBeVisible()

    await city.getByRole('button', { name: 'London' }).click()

    await expect.element(city.getByRole('button', { name: 'London' })).toBeDisabled()
    await expect.element(weather.getByText('12°C', { exact: true })).toBeVisible()
    await expect.element(weather.getByText('74% humidity', { exact: true })).toBeVisible()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  } finally {
    mounted.cleanup()
  }
})
