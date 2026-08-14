import { expect, test } from 'vitest'

import { eventually, panel } from '@/testing/browser'
import { mountWithRegistry } from '@/testing/mountWithRegistry'

import AtomFamily from './AtomFamily.vue'

test('keeps a separate count per family key and resubscribes on selection', async () => {
  const mounted = mountWithRegistry(AtomFamily, { label: 'Atom Family' })
  const selector = panel('Selector')
  const votes = panel('Votes')

  // Both the selected-value readout and the buttons carry framework names, so
  // scope the readout assertion to the value element.
  const selected = () => selector.element().querySelector('.value')?.textContent
  const count = () => votes.element().querySelector('.value')?.textContent

  try {
    await eventually(() => expect(selected()).toBe('Vue'))

    await votes.getByRole('button', { name: 'Vote for Vue' }).click()
    await votes.getByRole('button', { name: 'Vote for Vue' }).click()
    await eventually(() => expect(count()).toBe('2'))

    // Selecting another framework resubscribes to that key's own atom.
    await selector.getByRole('button', { name: 'Solid' }).click()
    await eventually(() => expect(selected()).toBe('Solid'))
    await eventually(() => expect(count()).toBe('0'))

    await votes.getByRole('button', { name: 'Vote for Solid' }).click()
    await eventually(() => expect(count()).toBe('1'))

    // Vue's own count was never touched.
    await selector.getByRole('button', { name: 'Vue' }).click()
    await eventually(() => expect(count()).toBe('2'))
  } finally {
    mounted.cleanup()
  }
})
