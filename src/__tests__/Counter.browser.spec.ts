import { AtomRegistry, registryKey } from '@effect/atom-vue'
import { expect, test } from 'vitest'
import { page } from 'vitest/browser'
import { createApp } from 'vue'

import Counter from '../examples/basic-atom/Counter.vue'

test('updates an Effect Atom through a real browser click', async () => {
  const host = document.createElement('div')
  document.body.append(host)

  const registry = AtomRegistry.make()
  const app = createApp(Counter)
  app.provide(registryKey, registry)
  app.mount(host)

  try {
    await expect.element(page.getByText('0', { exact: true })).toBeVisible()

    await page.getByRole('button', { name: 'Increase' }).click()
    await expect.element(page.getByText('1', { exact: true })).toBeVisible()

    await page.getByRole('button', { name: 'Reset' }).click()
    await expect.element(page.getByText('0', { exact: true })).toBeVisible()
  } finally {
    app.unmount()
    registry.dispose()
    host.remove()
  }
})
