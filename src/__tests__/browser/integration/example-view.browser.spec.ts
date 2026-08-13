import { expect, test } from 'vitest'
import { page } from 'vitest/browser'

import { mountExample } from '../../support/mountExample'

test('renders an example as a normal app page without playground chrome', async () => {
  const mounted = mountExample('basic-atom')

  try {
    await expect.element(page.getByText('Interactive example', { exact: true })).toBeVisible()
    await expect.element(page.getByRole('button', { name: 'Increase' })).toBeVisible()

    expect(mounted.host.querySelector('iframe')).toBeNull()
    expect(mounted.host.querySelector('pre, code, textarea')).toBeNull()
  } finally {
    mounted.cleanup()
  }
})
