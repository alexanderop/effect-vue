import { expect, test } from 'vitest'
import { page } from 'vitest/browser'
import { createApp } from 'vue'

import ExampleView from '../views/ExampleView.vue'

test('renders an example as a normal app page without playground chrome', async () => {
  const host = document.createElement('div')
  document.body.append(host)

  const app = createApp(ExampleView, { slug: 'basic-atom' })
  app.mount(host)

  try {
    await expect.element(page.getByText('Interactive example', { exact: true })).toBeVisible()
    await expect.element(page.getByRole('button', { name: 'Increase' })).toBeVisible()

    expect(host.querySelector('iframe')).toBeNull()
    expect(host.querySelector('pre, code, textarea')).toBeNull()
  } finally {
    app.unmount()
    host.remove()
  }
})
