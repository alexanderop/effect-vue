import { expect, test } from 'vitest'

import { eventually, panel } from '@/testing/browser'
import { mountWithRegistry } from '@/testing/mountWithRegistry'

import AtomOptimistic from './AtomOptimistic.vue'

// The example holds its "server" state in a module-level variable, so this is
// one flow rather than two tests: a second test would inherit the first one's
// like and assert against the wrong starting point.
test('applies the optimistic value, confirms it, and rolls back on failure', async () => {
  const mounted = mountWithRegistry(AtomOptimistic, { label: 'Atom.optimistic' })
  const like = panel('Like')
  const button = like.getByRole('button')
  const serverRow = () => mounted.host.querySelector('.server-row')?.textContent

  try {
    await expect.element(button).toHaveTextContent('41')

    // The count moves before the 1.2s mutation resolves.
    await button.click()
    await expect.element(button).toHaveTextContent('42')
    await eventually(() => expect(serverRow()).toContain('42'))

    await like.getByRole('checkbox', { name: 'Simulate Network Failures' }).click()

    // Optimistic unlike, then the mutation fails and the value is discarded.
    await button.click()
    await expect.element(button).toHaveTextContent('41')
    await eventually(() => expect(button.element().textContent).toContain('42'))
    expect(serverRow()).toContain('42')
  } finally {
    mounted.cleanup()
  }
})
