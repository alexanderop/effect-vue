import { expect, test } from 'vitest'
import { page } from 'vitest/browser'

import { eventually, panel } from '@/testing/browser'
import { mountWithRegistry } from '@/testing/mountWithRegistry'

import AtomDebounce from './AtomDebounce.vue'

// The debounce window is real time here, on purpose: the Node spec pins the
// timer semantics, and this covers what a user actually sees while typing.
test('lags the debounced value behind typing and searches once per burst', async () => {
  const mounted = mountWithRegistry(AtomDebounce, { label: 'Debounced Atom' })
  const query = panel('Query')
  const results = panel('Results')

  const typed = page.getByRole('group', { name: 'Typed' })
  const debounced = page.getByRole('group', { name: 'Debounced' })
  const searchesRun = page.getByRole('group', { name: 'Searches run' })

  try {
    // The initial empty query is a search of its own, so the count starts at one.
    await eventually(() => expect(searchesRun.element().textContent).toContain('1'))

    const input = query.getByRole('textbox', { name: 'Query' })
    await input.fill('S')
    await input.fill('St')
    await input.fill('Str')

    // Typed is already current while debounced still holds the previous value.
    expect(typed.element().textContent).toContain('Str')
    expect(debounced.element().textContent).not.toContain('Str')

    await eventually(() => expect(debounced.element().textContent).toContain('Str'))
    await expect.element(results.getByText('Stream', { exact: true })).toBeVisible()

    // One burst, one extra search.
    expect(searchesRun.element().textContent).toContain('2')
  } finally {
    mounted.cleanup()
  }
})
