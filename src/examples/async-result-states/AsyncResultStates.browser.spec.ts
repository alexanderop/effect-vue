import { expect, test } from 'vitest'

import { eventually, panel } from '@/testing/browser'
import { mountWithRegistry } from '@/testing/mountWithRegistry'

import AsyncResultStates from './AsyncResultStates.vue'

// The atom fails about half the time on purpose, so this asserts the state
// machine rather than one lucky outcome.
test('moves from Initial to a settled Success or Failure', async () => {
  const mounted = mountWithRegistry(AsyncResultStates, { label: 'AsyncResult States' })
  const quote = panel('Quote')

  try {
    await expect.element(quote.getByText('Initial · waiting', { exact: true })).toBeVisible()

    await eventually(() => {
      const state = quote.element().textContent ?? ''
      expect(state).toMatch(/Success|Failure/)
      expect(state).not.toContain('waiting')
    })

    await quote.getByRole('button', { name: 'Try again' }).click()

    await eventually(() => {
      expect(quote.element().textContent ?? '').toMatch(/Success|Failure/)
    })
  } finally {
    mounted.cleanup()
  }
})
