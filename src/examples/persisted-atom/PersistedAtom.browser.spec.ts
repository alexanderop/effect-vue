import { afterEach, beforeEach, expect, test } from 'vitest'

import { eventually, panel } from '@/testing/browser'
import { mountWithRegistry } from '@/testing/mountWithRegistry'

import PersistedAtom from './PersistedAtom.vue'

const clearStore = () => {
  localStorage.removeItem('effect-vue/name')
  localStorage.removeItem('effect-vue/theme')
}

beforeEach(clearStore)
afterEach(clearStore)

test('reads defaults and writes both values through to localStorage', async () => {
  const mounted = mountWithRegistry(PersistedAtom, { label: 'Persisted Atom' })
  const settings = panel('Settings')

  try {
    await expect.element(settings.getByPlaceholder('Your name')).toHaveValue('Ada')
    await expect.element(settings.getByText('dark', { exact: true })).toBeVisible()

    await settings.getByPlaceholder('Your name').fill('Grace')
    await settings.getByRole('button', { name: 'Toggle theme' }).click()
    await expect.element(settings.getByText('light', { exact: true })).toBeVisible()

    // The store is the source of truth, not the component.
    await eventually(() => {
      expect(localStorage.getItem('effect-vue/name')).toContain('Grace')
      expect(localStorage.getItem('effect-vue/theme')).toContain('light')
    })
  } finally {
    mounted.cleanup()
  }
})
