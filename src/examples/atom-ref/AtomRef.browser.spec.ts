import { expect, test } from 'vitest'
import { page } from 'vitest/browser'

import { panel } from '@/testing/browser'
import { mountWithRegistry } from '@/testing/mountWithRegistry'

import AtomRefExample from './AtomRef.vue'

// The refs are module-scoped and never disposed by a registry, so this is one
// ordered flow rather than several tests inheriting each other's writes.
test('shares a draft across panels and edits a collection in place', async () => {
  const mounted = mountWithRegistry(AtomRefExample, { label: 'AtomRef' })
  const draft = panel('Draft')
  const summary = panel('Summary')
  const tags = panel('Tags')

  const characters = page.getByRole('group', { name: 'Characters' })

  try {
    await expect.element(summary.getByText('Atoms in Vue', { exact: true })).toBeVisible()
    expect(characters.element().textContent).toContain('12')

    // A write through one prop ref reaches the parent and the derived length.
    await draft.getByRole('textbox', { name: 'Title' }).fill('Refs')
    await expect.element(summary.getByText('Refs', { exact: true })).toBeVisible()
    expect(characters.element().textContent).toContain('4')

    await draft.getByRole('textbox', { name: 'Body' }).fill('local state')
    expect(characters.element().textContent).toContain('15')

    // The collection: add, edit one item ref, remove it.
    await tags.getByRole('textbox', { name: 'New tag' }).fill('atom')
    await tags.getByRole('button', { name: 'Add' }).click()
    await expect.element(tags.getByRole('textbox', { name: 'Tag atom' })).toBeVisible()

    await tags.getByRole('textbox', { name: 'Tag effect' }).fill('effect-atom')
    await expect.element(tags.getByRole('textbox', { name: 'Tag effect-atom' })).toBeVisible()

    await tags.getByRole('button', { name: 'Remove effect-atom' }).click()
    expect(tags.element().textContent).not.toContain('effect-atom')
  } finally {
    mounted.cleanup()
  }
})
