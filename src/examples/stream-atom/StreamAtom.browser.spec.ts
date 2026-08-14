import { expect, test } from 'vitest'

import { eventually, panel } from '@/testing/browser'
import { mountWithRegistry } from '@/testing/mountWithRegistry'

import StreamAtom from './StreamAtom.vue'

test('advances the tick and the derived elapsed panel while mounted', async () => {
  const mounted = mountWithRegistry(StreamAtom, { label: 'Stream Atom' })
  const ticks = panel('Ticks')
  const elapsed = panel('Elapsed')

  try {
    await expect.element(elapsed.getByText('0.0s', { exact: true })).toBeVisible()

    await expect.element(ticks.getByText('0', { exact: true })).toBeVisible()
    await expect.element(elapsed.getByText('0.3s', { exact: true })).toBeVisible()

    await eventually(() => expect(ticks.element().textContent).toContain('2'))
    await expect.element(elapsed.getByText('0.9s', { exact: true })).toBeVisible()
  } finally {
    mounted.cleanup()
  }
})
