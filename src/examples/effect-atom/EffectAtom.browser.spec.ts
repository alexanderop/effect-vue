import { expect, test } from 'vitest'

import { panel } from '@/testing/browser'
import { mountWithRegistry } from '@/testing/mountWithRegistry'

import EffectAtom from './EffectAtom.vue'

test('loads the user and refetches through the registry', async () => {
  const mounted = mountWithRegistry(EffectAtom, { label: 'Atom From An Effect' })
  const user = panel('User')

  try {
    await expect.element(user.getByText('Loading…', { exact: true })).toBeVisible()
    await expect.element(user.getByText('Ada Lovelace · 372 commits')).toBeVisible()

    await user.getByRole('button', { name: 'Refetch' }).click()
    await expect.element(user.getByRole('button', { name: 'Fetching…' })).toBeVisible()

    // The stale value stays on screen while the refresh is in flight.
    await expect.element(user.getByText('Ada Lovelace · 372 commits')).toBeVisible()
    await expect.element(user.getByRole('button', { name: 'Refetch' })).toBeEnabled()
  } finally {
    mounted.cleanup()
  }
})
