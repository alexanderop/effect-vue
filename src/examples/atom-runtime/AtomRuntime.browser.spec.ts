import { expect, test } from 'vitest'

import { panel } from '@/testing/browser'
import { mountWithRegistry } from '@/testing/mountWithRegistry'

import AtomRuntime from './AtomRuntime.vue'

test('runs an Effect against the service provided by the runtime', async () => {
  const mounted = mountWithRegistry(AtomRuntime, { label: 'Atom.runtime' })
  const greeting = panel('Greeting')

  try {
    await expect.element(greeting.getByText('Nothing yet', { exact: true })).toBeVisible()

    await greeting.getByPlaceholder('Your name').fill('Ada')
    await greeting.getByRole('button', { name: 'Greet' }).click()

    await expect.element(greeting.getByText('Hello, Ada!', { exact: true })).toBeVisible()
  } finally {
    mounted.cleanup()
  }
})
