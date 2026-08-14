import { expect, test } from 'vitest'
import { page } from 'vitest/browser'

import { eventually } from '@/testing/browser'
import { mountWithRegistry } from '@/testing/mountWithRegistry'

import AtomSwr from './AtomSwr.vue'

// `Atom.windowFocusSignal` counts a `visibilitychange` that leaves the document
// visible, which is what returning to the tab produces — and what this fires by
// hand, since a headless browser never loses focus.
//
// The real event bubbles from the document up to the window, and the listener is
// on the window, so the simulated one has to bubble as well.
const returnToTab = () => document.dispatchEvent(new Event('visibilitychange', { bubbles: true }))

test('refetches on focus only when the value is stale, unless told always', async () => {
  const mounted = mountWithRegistry(AtomSwr, { label: 'Stale-While-Revalidate' })

  const freshLoads = page.getByRole('group', { name: 'Fresh first loads' })
  const alwaysLoads = page.getByRole('group', { name: 'Always loads' })

  try {
    await eventually(() => expect(freshLoads.element().textContent).toContain('1'))
    await eventually(() => expect(alwaysLoads.element().textContent).toContain('1'))

    returnToTab()

    await eventually(() => expect(alwaysLoads.element().textContent).toContain('2'))

    // Well inside the five-second staleTime, so this one did not refetch.
    expect(freshLoads.element().textContent).toContain('1')

    // A manual refresh is forceful regardless.
    await page.getByRole('region', { name: 'Fresh first' }).getByRole('button').click()
    await eventually(() => expect(freshLoads.element().textContent).toContain('2'))
  } finally {
    mounted.cleanup()
  }
})
