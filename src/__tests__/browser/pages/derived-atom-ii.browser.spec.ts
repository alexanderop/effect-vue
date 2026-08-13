import { expect, test } from 'vitest'

import { panel } from '../../support/browser'
import { mountExample } from '../../support/mountExample'

test('Derived Atom II recomputes when either source changes', async () => {
  const mounted = mountExample('derived-atom-ii')
  const text = panel('TEXT')
  const counter = panel('COUNTER')
  const repeated = panel('REPEATED')

  try {
    await expect.element(repeated.getByText('EFFECT EFFECT EFFECT', { exact: true })).toBeVisible()

    await text.getByPlaceholder('Enter text...').fill('Vue')
    await expect.element(repeated.getByText('Vue Vue Vue', { exact: true })).toBeVisible()

    await counter.getByRole('button', { name: 'Increase' }).click()
    await expect.element(repeated.getByText('Vue Vue Vue Vue', { exact: true })).toBeVisible()
  } finally {
    mounted.cleanup()
  }
})
