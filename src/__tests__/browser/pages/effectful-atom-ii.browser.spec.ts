import { afterEach, expect, test, vi } from 'vitest'

import { panel } from '../../support/browser'
import { mountExample } from '../../support/mountExample'

afterEach(() => {
  vi.unstubAllGlobals()
})

test('Effectful Atom II refreshes weather when the city changes', async () => {
  const fetchMock = vi.fn<(input: RequestInfo | URL) => Promise<Response>>(async (input) => {
    const url = String(input)
    const isLondon = url.includes('latitude=51.5074')
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

  const mounted = mountExample('effectful-atom-ii')
  const city = panel('CITY')
  const weather = panel('WEATHER')

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
