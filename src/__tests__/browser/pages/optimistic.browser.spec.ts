import { expect, test } from 'vitest'

import { eventually, panel } from '../../support/browser'
import { mountExample } from '../../support/mountExample'

test('Atom.optimistic updates immediately and then confirms server state', async () => {
  const mounted = mountExample('optimistic')
  const like = panel('LIKE')
  const button = like.getByRole('button')

  try {
    await expect.element(button).toHaveTextContent('41')
    await button.click()
    await expect.element(button).toHaveTextContent('42')
    await eventually(() =>
      expect(mounted.host.querySelector('.server-row')?.textContent).toContain('42'),
    )
  } finally {
    mounted.cleanup()
  }
})
